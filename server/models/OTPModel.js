// models/otpModel.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    username: { type: String, required: true },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: { type: Date, expires: 300, default: Date.now }, // expires in 5 minutes
});

const otpModel = mongoose.models.otps || mongoose.model("otps", otpSchema);

export default otpModel