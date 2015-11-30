var express = require('express'),
    User = require('../models/User');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('root/new');
});

router.post('/', function(req, res, next) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      req.flash('danger', err);
      return res.redirect('back');
    }
    if(user.length !== 0) {
      user.root = true;
      user.save(function(err) {
        if (err) {
          next(err);
        }
        else {
          req.flash('success', '관리자 권한 부여가 완료되었습니다. 로그인 해주세요.');
          res.redirect('/');
        }
      });
    }
    else {
      req.flash('danger', '존재하지 않는 email 입니다.');
      res.redirect('back');
    }
  });
});

module.exports = router;
