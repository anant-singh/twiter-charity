/**
 * Created with Eighlark Innovations.
 * User: root
 * Date: 4/9/13
 * Time: 4:08 PM
 * Email: akshay.x666@gmail.com
 */
var passport        = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var twitterConfig = {
    consumerKey:        "3cRsFs9Imklo4jBtXfAzA",
    consumerSecret:     "3VbaUqo6HC9zaqtmseNRolysBcPUN59esIDLmyrYms",
    callbackURL:        "http://local.host:8080/auth/twitter/callback"
};

/**
 * Passport Initialization
 * ===================================================================================
 * ===================================================================================
 */
//passport.use(new TwitterStrategy({
//        consumerKey:    twitterConfig.consumerKey,
//        consumerSecret: twitterConfig.consumerSecret,
//        callbackURL:    twitterConfig.callbackURL
//    },
//    function(token, tokenSecret, profile, done) {
//        if (profile != null)
//            return done(null, profile);
//        return done(null, false, {msg: "Invalid username."});
//    }
//));
passport.use(new LocalStrategy(
    function(username, password, done) {
        if (username === "admin" && password === "admin") // stupid example
            return done(null, {name: "admin"});

        return done(null, false, { message: 'Incorrect username.' });
    }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/**
 * ===================================================================================
 * ===================================================================================
 */

module.exports.passport = passport;