
// -- Global Settings
var settings = {
    'siteName'          : 'arkathon',
    'sessionSecret'     : 'sessionSecret',
    'uri'               : 'http://local.host',
    'port'              : process.env.PORT || 3000,
    'debug'             : 0,
    'profile'           : 0,
    'twitterConfig'     : {
        consumerKey     : "3cRsFs9Imklo4jBtXfAzA",
        consumerSecret  : "3VbaUqo6HC9zaqtmseNRolysBcPUN59esIDLmyrYms",
        userToken       : "373490255-qOXW6Y2NodBcx5SntNCrYiHWpuEmw1o5fzgKV8iQ",
        userSecret      : "sz5fiokJIlCtGD0xvSTLB8Z8bmlN1MXPc3m5YsNsZs"
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