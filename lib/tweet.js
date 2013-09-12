/**
 * Created with JetBrains WebStorm.
 * User: Akshay
 * Date: 9/11/13
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */

var db = require('../lib/db');
var moment = require('moment');
var OAuth= require('oauth').OAuth, oa;
var settings = require('../settings/config').settings;
var instant = {}, query = [];

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
    db.chSearch(getDate(), getTime(), moment, function(err, records) {
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

function getTime() {

    var date = new Date();

    instant.hour = date.getHours();
    suffix = (instant.hour >= 12)? 'PM' : 'AM';
    instant.hour = ((instant.hour + 11) % 12 + 1);

    instant.min  = date.getMinutes();
    instant.min = (instant.min < 10 ? '0' : '') + instant.min;
    if (instant.hour < 10)
        return '0' + instant.hour + ':' + instant.min + ' ' + suffix;
    else
        return instant.hour + ':' + instant.min + ' ' + suffix;

}
function getDate() {

    var date = new Date();

    instant.year = date.getFullYear();

    instant.month = date.getMonth() + 1;
    instant.month = (instant.month < 10 ? "0" : "") + instant.month;

    instant.day  = date.getDate();
    instant.day = (instant.day < 10 ? "0" : "") + instant.day;

    return instant.day + "-" + instant.month + "-" + instant.year;

}