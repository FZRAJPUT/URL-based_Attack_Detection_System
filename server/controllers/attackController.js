import { Parser } from "json2csv";
import Attack from "../models/Attacks.js";
import { detectAttack } from "../utils/detector.js";
import dns from "dns/promises";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const analyzeURL = async (req, res) => {
  try {
    const { url } = req.body;

    // Get User IP
    let userIP =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    userIP = userIP.replace(/^::ffff:/, "");

    // Get Origin / Referer
    const origin = req.headers.origin || req.headers.referer || "Unknown";

    // Resolve Target IP
    let targetIP;
    try {
      const hostname = new URL(url).hostname;
      const lookupResult = await dns.lookup(hostname);
      targetIP = lookupResult.address;
    } catch {
      targetIP = "unresolved";
    }

    // Detect Attack
    const attackType = detectAttack(url);

    // Get Geo Location
    let location = geoip.lookup(userIP);
    if (!location) {
      if (userIP === "127.0.0.1" || userIP === "::1") {
        location = { country: "Localhost", region: "Local", city: "Development" };
      } else {
        location = { country: "Unknown", region: "Unknown", city: "Unknown" };
      }
    }

    // ✅ Parse User-Agent to get device info dynamically
    const parser = new UAParser(req.headers["user-agent"]);
    const deviceInfo = parser.getResult();

    const deviceDetails = {
      browser: `${deviceInfo.browser.name || "Unknown"} ${deviceInfo.browser.version || ""}`,
      os: `${deviceInfo.os.name || "Unknown"} ${deviceInfo.os.version || ""}`,
      deviceType: deviceInfo.device.type || "Desktop",
    };

    // Save to MongoDB
    const attack = new Attack({
      source_ip: userIP,
      target_ip: targetIP,
      url,
      attack_type: attackType,
      status: attackType === "Normal" ? "Safe" : "Attempted",
      origin,
      location,
      device_info: deviceDetails,
      timestamp: new Date(),
    });

    await attack.save();

    // Response
    res.json({
      message: "Analyzed successfully",
      attack: {
        url,
        source_ip: userIP,
        target_ip: targetIP,
        attack_type: attackType,
        status: attackType === "Normal" ? "Safe" : "Attempted",
        origin,
        location,
        device_info: deviceDetails,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAttacks = async (req, res) => {
  try {
    const { type, ip, status } = req.query;
    const query = {};

    if (type) query.attack_type = type;
    if (ip) query.source_ip = ip;
    if (status) query.status = status;

    const attacks = await Attack.find(query).sort({ timestamp: -1 });
    res.json(attacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportAttacks = async (req, res) => {
  try {
    const attacks = await Attack.find().lean(); // lean() returns plain JS objects (faster)

    if (!attacks.length) {
      return res.status(404).json({ message: "No attack records found." });
    }

    // Define CSV columns (optional)
    const fields = ["timestamp", "source_ip", "url", "attack_type", "status"];
    const parser = new Parser({ fields });
    const csv = parser.parse(attacks);

    // Set headers for direct CSV download
    res.header("Content-Type", "text/csv");
    res.attachment("attacks.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: "Error exporting data", error: error.message });
  }
};
