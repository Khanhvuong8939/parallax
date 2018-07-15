const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
        // Match Username
        let query = {username:username};
        console.log('get in');
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user){
                console.log('wrong1');
                return done(null, false, {message: 'No user found'});
            }

            // Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    console.log('wrong2');
                    return done(null, user);
                } else {
                    console.log('wrong3');
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        console.log('wrong2');
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('wrong2');

        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}