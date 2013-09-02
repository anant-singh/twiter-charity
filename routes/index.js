/**
 * Routes
 */

var twitterConn = require('../lib/twitter-conn');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'title',
            twitterLink: twitterConn.twitterConfig.login
        });
    });

    app.get('/search/:term', twitterConn.twitterAuth.middleware, function(req, res){
        twitterConn.twitterAuth.search(req.params.term, req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function(error, data) {
            res.json(data);
        });
    });

    app.get(twitterConn.twitterConfig.login, twitterConn.twitterAuth.oauthConnect);
    app.get(twitterConn.twitterConfig.loginCallback, twitterConn.twitterAuth.oauthCallback);
    app.get(twitterConn.twitterConfig.logout, twitterConn.twitterAuth.logout);

    /**
     * Errors
     */

    app.get('/404', function(req, res, next) {
        next();
    });

    app.get('/403', function(req, res, next) {
        var err = new Error('Not Allowed!');
        err.status = 403;
        next(err);
    });

    app.get('/500', function(req, res, next) {
        next(new Error());
    });

}