const { timestamp } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

//Serves static files
app.use(express.static(path.join(__dirname, 'public')));

//Basic get route
app.get("/", (req,res) => {
    res.send("The server is running!");
});

app.get("/index", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log ("Hit index");
});

app.get("/page2", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'secondpage.html'));
    console.log ("Hit page2");
});

//Routes for data in data files
//JSON API data route
app.get("/api/data", (req,res) => {
    res.json({
        message:"Hello from the server",
        timestamp: new Date(),
        items: ["Node.js", "Express", "npm"]
    });
});

app.get("/api/course", (req,res) => {
    fs.readFile("data.json", "utf8", (err,data) => {
        //if failed
        if(err) {
            res.status(500).json({error: "Failed to read data file"});
            return;
        }
        //if success
        res.json(JSON.parse(data));
    });
});

//Route for running server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
