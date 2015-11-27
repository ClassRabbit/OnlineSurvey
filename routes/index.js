var express = require('express'),
    User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
  res.render('sighin');
});

router.get('/mail', function(req, res, next) {
  var sendgrid  = require('sendgrid')('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');
  var email     = new sendgrid.Email({
    to:       'maxboystar@naver.com',
    from:     'livingkmc@gmail.com',
    subject:  'Subject goes here',
    text:     'Hello world'
  });
  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
  res.render('sighin');
});


module.exports = router;
