var express = require('express'),
    User = require('../models/User');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('pwReset');
});

router.post('/', function(req, res, next) {
  if(!req.body.name || !req.body.email) {
    req.flash('danger', '입력 값을 정확히 하셔야합니다.');
    return res.redirect('back');
  }
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      return next(err);
    }
    if(user.facebook.id) {
      req.flash('danger', '페이스북 아이디 입니다.');
      return res.redirect('/');
    }
    else {
      res.render('pwQuest', {user: user});
    }
  });
});

router.post('/quest', function(req, res, next) {
  User.findById(req.body.id, function(err, user) {
    if(err) {
      return next(err);
    }
    if(user.pwAnswer == req.body.password_quest_answer) {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    	var stringLength = 8;
    	var randomString = '';
    	for (var i=0; i<stringLength; i++) {
  		  var rnum = Math.floor(Math.random() * chars.length);
  		  randomString += chars.substring(rnum,rnum+1);
	    }
      user.password = user.generateHash(randomString);
      user.save(function(err) {
        var sendgrid  = require('sendgrid')('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');
        var email     = new sendgrid.Email({
          to:       user.email,
          from:     'livingkmc@gmail.com',      //웹마스터
          subject:  'OnlineSurvey 임시 비밀번호',
          text:     '임시 비밀번호 : ' + randomString
        });
        sendgrid.send(email, function(err) {
          if (err) {
            return next(err);
          }
          req.flash('success', '임시비밀번호가 이메일로 전송되었습니다.');
          return res.redirect('/');
        });
      });
    }
    else {
      req.flash('danger', '질문의 답이 틀렸습니다.');
      return res.redirect('back');
    }
  });
});

module.exports = router;
