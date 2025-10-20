import express from "express";
import {pool} from "../app.js"
import { createFund, getAllFunds, getSpecificFund, updateFund } from "../controllers/fundController.js";
import { createInvestment, getInvestments } from "../controllers/investmentController.js";

const router = express.Router();

// --------- GET ---------

// GET /funds - List all funds
router.get("/", getAllFunds);

// GET /funds/{id} - Get a specific fund
router.get("/:id", getSpecificFund); 

// GET /funds/{fund_id}/investments - List all investments for a specific fund
router.get("/:id/investments", getInvestments);

// --------- POST ---------

// POST /funds - create a new fund
router.post("/", createFund); 

// POST /funds/{fund_id}/investments - Create a new investment to a fund
router.post("/:id/investments", createInvestment);

// --------- PUT ---------

// PUT /funds/{id} - Update fund
router.put("/:id?", updateFund);

export default router;