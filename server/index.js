import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attackRoutes from "./routes/attackRoutes.js";
import connectDB from "./config/db.js";
import path from 'path'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// app.set("trust proxy", true);
// app.use((req, res, next) => {
//   const info = getClientIpInfo(req, { trustProxy: true });
//   req.clientIp = info.ip;
//   req.clientIpType = info.type;
//   req.clientIpSource = info.source;
//   console.log("client ip:", info);
//   next();
// });
// app.use(express.static("public"));

app.use("/api/attacks", attackRoutes);

app.get("/",(req,res)=>{
    res.json({message:"Hello from server....."})
})

app.get("/myfile",(req,res)=>{
    res.sendFile(path.resolve("./public/getClientsIP.js"));
})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    connectDB(process.env.MONGO_URI)
    console.log("🚀 Server running on " + PORT)
});
