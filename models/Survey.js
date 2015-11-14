var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String},
  comment: {type: String},
  contents: {type: String},
  deadline: {type: Date},
  complete: {type: Boolean},
  user: {type: Schema.Types.ObjectId, index: true, required: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Survey = mongoose.model('Survey', schema);


module.exports = Survey;
