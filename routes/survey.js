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


router.get('/new', needAuth, function(req, res, next) {         //설문 새로 생성
  res.render('survey/new', {
    contents: {}
  });
});

router.post('/new', function(req, res, next) {
  if(req.body.surveyId){
    Survey.findById(req.body.surveyId, function(err, existSurvey){
      if (err) {
        return next(err);
      }
      existSurvey.title = req.body.surveyTitle;
      existSurvey.deadline = req.body.surveyDeadline;
      existSurvey.comment = req.body.surveyComment;
      existSurvey.contents = req.body.contents;
      existSurvey.complete = true;
      existSurvey.user = req.user.id;

      existSurvey.save(function(err, doc) {
        if (err) {
          next(err);
        } else {
          res.status(201).json(doc);
        }
      });
    });
  }
  else {
    var newSurvey = new Survey({
      title: req.body.surveyTitle,
      deadline: req.body.surveyDeadline,
      comment: req.body.surveyComment,
      contents: req.body.contents,
      complete: true,
      user: req.user.id
    });

    newSurvey.save(function(err, survey) {
      if (err) {
        next(err);
      } else {
        res.status(201).json(survey);
      }
    });
  }
});

router.put('/new', function(req, res, next) {
  if(req.body.surveyId){
    Survey.findById(req.body.surveyId, function(err, existSurvey){
      if (err) {
        return next(err);
      }
      existSurvey.title = req.body.surveyTitle;
      existSurvey.deadline = req.body.surveyDeadline;
      existSurvey.comment = req.body.surveyComment;
      existSurvey.contents = req.body.contents;
      existSurvey.complete = false;
      existSurvey.user = req.user.id;

      existSurvey.save(function(err, doc) {
        if (err) {
          next(err);
        } else {
          res.status(201).json(doc);
        }
      });
    });
  }
  else {
    var newSurvey = new Survey({
      title: req.body.surveyTitle,
      deadline: req.body.surveyDeadline,
      comment: req.body.surveyComment,
      contents: req.body.contents,
      complete: false,
      user: req.user.id
    });

    newSurvey.save(function(err, survey) {
      if (err) {
        next(err);
      } else {
        res.status(201).json(survey);
      }
    });
  }
});

router.get('/edit/list', needAuth, function(req, res, next) {
  Survey.find({user: req.user.id, complete: false},function(err, surveys){
    console.log('test');
    res.render('list',{surveys: surveys, edit: true});
  });
});

router.get('/complete/list', needAuth, function(req, res, next) {
  Survey.find({user: req.user.id, complete: true},function(err, surveys){
    console.log('test');
    res.render('list',{surveys: surveys});
  });
});


router.get('/edit/:id', needAuth, function(req, res, next) {    //설문 수정
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    res.render('survey/new', {
      surveyId: survey._id,
      surveyTitle: survey.title,
      surveyDeadline: survey.deadline,
      surveyComment: survey.comment,
      contents: JSON.parse(survey.contents),
    });
  });
});





module.exports = router;
