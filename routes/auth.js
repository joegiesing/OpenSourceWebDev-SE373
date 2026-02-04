const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

//get routes to display register and login
router.get('/register', (req, res) => res.render('auth/register'));
router.get('/login', (req, res) => res.render('auth/login'));

//post route for register
router.post('/register', async(req, res) => {
    try{
        const {username, password} = req.body;

        const existing = await User.findOne({ username });

        if(existing){
            return res.status(400).render('auth/register', { error: "Username already exists" });
        }

        //hash encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //await User.create({ username, passwordhash });
        await User.create({ username, passwordhash: passwordHash });
        res.redirect("/login")

    }catch(err){
        res.status(400).render('auth/register', { error:"Registration failed"})
    }
});

//login via credentials
router.post('/login', passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect:"/login"
}));

//logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        res.redirect("/login");
    })
});


module.exports = router;

