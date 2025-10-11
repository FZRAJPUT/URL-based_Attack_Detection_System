import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attackRoutes from "./routes/attackRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/attacks", attackRoutes);

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    connectDB(process.env.MONGO_URI)
    console.log("🚀 Server running on " + PORT);
});
