/**
 * Routes
 */
module.exports = function(app, passportConn) {

    // Define a middleware function to be used for every secured routes
    var auth = function(req, res, next){
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

    //==================================================================
    // routes
    app.get('/', function(req, res){
        res.render('index', { title: 'Charity Today' });
    });

    app.get('/users', auth, function(req, res){
        res.send([{name: "user1"}, {name: "user2"}]);
    });
    //==================================================================

    //==================================================================
    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/login', passportConn.passport.authenticate('local'), function(req, res) {
        res.send(req.user);
    });

    // route to log out
    app.post('/logout', function(req, res){
        req.logOut();
        res.send(200);
    });
    //==================================================================

};