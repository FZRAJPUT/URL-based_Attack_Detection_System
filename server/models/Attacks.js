import mongoose from "mongoose";

// const attackSchema = new mongoose.Schema({
//     timestamp: { type: Date, default: Date.now },
//     source_ip: String,
//     url: String,
//     attack_type: String,
//     status: {
//         type: String,
//         enum: ["Attempted", "Successful", "Safe"], // add "Safe"
//         required: true,
//     },
// });
const attackSchema = new mongoose.Schema({
    source_ip: String,
    target_ip: String,
    url: String,
    attack_type: String,
    status: {
        type: String,
        enum: ["Attempted", "Successful", "Safe"], // add "Safe"
        required: true,
    },
    origin: String,
    location: {
        country: String,
        region: String,
        city: String,
    },
    device_info: {
        browser: String,
        os: String,
        deviceType: String,
    },
    timestamp: { type: Date, default: Date.now },
});



export default mongoose.model("Attack", attackSchema);
