import express from "express";
import {pool} from "../app.js"

const router = express.Router();

export const getAllFunds = async (req, res) => {
    try{
        // Query the database
        const {rows} = await pool.query("SELECT * FROM funds ORDER BY created_at DESC");
        // Get the response in JSON format
        res.status(200).json(rows);
    } catch (err){
        res.status(500).json({error: "Failed to fetch funds"})
    }
};

export const getSpecificFund = async(req, res) => {
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
};

export const createFund = async(req,res) => {
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
};

export const updateFund = async (req, res) => {
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
};