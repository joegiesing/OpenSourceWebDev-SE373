const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try{
            const user = await User.findOne({username});

            //check if that user is valid
            if(!user)return done(null, false, {message:"Invalid user not found"});

            const ok = await bcrypt.compare(password, user.passwordhash);

            //check if that pass is correct
            if(!ok)return done(null, false, {message:"Password does not match"});

            return done(null,user);

        }catch(err){
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    //store userId in session
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }catch(err){
        done(err);
    }
});