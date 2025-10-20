import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import fundRouter from "./routes/fund.js"

// Use the env file
dotenv.config();
const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5001;

// PostgreSQL connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Health check for debugging
app.get("/health", async(req, res) => {
    try{
        await pool.query("SELECT NOW()");
        res.json({status: "ok", database: "connected"})
    } catch (err) {
        console.error(err);
        res.status(500).json({status: "Error", database: "disconnected"});
    }
});

app.use("/funds", fundRouter);

// Default 404 error
app.use((req, res) => {
    res.status(404).json({message: "Route not found!"})
})

// Listen to the port 
app.listen(PORT, () => {
    console.log(`I am on port ${PORT}`);
})
