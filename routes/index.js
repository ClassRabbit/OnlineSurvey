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

router.get('/main', function(req, res, next) {
  res.render('main');
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

router.get('/test2', function(req, res, next) {
  res.render('test2');
});

router.get('/test3', function(req, res, next) {
  res.render('test3', {id: req.user.id});
});

router.post('/test', function(req, res, next) {
  var array = [];
  array.push(req.body.mytext_0);
  array.push(req.body.mytext_1);
  array.push(req.body.mytext_2);
  array.push(req.body.mytext_3);
  array.push(req.body.mytext_4);
  array.push(req.body.mytext_5);
  array.push(req.body.mytext_6);
  array.push(req.body.mytext_7);
  array.push(req.body.mytext_8);
  array.push(req.body.mytext_9);
  res.render('testResult', {array: array});
});


module.exports = router;
