/**
 * Routes
 */

var db          = require('../lib/db'),
    moment      = require('moment'),
    validate    = require('validator').check,
    twitter     = require('../lib/twitter');

module.exports = function(app, passportConn) {

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
        successRedirect: '/#/stage',
        failureRedirect: '/'
    }));

    app.get('/tweet/info', auth, function(req, res) {
        res.send(req.user);
    });

    app.get('/check/reg', auth, function(req, res){
        db.CharityAccount
            .findOne({ 'userName': req.user.username })
            .exec(function(err, record) {
                if (err) {return res.send(err);}
                else if (record) {return res.send(record);}
                else {return res.send(404);}
            })
    });

    app.get('/tweet/timeline', auth, function(req, res) {
        twitter.getTimeline(function(err, data) {
            if (err) res.send(404);
            res.send(data);
        })
    })

    app.post('/tweet/data', auth, function(req, res) {
        db.chSave('tweet', req.user.username, req.body, function(err) {
            if (err) {
                return res.send({type: 'danger', msg: err});
            }
            return res.send({type: 'success', msg: 'Your message will be tweeted'});
        });
    })

    app.post('/account/data', auth, function(req, res) {
        db.chSave('account', req.user.username, req.body, function(err) {
            if (err) {
                return res.send({type: 'danger', msg: err});
            }
            return res.send({type: 'success', msg: 'Your account has been registered'});
        });
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