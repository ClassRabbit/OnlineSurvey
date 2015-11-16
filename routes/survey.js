var express = require('express'),
    Survey = require('../models/Survey'),
    Quest = require('../models/Quest');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
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
          return next(err);
        }
        else {
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
        return next(err);
      }
      else {
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
          return next(err);
        }
        else {
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
        return next(err);
      }
      else {
        res.status(201).json(survey);
      }
    });
  }
});

router.get('/edit/list', needAuth, function(req, res, next) {
  Survey.find({user: req.user.id, complete: false},function(err, surveys){
    if(err) {
      return next(err);
    }
    res.render('list',{surveys: surveys, edit: true});
  });
});

router.get('/complete/list', needAuth, function(req, res, next) {
  Survey.find({user: req.user.id, complete: true},function(err, surveys){
    if(err) {
      return next(err);
    }
    console.log('test');
    res.render('list',{surveys: surveys});
  });
});

router.get('/complete/:id', needAuth, function(req, res, next) {
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    var contents = JSON.parse(survey.contents);
    console.log('json passsssssssssssssssssssssssssssssssssssssssssssssssssssss');
    Quest.find({survey: req.params.id}, function(err, quests) {
      if (err) {
        return next(err);
      }
      var scores = [];
      for(var idx in contents) {
        var score;
        score.name = contents[idx].title;
        score.necessary = contents[idx].necessary;
        score.type = contents[idx].type;
        score.values = [];
        if (contents[idx].type == '0') {
          for(var i in content.optValues) {
            score.values.push({
              text: content.optValues[i],
              cnt: 0
            });
          }
          if(content.etcValue) {
            score.etcValues = [];
          }
        }
        else if(contents[idx].type == '5') {
          score.values = [0, 0, 0, 0, 0];
        }
        scores.push(score);
      }


      for(var a in quests) {
        var results = JSON.parse(quests[a].results);
        for(var b in results) {
          //scores[results.index].values.pusy()
          switch(results[b].type) {
            case '0':
              for(var c in results[b].answer) {
                if(results[b].answer[c].name == 'optEtcText' || results[b].answer[c].name == 'optMultiEtcText') {
                  scores[results.index].etcValues.push(results[b].answer[c].value);
                }
                else if(results[b].answer[c].name == 'opt' || results[b].answer[c].name == 'optMulti'){
                  scores[results.index].values[results[b].answer[c].value].cnt++;
                }
              }
              break;
            case '1':
              scores[results.index].values.push(results[b].answer.value);
              break;
            case '2':
              scores[results.index].values.push(results[b].answer.value);
              break;
            case '3':
              scores[results.index].values.push(results[b].answer.value);
              break;
            case '4':
              scores[results.index].values.push(results[b].answer.value);
              break;
            case '5':
              switch (results[b].answer.value) {
                case '상':
                  scores[results.index].values[0]++;
                  break;
                case '중상':
                  scores[results.index].values[1]++;
                  break;
                case '중':
                  scores[results.index].values[2]++;
                  break;
                case '중하':
                  scores[results.index].values[3]++;
                  break;
                case '하':
                  scores[results.index].values[4]++;
                  break;
              }
              break;
          }
        }
      }


      // res.render('survey/new', {
      //   surveyId: survey._id,
      //   surveyTitle: survey.title,
      //   surveyDeadline: survey.deadline,
      //   surveyComment: survey.comment,
      //   contents: JSON.parse(survey.contents)
      // });
    });
  });
});





    // if(err) {
    //   return next(err);
    // }
    // Quest.find({survey: req.params.id}, function(err, quests) {
    //   if(err) {
    //     return next(err);
    //   }
    //   res.render('survey/new', {
    //     surveyId: survey._id,
    //     surveyTitle: survey.title,
    //     surveyDeadline: survey.deadline,
    //     surveyComment: survey.comment,
    //     contents: JSON.parse(survey.contents)
    //   });
      //var contents = JSON.parse(survey.contents);


    // });
//   });
// });


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
      contents: JSON.parse(survey.contents)
    });
  });
});





module.exports = router;
