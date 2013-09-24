/**
 * Routes
 */

var db          = require('../lib/db'),
    moment      = require('moment'),
    validate    = require('validator').check,
    settings    = require('../settings/config').settings;
    twitter     = require('../lib/twitter');

module.exports = function(app, passportConn) {

    // Define a middleware function to be used for every secured routes
    var auth = function(req, res, next){
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

    var isadmin = function(req, res, next) {
        if (req.user.username != settings.username)
            res.redirect('/');
        else
            next();
    }

    //==================================================================
    // routes
    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/logout', function(req, res){
        res.render('logout');
    });

    app.get('/auth/twitter/callback', function(req, res, next) {
        passportConn.passport.authenticate('twitter', function(err, user, info) {
            if (err) {return next(err);}
            if (!user) {return res.redirect('/');}
            req.logIn(user, function(err) {
                if (err) {return next(err); }
                console.log(user.username + settings.username);
                if (user.username == settings.username) {return res.redirect('/#/admin');}
                db.CharityAccount
                    .findOne({ 'userName': user.username })
                    .exec(function(err, record) {
                        if (err) {return next(err);}
                        if (!record) {return res.redirect('/#/register')}
                        return res.redirect('/#/denied');
                    })
            });
        })(req, res, next);
    });

    app.get('/info/isadmin', auth, isadmin, function(req, res) {
        res.send({flag: true});
    });

    app.get('/info/admin/getlist', auth, isadmin, function(req, res) {
        db.CharityAccount
            .find({'__v': 0})
            .exec(function(err, record) {
                if (err) {res.send(err);}
                console.log(record);
                res.send(record);
            })
    });

    app.get('/info/user', auth, function(req, res) {
        res.send(req.user);
    });

    app.get('/auth/approved', auth, function(req, res) {
        db.CharityAccount
            .findOne({'userName': req.user.username})
            .exec(function(err, record) {
                if (err) {res.send(err);}
                res.send(record);
            })
    });

    app.get('/info/public/timeline', function(req, res) {
        twitter.getTimeline(function(err, data) {
            if (err) res.send(404);
            res.send(data);
        })
    })

    app.get('/info/private/timeline', auth, function(req, res) {
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

    app.get('/approve/:user', auth, isadmin, function(req, res) {
        db.CharityAccount.update({ 'userName': req.params.user }, { 'approved': 'true' }, {multi: false}, function(err, record) {
            if (err) return res.send({type: 'danger', msg: err});
            return res.send({type: 'success', msg: req.params.user+'\'s request has been approved'});
        })
    })

    app.get('/reject/:user', auth, isadmin, function(req, res) {
        db.CharityAccount.remove({ 'userName': req.params.user }, function(err) {
            if (err) return res.send({type: 'danger', msg: err});
            return res.send({type: 'success', msg: req.params.user+ '\'s Request has been rejected'});
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