import express, { application } from "express";
import {pool} from "../app.js"
import { createInvestor, getInvestor } from "../controllers/investorController.js";

const router = express.Router();

// GET /investors - list all investors
router.get("/", getInvestor);

// POST /investors - create a new investor
router.post("/", createInvestor);

export default router;