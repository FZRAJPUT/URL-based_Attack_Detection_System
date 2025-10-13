import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attackRoutes from "./routes/attackRoutes.js";
import connectDB from "./config/db.js";
import path from 'path'
import userRouter from "./routes/userRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/attacks", attackRoutes);
app.use("/api/user", userRouter);

app.get("/",(req,res)=>{
    res.json({message:"Hello from server....."})
})

app.get("/attack_detection_system",(req,res)=>{
    res.sendFile(path.resolve("./public/connectUsers.js"));
})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    connectDB(process.env.MONGO_URI)
    console.log("🚀 Server running on " + PORT)
});
