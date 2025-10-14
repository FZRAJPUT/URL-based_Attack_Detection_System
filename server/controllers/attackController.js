import { Parser } from "json2csv";
import Attack from "../models/attackModel.js";
import { detectAttack } from "../utils/detector.js";
import dns from "dns/promises";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import User from "../models/userModel.js";

export const analyzeURL = async (req, res) => {
  try {
    const { urls, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Invalid Email",
        success: false
      })
    }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "No URLs provided" });
    }

    // Get user IP
    let userIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    userIP = userIP.replace(/^::ffff:/, "");

    const origin = req.headers.origin || req.headers.referer || "Unknown";

    // Parse user-agent
    const parser = new UAParser(req.headers["user-agent"]);
    const deviceInfo = parser.getResult();
    const deviceDetails = {
      browser: `${deviceInfo.browser.name || "Unknown"} ${deviceInfo.browser.version || ""}`,
      os: `${deviceInfo.os.name || "Unknown"} ${deviceInfo.os.version || ""}`,
      deviceType: deviceInfo.device.type || "Desktop",
    };

    // Get user location
    let location = geoip.lookup(userIP);
    if (!location) {
      if (userIP === "127.0.0.1" || userIP === "::1") {
        location = { country: "Localhost", region: "Local", city: "Development" };
      } else {
        location = { country: "Unknown", region: "Unknown", city: "Unknown" };
      }
    }

    // Analyze each URL
    const results = await Promise.all(urls.map(async (url) => {
      let targetIP;
      try {
        const hostname = new URL(url).hostname;
        const lookupResult = await dns.lookup(hostname);
        targetIP = lookupResult.address;
      } catch {
        targetIP = "unresolved";
      }

      const attackType = detectAttack(url);

      const attack = new Attack({
        source_ip: userIP,
        target_ip: targetIP,
        url,
        attack_type: attackType,
        status: attackType === "Normal" ? "Safe" : "Attempted",
        origin,
        location,
        device_info: deviceDetails,
        user_info:user._id,
      });

      await attack.save();

      return {
        url,
        source_ip: userIP,
        target_ip: targetIP,
        attack_type: attackType,
        status: attackType === "Normal" ? "Safe" : "Attempted",
        origin,
        location,
        user_info: user._id,
        device_info: deviceDetails,
      };
    }));

    res.json({
      message: "Analyzed successfully",
      attacks: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const getAttacks = async (req, res) => {
  try {
    const attacks = await Attack.find({
      user_info: req.user.id,
      status: { $ne: "Safe" } 
    })
      .sort({ createdAt: -1 })
      .populate("user_info", "name email");

    return res.json({
      success: true,
      message: "Attacks excluding Safe status",
      count: attacks.length,
      attacks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const exportAttacks = async (req, res) => {
  try {
    const attacks = await Attack.find(req.user.id)
      .populate("user username email");

    if (!attacks.length) {
      return res.status(404).json({ message: "No attack records found." });
    }

    const fields = ["timestamp", "source_ip", "url", "attack_type", "status"];
    const parser = new Parser({ fields });
    const csv = parser.parse(attacks);

    res.header("Content-Type", "text/csv");
    res.attachment("attacks.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: "Error exporting data", error: error.message });
  }
};