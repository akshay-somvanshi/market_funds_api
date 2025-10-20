import express, { application } from "express";
import {pool} from "../app.js"

const router = express.Router();

// GET /investors - list all investors
router.get("/", async(req, res) => {
    try{
        const {rows} = await pool.query("SELECT * FROM investors");
        res.status(200).json(rows);
    } catch (err){
        res.status(500).json({error: "Failed to fetch investors"})
    }
});

// POST /investors - create a new investor
router.get("/", async(req, res) => {
    const {name, investor_type, email} = req.body;
    try{
        const {rows} = await pool.query(`INSERT INTO investors (name, investor_type, email)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, investor_type, email]
        );
        res.status(201).json(rows[0]);
    } catch (err){
        res.status(500).json({error: "Failed to create investor"});
    }
});

export default router;