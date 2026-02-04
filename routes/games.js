const express = require("express");
const router = express.Router();
const Game = require("../models/Game")
const { model } = require("mongoose");
const requireAuth = require('../middleware/requireAuth');


//Read Route
router.get("/", requireAuth, async (req, res) => {
    const games = await Game.find().sort({createdAt:-1}).lean();
    res.render("games/index", {games});
});


//Create adds new games
router.post("/", requireAuth, async(req,res) => {
    try{
        const payload = {
            title: req.body.title,
            platform: req.body.platform,
            genre: req.body.genre,
            rating: Number(req.body.rating),
            releaseYear: req.body.releaseYear?Number(req.body.releaseYear):undefined,
            owner: req.user._id
        }

        await Game.create(payload);
        res.redirect("/");

    }catch(err){
        const games = await Game.find().sort({CreatedAt:-1}).lean();
        res.status(400).render("games/index", {
            games, 
            error: "Please fill out required form fields",
            form: req.body,
        });
    };
});

//Update Route
router.put("/games/:id", requireAuth, async(req,res) => {
    try{
        const payload = {
            ...req.body,
            rating: Number(req.body.rating),
            releaseYear: req.body.releaseYear?Number(req.body.releaseYear):undefined,
        }

        await Game.findByIdAndUpdate(req.params.id, payload, {runValidators: true});
        res.redirect("/");

    }catch(err){
        const game = await Game.findById(req.params.id).lean();
        res.status(400).render("games/index", {
            game:{...game, ...req.body},
            error: "Update failed: check required fields",
        });
    };
});

//Edit Page
router.get("/games/:id/edit", requireAuth, async (req,res) => {
    const game = await Game.findById(req.params.id).lean();
    if(!game){
        return res.status(404).send("Game not found");
    }
    res.render("games/edit", {game});
});

//Delete Route
router.delete("/games/:id", requireAuth, async (req,res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

module.exports = router;