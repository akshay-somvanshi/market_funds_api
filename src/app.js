import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import http from "http"

// Use the env file
dotenv.config();

const PORT = process.env.PORT || 5001;
const server = http.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            getReq(req, res);
            break;
        case "POST":
            postReq(req, res);
            break;
        case "PUT":
            putReq(req, res);
            break;
        case "DELETE":
            deleteReq(req, res);
            break;
        default:
            // Add a 404 not found error
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json")
            res.write(JSON.stringify({message: "Route not found!"}));
            res.end();
    }
});

// Listen to the port 
server.listen(PORT, () => {
    console.log(`I am on port ${PORT}`);
})
