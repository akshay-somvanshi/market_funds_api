import express from "express";
import {pool} from "../app.js"

const router = express.Router();

// --------- GET ---------

// GET /funds - List all funds
router.get("/", async(req, res) => {
    try{
        // Query the database
        const {rows} = await pool.query("SELECT * FROM funds ORDER BY created_at DESC");
        // Get the response in JSON format
        res.status(200).json(rows);
    } catch (err){
        res.status(500).json({error: "Failed to fetch funds"})
    }
});

// GET /funds/{id} - Get a specific fund
router.get("/:id", async(req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM funds WHERE id=$1', [id]);
        if(rows.length == 0){
            return res.status(404).json({error: "Fund not found"});
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({error: "Failed to fetch fund"});
    }
}); 

// GET /funds/{fund_id}/investments - List all investments for a specific fund
router.get("/:id/investments", async(req, res) => {
    const {id} = req.params; 
    try{
        const {rows} = await pool.query(`SELECT * FROM investments WHERE fund_id=$1`, [id]);
        if(rows.length == 0){
            return res.status(404).json({error: "Investment not found"});
        }
        res.status(200).json(rows);
    } catch (err){
        res.status(500).json({error: "Faild to fetch investment"});
    }
});

// --------- POST ---------

// POST /funds - create a new fund
router.post("/", async(req,res) => {
    const {name, vintage_year, target_size_usd, status} = req.body;
    try{
        const {rows} = await pool.query(
            `INSERT INTO funds (name, vintage_year, target_size_usd, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`, 
            [name, vintage_year, target_size_usd, status]
        );
        res.status(201).json(rows[0]);
    } catch (err){
        res.status(500).json({error: "Failed to create fund"});
    }
}); 

// POST /funds/{fund_id}/investments - Create a new investment to a fund
router.post("/:id/investments", async(req, res) =>{
    const {id} = req.params;
    const {investor_id, amount_usd, investment_date} = req.body;
    try{
        const {rows} = await pool.query(
            `INSERT INTO investments (fund_id, investor_id, amount_usd, investment_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [id, investor_id, amount_usd, investment_date]
        );
        res.status(201).json(rows[0]);
    } catch (err){\
        res.status(500).json({error: "Failed to create investment"});
    }
});

// --------- PUT ---------

// PUT /funds/{id} - Update fund
router.put("/:id?", async (req, res) => {
    // Take the id either from the parameters or the body 
    const id = req.params.id || req.body.id;

    const {name, vintage_year, target_size_usd, status}= req.body;
    try{
        const {rows} = await pool.query(
            `UPDATE funds SET name=$1, vintage_year=$2, target_size_usd=$3, status=$4,
            updated_at=NOW()
            WHERE id = $5
            RETURNING *`, 
            [name, vintage_year, target_size_usd, status, id]
        );
        if(rows.length == 0){
            return res.status(404).json({error: "Fund not found"});
        }
        res.status(200).json(rows[0]);
    } catch (err){
        res.status(500).json({error: "Failed to update fund"})
    }
});

export default router;