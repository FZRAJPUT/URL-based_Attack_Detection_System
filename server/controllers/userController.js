import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpModel from "../models/OTPModel.js";
import { sendOTPEmail } from "../utils/sendOTP.js";

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "Email is not registered",
        success: false,
      });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.json({
        message: "Invalid Password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login Successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await otpModel.findOne({ email });

    if (!record) {
      return res.json({ success: false, message: "OTP expired or invalid" });
    }

    if (Number(record.otp) !== Number(otp)) {
      return res.json({ success: false, message: "Incorrect OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await otpModel.deleteOne({ email });
      return res.json({ success: false, message: "Email already in use" });
    }

    const newUser = new User({
      username: record.username,
      email: record.email,
      password: record.password,
    });

    await newUser.save();
    await otpModel.deleteOne({ email });

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};


export const userRegister = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password || !username) {
      return res.json({
        message: "All fields are required",
        success: false
      });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.json({
        message: "Email already registered",
        success: false
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashPass = await bcrypt.hash(password, 10);

    let otp = new otpModel({
      email,
      password: hashPass,
      username,
      otp: otpCode
    })

    await otp.save()

    let response = await sendOTPEmail(email, otpCode);

    if (!response.success) {
      return res.json({
        message: "Email not Sent...",
        success: false
      })
    }

    return res.json({
      message: `OTP sent to ${email}`,
      success: true
    });

  } catch (error) {
    console.log(error.message);
    return res.json({
      message: "Something went wrong, try again",
      success: false
    });
  }
};


export const getUser = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    return res.json({
      user: {
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.log(error.message);
    return res.json({
      message: error.message,
      success: false
    })
  }
}