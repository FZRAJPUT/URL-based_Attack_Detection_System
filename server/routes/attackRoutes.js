import express from "express";
import { analyzeURL, exportAttacks, getAttacks } from "../controllers/attackController.js";

const AttackRouter = express.Router();

AttackRouter.post("/analyze", analyzeURL); // analyze a URL
AttackRouter.get("/", getAttacks);         // get attack logs
AttackRouter.get("/export", exportAttacks);

export default AttackRouter;
