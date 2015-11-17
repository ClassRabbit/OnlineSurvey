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
        var score = {};
        score.name = contents[idx].title;
        score.necessary = contents[idx].necessary;
        score.type = contents[idx].type;
        score.values = [];
        if (contents[idx].type == '0') {
          for(var i in contents[idx].optValues) {
            score.values.push({
              text: contents[idx].optValues[i],
              cnt: 0
            });
          }
          if(contents[idx].etcValue) {
            score.etcValues = [];
            score.etcCnt = 0;
          }
        }
        else if(contents[idx].type == '5') {
          score.values = [0, 0, 0, 0, 0];
        }
        scores.push(score);
      }

      console.log(scores.length);
      for (var t in scores) {
        console.log(scores[t]);
      }


      for(var a in quests) {
        var results = JSON.parse(quests[a].results);
        for(var rt in results) {
          console.log(results[rt]);
        }
        for(var b in results) {
          console.log('-------------------------------------------------------');
          console.log(scores.length);
          for(var tt in scores) {
            console.log(scores[tt]);
          }
          console.log('switch index = ' + results[b].type + '!@#?$@!$@?$#@?$!#?');
          switch(results[b].type) {
            case 0:
              //console.log('case in@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
              for(var c in results[b].answer) {
                // console.log('value is ' + results[b].answer[c].value);
                // console.log('results.index = ' + results[b].index);
                // console.log('results[b].answer[c].value = ' + results[b].answer[c].value);
                if(results[b].answer[c].value == 'optEtc' || results[b].answer[c].value == 'optMultiEtc') {
                  continue;
                }
                else if(results[b].answer[c].name == 'opt' || results[b].answer[c].name == 'optMulti'){
                  //console.log("what is this??? = " + scores[results[b].index].values[results[b].answer[c].value]);
                  scores[results[b].index].values[results[b].answer[c].value].cnt++;
                }
                if(results[b].answer[c].name == 'optEtcText' || results[b].answer[c].name == 'optMultiEtcText') {
                  scores[results[b].index].etcValues.push(results[b].answer[c].value);
                  scores[results[b].index].etcCnt++;
                }
              }
              break;
            case 1:
              console.log('case 1 results[b].index = ' + results[b].index);
              console.log('case 1 results[b].answer[0].value = ' + results[b].answer[0].value);
              scores[results[b].index].values.push(results[b].answer[0].value);
              break;
            case 2:
              scores[results[b].index].values.push(results[b].answer[0].value);
              break;
            case 3:
              scores[results[b].index].values.push(results[b].answer[0].value);
              break;
            case 4:
              scores[results[b].index].values.push(results[b].answer[0].value);
              break;
            case 5:
              switch (results[b].answer[0].value) {
                case '100점':
                  scores[results[b].index].values[0]++;
                  break;
                case '75점':
                  scores[results[b].index].values[1]++;
                  break;
                case '50점':
                  scores[results[b].index].values[2]++;
                  break;
                case '25점':
                  scores[results[b].index].values[3]++;
                  break;
                case '0점':
                  scores[results[b].index].values[4]++;
                  break;
              }
              break;
          }
        }
      }

      console.log('-----------------최종결과--------------------');
      console.log(scores.length);
      for(var tz in scores) {
        console.log(scores[tz]);
      }
      // res.render('survey/new', {
      //   surveyId: survey._id,
      //   surveyTitle: survey.title,
      //   surveyDeadline: survey.deadline,
      //   surveyComment: survey.comment,
      //   contents: JSON.parse(survey.contents)
      // });
      res.render('survey/result',{scores: scores})
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
