/**
 * Created with Eighlark Innovations.
 * User: root
 * Date: 4/9/13
 * Time: 4:08 PM
 * Email: akshay.x666@gmail.com
 */
var passport        = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    LocalStrategy   = require('passport-local').Strategy;
    settings        = require('../settings/config').settings;

/**
 * Passport Initialization
 * ===================================================================================
 * ===================================================================================
 */
passport.use(new TwitterStrategy({
        consumerKey:    settings.twitterConfig.consumerKey,
        consumerSecret: settings.twitterConfig.consumerSecret,
        callbackURL:    settings.uri + ":" + settings.port + '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        if (profile != null)
            return done(null, profile);
        return done(null, false, {msg: "Invalid username."});
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