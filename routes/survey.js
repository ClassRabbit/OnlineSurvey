var express = require('express'),
    Survey = require('../models/Survey');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}


router.get('/new', needAuth, function(req, res, next) {
  res.render('survey/new');
});

router.get('/question/:id', function(req, res, next) {
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    var test = JSON.parse(survey.contents);
    res.render('survey/question', {
      surveyTitle: survey.title,
      surveyDeadline: survey.deadline,
      surveyComment: survey.comment,
      contents: JSON.parse(survey.contents)
    });
  });
});



router.post('/new', function(req, res, next) {
  //console.log(req.body.contents.length);
  //console.log(req.body.contents.length);
  var newSurvey = new Survey({
    title: req.body.surveyTitle,
    deadline: req.body.surveyDeadline,
    comment: req.body.surveyComment,
    contents: req.body.contents,
    user: req.user.id
  });
  newSurvey.save(function(err, doc) {
    if (err) {
      next(err);
    } else {
      res.status(201).json(doc);
    }
  });
});


module.exports = router;
