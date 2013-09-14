/**
 * Created with JetBrains WebStorm.
 * User: Akshay
 * Date: 9/11/13
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */

var db          = require('../lib/db'),
    moment      = require('moment'),
    OAuth       = require('oauth').OAuth, oa,
    settings    = require('../settings/config').settings,
    instant     = {}, query = [];

oa = new OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    settings.twitterConfig.consumerKey,
    settings.twitterConfig.consumerSecret,
    "1.0A",
    settings.uri + ":" + settings.port + "/auth/twitter/callback",
    "HMAC-SHA1"
);

module.exports = function() {
    db.chSearch(function(err, records) {
        if (err) return console.log(err);
        return records.forEach(function(document) {
            makeTweet(document.tweet, function (err, data) {
                if(err) return console.log(err);
                console.log(data);
                return db.chRemove(document, function(err) {
                    return console.log(err);
                })
            });
        });
    });
}

function makeTweet(tweetMsg, callback) {
    oa.post(
        "https://api.twitter.com/1.1/statuses/update.json",
        settings.twitterConfig.userToken,
        settings.twitterConfig.userSecret,
        { "status": tweetMsg },
        callback
    );
}