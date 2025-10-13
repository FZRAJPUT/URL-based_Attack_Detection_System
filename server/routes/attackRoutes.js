import express from "express";
import { analyzeURL, exportAttacks, getAttacks } from "../controllers/attackController.js";
import { verifyToken } from "../utils/verifyUser.js";

const AttackRouter = express.Router();

AttackRouter.post("/analyze", analyzeURL);
AttackRouter.get("/", verifyToken, getAttacks);
AttackRouter.get("/export", verifyToken, exportAttacks);

export default AttackRouter;