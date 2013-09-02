/**
 * Created with Eighlark Innovations.
 * User: root
 * Date: 2/9/13
 * Time: 5:03 PM
 * Email: akshay.x666@gmail.com
 */

var twitterConfig = {
    consumerKey:        "3cRsFs9Imklo4jBtXfAzA", /* per appications - manage apps here: https://dev.twitter.com/apps */
    consumerSecret:     "3VbaUqo6HC9zaqtmseNRolysBcPUN59esIDLmyrYms", /* per appications - manage apps here: https://dev.twitter.com/apps */
    domain:             "http://local.host:8080",
    login:              "/twitter/sessions/connect",
    logout:             "/twitter/sessions/logout",
    loginCallback:      "/twitter/sessions/callback", /* internal */
    completeCallback:   "/search/gosquared" /* When oauth has finished - where should we take the user too */
};

module.exports.twitterConfig = twitterConfig;
module.exports.twitterAuth = require('twitter-oauth') (twitterConfig);