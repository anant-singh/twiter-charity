/**
 * Routes
 */

var db          = require('../lib/db');
var validate   = require('validator').check;

module.exports = function(app, passportConn, moment) {

    // Define a middleware function to be used for every secured routes
    var auth = function(req, res, next){
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

    var status = {};

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
        status = {};
        var stuff = {};
        var timeStamp = moment(moment(req.body.dateToTweet).format('L') + " " + req.body.timeToTweet);
        var timeCurrent = moment();
        stuff.userName = req.user.username;
        stuff.data = req.body;
        stuff.data.tweet = '@' + stuff.userName + ' tweeted: ' + req.body.tweet;
        if (moment(moment(req.body.dateToTweet).format('L')).isBefore(moment().format('L'))) {
            status.mFlag = true;
            status.msg = 'Choose Current / Future date';
            res.send(status);
        } else if (timeStamp.isBefore(timeCurrent)) {
            status.mFlag = true;
            status.msg = 'Choose Current / Future Time';
            res.send(status);
        } else {
            db.chSave(stuff, moment, function(err) {
                if (err) {
                    status.mFlag = true;
                    status.msg = err;
                    return res.send(status);
                }
                status.mFlag = true;
                status.msg = "Your message will tweeted";
                return res.send(status);
            });
        }

    })
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