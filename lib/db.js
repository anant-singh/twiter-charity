/**
 * Created with JetBrains WebStorm.
 * User: Akshay
 * Date: 9/8/13
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db              = mongoose.connection,
    Schema          = mongoose.Schema;
var CharitySchema   = new Schema({
                            userName: String,
                            dateToTweet: Date,
                            tweet:  String,
                            timeToTweet: Number
                            });
var Charitydb       = mongoose.model('Charitydb', CharitySchema);

module.exports.storeData = function(stuff) {
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        var user = new Charitydb(stuff);
    })
};