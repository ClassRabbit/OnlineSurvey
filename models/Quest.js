var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var schema = new Schema({
  survey: {type: Schema.Types.ObjectId, index: true, required: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  createdAt: {type: Date, default: Date.now},
  results: {type: String}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Quest = mongoose.model('Quest', schema);


module.exports = Quest;
