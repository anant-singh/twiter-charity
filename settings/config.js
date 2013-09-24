
// -- Global Settings
var settings = {
    'siteName'          : 'arkathon',
    'sessionSecret'     : 'sessionSecret',
    'uri'               : 'http://local.host',
    'port'              : process.env.PORT || 3000,
    'debug'             : 0,
    'profile'           : 0,
    'username'          : 'akshay_ksingh',
    'twitterConfig'     : {
        consumerKey     : "VndjMGHnQdkE1eL5wfXpQA",
        consumerSecret  : "kPsNyXzYfUFfQbcyl893EtP3CMH3IyEdf9tSK3DgA",
        userToken       : "40834277-bVZsQzMV2L5enSILW7zlSV2RgC3fJrbCEfCbBSjCX",
        userSecret      : "OXm9hAUVETwSQZ0ZWWRyQfEN3J7jkzq4vcLb6SFF4"
    },
    'databaseConfig'    : {
        'uri'           : 'mongodb://localhost/test'
    }
};

/**
 * Default configuration manager
 * Inject app and express reference
 */

module.exports = function(app, express, env) {

    // -- Development
    if ('development' == env) {
        require('./development')(app, express);
    }

    // -- Production
    if ('production' == env) {
        require('./production')(app, express);
    }

};

module.exports.settings = settings;