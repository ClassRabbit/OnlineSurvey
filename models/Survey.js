var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, index: true, unique: true, trim: true},
  surveyCnt: {type: Number},
  surveyValue: {type: Array}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var User = mongoose.model('Survey', schema);


module.exports = User;
