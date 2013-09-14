/**
 * Created with JetBrains WebStorm.
 * User: Akshay
 * Date: 9/8/13
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    moment      = require('moment'),
    settings    = require('../settings/config').settings;

var CharitySchema   = new Schema({
    userName: String,
    dateToTweet: String,
    tweet:  String,
    timeToTweet: String});

var db              = mongoose.connect(settings.databaseConfig.uri),
    Charitydb       = mongoose.model('Charitydb', CharitySchema);

module.exports.chSave = function(username, data, callback) {
    var record = new Charitydb();
    record.userName = username;
    record.dateToTweet = moment(data.dateToTweet).format('MMMM Do YYYY');
    record.tweet = '@' + username + ' tweeted: ' + data.tweet;
    record.timeToTweet = moment(data.timeToTweet).format('hh:mm A');
    record.save(function (err, record) {
        if (err) return callback(err);
        return callback(err);
    });
};

module.exports.chSearch = function(callback) {
    Charitydb
        .find({ 'dateToTweet': moment().format('MMMM Do YYYY')})
        .where('timeToTweet').equals(moment().format('hh:mm A'))
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