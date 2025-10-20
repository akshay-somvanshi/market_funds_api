import express from "express";
import {pool} from "../app.js"

const router = express.Router();

export const getInvestments = async(req, res) => {
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
};

export const createInvestment = async(req, res) =>{
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
    } catch (err){
        res.status(500).json({error: "Failed to create investment"});
    }
};