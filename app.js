const { timestamp, error } = require('console');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const methodOverride = require("method-override");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const gamesRouter = require("./routes/games");
const {engine} = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");

//Setup the templating engine
app.engine("hbs", engine({extname:".hbs"}))
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//Check for missing MongoDB URI
if(!MONGO_URI){
    console.error("Missing connection data")
    process.exit(1);
}

//Serves static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//setup router
//app.use("/", gamesRouter);


//connect to database
async function connectToMongo() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database");
    } catch (err) {
        console.error("Failed to connect to Database", err.message);
        process.exit(1);
    }
}

//setup passport authentication
app.use(
    session(
        {
            secret: process.env.SESSION_SECRET,
            resave:false,
            saveUninitialized:false,
            store: MongoStore.create(
                { 
                    // mongoUrl:process.env.MONGO_URI,
                    // dbName: "games"
                    mongoUrl: MONGO_URI,
                    touchAfter: 24 * 3600
                }
            ),
            cookie:{httpOnly:true}, 
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
})

require("./auth/passport");

const authRouter = require('./routes/auth');
app.use('/', authRouter);

//setup router
app.use("/", gamesRouter);

//Basic get route
app.get("/", (req,res) => {
    res.send("The server is running!");
});

app.get("/index", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log ("Hit index");
});

// app.get("/page2", (req,res) => {
//     res.sendFile(path.join(__dirname, 'public', 'secondpage.html'));
//     console.log ("Hit page2");
// });


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


// //Routes connected to database
const videogames = new mongoose.Schema({}, {strict:false});
const Games = mongoose.model("videogames", videogames);

app.get("/api/games", async (req,res) => {
    const data = await Games.find();
    console.log(data);
    res.json(data);
});

app.get("/api/games/:game", async (req,res) => {
    console.log(req.params.game);
    const gInfo = req.params.game;
    const gameInfo = await Games.findOne({game: gInfo});
    console.log(gameInfo);
    res.json(gameInfo);
});


connectToMongo().then(() => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

//catch all route
app.use((req,res,)=>{
    res.status(404).redirect("/login")
});