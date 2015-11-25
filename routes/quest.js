var express = require('express'),
    Survey = require('../models/Survey'),
    Quest = require('../models/Quest');
var router = express.Router();

router.get('/:id', function(req, res, next) {            //설문 진행
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    var test = JSON.parse(survey.contents);
    res.render('quest/new', {
      surveyId: survey._id,
      surveyTitle: survey.title,
      surveyDeadline: survey.deadline,
      surveyComment: survey.comment,
      contents: JSON.parse(survey.contents),
      sureveyComplete: true
    });
  });
});

router.post('/new', function(req, res, next) {
  console.log('in hereeee');
  //survey: req.body.surveyId,
  Quest.find({email: req.body.email}, function(err, existQuest) {
    if (err) {
      console.log('??');
      return next(err);
    }
    if(existQuest.length !== 0) {
      console.log('???');
      return res.status(201).json(false);
    }
    else {
      console.log('????');
      var quest = new Quest({
        survey: req.body.surveyId,
        email: req.body.email,
        results: req.body.results
      });
      console.log(req.body.surveyId);
      console.log(req.body.email);
      console.log(req.body.results);
      quest.save(function (err) {
        if (err) {
          return next(err);
        }
        return res.status(201).json(true);
      });
    }
  });
});


module.exports = router;
