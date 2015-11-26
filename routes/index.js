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



module.exports = router;
