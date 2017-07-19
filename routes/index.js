const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', loggedIn, (req, res, next) => res.render('index', {user: req.user}));

router.get('/login', (req, res, next) => {
  if(req.user){
    res.redirect('/')
  } else {
    res.render('login');
  }
});

router.get('/sign_up', (req, res, next) => {
  if(req.user){
    res.redirect('/')
  } else {
    res.render('signup');
  }
});

function loggedIn(req, res, next) {
  if(req.user){
    next();
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
