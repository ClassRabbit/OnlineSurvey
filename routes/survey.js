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
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(req.body);
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

router.get('/quest', needAuth, function(req, res, next) {
  Survey.find({user: req.user.id, complete: true},function(err, surveys){
    if(err) {
      return next(err);
    }
    res.render('list',{surveys: surveys, source: 'quest'});
  });
});

router.get('/edit', needAuth, function(req, res, next) {
  Survey.find({user: req.user.id, complete: false},function(err, surveys){
    if(err) {
      return next(err);
    }
    res.render('list',{surveys: surveys, source: 'edit'});
  });
});

router.post('/editing', needAuth, function(req, res, next) {
  //console.log("!!!!!init!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  //console.log(req.body.surveyId);
  Survey.findById(req.body.surveyId,function(err, survey){
    if (err) {
      return next(err);
    }
    else {
      res.status(201).json(survey);
    }
  });
});

router.get('/complete', function(req, res, next) {
  Survey.find({user: req.user.id, complete: true},function(err, surveys){
    if(err) {
      return next(err);
    }
    res.render('list',{surveys: surveys, source: 'complete'});
  });
});

router.get('/complete/:id', function(req, res, next) {
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    var contents = survey.contents;
    Quest.find({survey: req.params.id}, function(err, quests) {
      if (err) {
        return next(err);
      }

      var scores = [];
      //console.log('길이' + contents.length);
      for(var idx in contents) {
        var score = {};
        score.name = contents[idx].title;
        score.necessary = contents[idx].necessary;
        //console.log(scores[idx]);
        //console.log('what type' + contents[idx].type);
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
        else if(contents[idx].type == '4') {
          //console.log('array make clear');
          score.values = [0, 0, 0, 0, 0];
        }
        scores.push(score);
      }




      var tdsArr = [];            //tds 는 로우의 td들, tdsArr은 tds의 배열
      for(var a in quests) {                          //응답수만큼
        var results = quests[a].results;    //응답의 결과들
        var tds = [];
        tds.push(quests[a].createdAt);
        for(var b in results) {           //한문제당 응답
          console.log('b is ' + b);
          console.log('results.length is ' + results.length);
          if(b == '_schema') break;
          switch(results[b].type) {
            case '0':
              for(var c in results[b].answer) {
                if(results[b].answer[c].value == 'optEtc' || results[b].answer[c].value == 'optMultiEtc') {
                  continue;
                }
                else if(results[b].answer[c].name == 'opt' || results[b].answer[c].name == 'optMulti'){
                  scores[results[b].index].values[results[b].answer[c].value].cnt++;
                }
                if(results[b].answer[c].name == 'optEtcText' || results[b].answer[c].name == 'optMultiEtcText') {
                  scores[results[b].index].etcValues.push(results[b].answer[c].value);
                  scores[results[b].index].etcCnt++;
                  console.log('etcCnt ++ : ' + scores[results[b].index].etcCnt);
                }
              }
              break;
            case '1':
              if(results[b].answer.length !== 0) {
                scores[results[b].index].values.push(results[b].answer[0].value);
              }
              break;
            case '2':
              if(results[b].answer.length !== 0) {
                scores[results[b].index].values.push(results[b].answer[0].value);
              }
              break;
            case '3':
              if(results[b].answer.length !== 0) {
                scores[results[b].index].values.push(results[b].answer[0].value);
              }
              break;
            case '4':
              if(results[b].answer.length !== 0) {
                switch (results[b].answer[0].value) {
                  case '1':
                    scores[results[b].index].values[0]++;
                    break;
                  case '2':
                    scores[results[b].index].values[1]++;
                    break;
                  case '3':
                    scores[results[b].index].values[2]++;
                    break;
                  case '4':
                    scores[results[b].index].values[3]++;
                    break;
                  case '5':
                    scores[results[b].index].values[4]++;
                    break;
                }
              }
              break;
          }
          console.log('results is ' + results[b]);
          if(results[b].answer.length != 1) {
            var str = '';
            for(var e in results[b].answer) {
              if(results[b].answer[e].value == 'optEtc' || results[b].answer[e].value == 'optMultiEtc') {
                continue;  //기타입력
              }
              else {
                if(results[b].answer[e].name == 'optEtcText' || results[b].answer[e].name == 'optMultiEtcText') {
                  str += results[b].answer[e].value;
                }
                else {
                    str += contents[b].optValues[results[b].answer[e].value] + '\n'; //다중입력
                }
              }
            }
            tds.push(str);
          }
          else {
            for(var d in results[b].answer) {
              if(results[b].answer[d].name == 'opt' ||results[b].answer[d].name == 'optMulti') {
                tds.push(contents[b].optValues[results[b].answer[d].value]);
              }
              else {
                //console.log(results[b].answer[d].value);
                tds.push(results[b].answer[d].value);
              }
            }
          }
        }
        tdsArr.push(tds);
      }

      console.log(scores);
      for(var tex in scores) {
        console.log(scores[tex].values);

      }
      //res.render('survey/result',{scores: scores});
      res.render('survey/result',{
        contents: contents,
        tdsArr: tdsArr,
        scores: scores
      });
    });
  });
});





router.get('/edit/:id', needAuth, function(req, res, next) {    //설문 수정
  Survey.findById({_id: req.params.id}, function(err, survey) {
    if (err) {
      return next(err);
    }
    res.render('survey/new', {
      surveyId: survey._id
      // surveyTitle: survey.title,
      // surveyDeadline: survey.deadline,
      // surveyComment: survey.comment,
      // contents: JSON.parse(survey.contents)
    });
  });
});





module.exports = router;
