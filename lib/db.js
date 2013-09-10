/**
 * Created with JetBrains WebStorm.
 * User: Akshay
 * Date: 9/8/13
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var CharitySchema   = new Schema({
                            userName: String,
                            dateToTweet: String,
                            tweet:  String,
                            timeToTweet: String
                            });
var db              = mongoose.connect('mongodb://localhost/test'),
    Charitydb       = mongoose.model('Charitydb', CharitySchema);

module.exports.chSave = function(stuff, moment) {
    var record = new Charitydb();

    record.userName = stuff.user.username;
    record.dateToTweet = moment(stuff.data.dateToTweet).format('MMMM Do YYYY');
    record.tweet = stuff.data.tweet;
    record.timeToTweet = stuff.data.timeToTweet;
    if(record.save(function (err, record) {
            if (err) return false;
            return true;
        })
    ) {
        return true;
    }
};

module.exports.chSearch = function(dateParam, timeParam, moment) {
    var record = new Charitydb();
    if (Charitydb
        .findOne({ 'dateToTweet': moment(dateParam).format('MMMM Do YYYY') })
        .where('timeToTweet').equals(timeParam)
        .exec(function(err, record) {
            if (err) return false;
            console.log(record);
            return true;
        })) {
        return true;
    } else
        return false;
};