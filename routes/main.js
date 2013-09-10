/**
 * Routes
 */

var db = require('../lib/db');

module.exports = function(app, passportConn, moment) {

    // Define a middleware function to be used for every secured routes
    var auth = function(req, res, next){
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

    var stuff = {};

    //==================================================================
    // routes
    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/auth/twitter/callback', passportConn.passport.authenticate('twitter', {
        successRedirect: '/#/tweet',
        failureRedirect: '/'
    }));

    app.get('/tweet/info', auth, function(req, res) {
        res.json(req.user);
    });

    app.post('/tweet/data', auth, function(req, res) {
        stuff.user = req.user;
        stuff.data = req.body;
        console.log(stuff.data.dateToTweet + " " + stuff.data.timeToTweet);
        if (db.chSearch(stuff.data.dateToTweet, stuff.data.timeToTweet, moment))
            {console.log('Your message will be tweeted');res.end();}
        else
            {console.log('Some error occurred');res.end();}
    });
    //==================================================================

    //==================================================================
    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.get('/auth/twitter', passportConn.passport.authenticate('twitter'));

    // route to log out
    app.post('/logout', function(req, res){
        req.logOut();
        res.send(200);
    });
    //==================================================================

};