var express = require('express'),
    User = require('../models/User');
var router = express.Router();


router.post('/', function(req, res, next) {
  var mailSubject = '설문조사 : ' + req.body.surveyTitle + '에 참여해주세요!';
  var mailText = '설문 조사 경로 : https://glacial-scrubland-6910.herokuapp.com/quest/' + req.body.surveyId;
  //해로쿠 올리고 여기 경로 수정!
  var sendgrid  = require('sendgrid')('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');
  var email     = new sendgrid.Email({
    to:       req.body.email,
    from:     req.user.email,
    subject:  mailSubject,
    text:     mailText
  });
  sendgrid.send(email, function(err) {
    if (err) {
      return res.status(201).json(false);
      //return next(err);
      //return console.error(err);
    }
    return res.status(201).json(true);
  });
});

module.exports = router;
