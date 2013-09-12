/**
 * Created with JetBrains WebStorm.
 * User: Akshay
 * Date: 9/8/13
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    settings = require('../settings/config').settings;

var CharitySchema   = new Schema({
    userName: String,
    dateToTweet: String,
    tweet:  String,
    timeToTweet: String});

var db              = mongoose.connect(settings.databaseConfig.uri),
    Charitydb       = mongoose.model('Charitydb', CharitySchema);

module.exports.chSave = function(stuff, moment, callback) {
    var record = new Charitydb();
    record.userName = stuff.userName;
    record.dateToTweet = moment(stuff.data.dateToTweet).format('MMMM Do YYYY');
    record.tweet = stuff.data.tweet;
    record.timeToTweet = stuff.data.timeToTweet;
    record.save(function (err, record) {
        if (err) return callback(err);
        return callback(err);
    });
};

module.exports.chSearch = function(date, time, moment, callback) {
    Charitydb
        .find({ 'dateToTweet': moment(date, 'DD-MM-YYYY').format('MMMM Do YYYY') })
        .where('timeToTweet').equals(time)
        .exec(function(err, records) {
            if (err) return callback(err, records);
            return callback(err, records);
        });
}

module.exports.chRemove = function(record, callback) {
    Charitydb.remove(
        { 'dateToTweet': record.dateToTweet },
        { 'tweet': record.tweet },
        { 'userName': record.userName },
        function(err){
            return callback(err);
        });
}

module.exports.Charitydb = Charitydb;