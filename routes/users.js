const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const User = require('../models/user');
const passport = require('passport');


/* GET users listing. */
router.get('/', (req, res, next) => {
  const query = User.find();
  const promise = query.exec();
  promise.then(doc => {
    res.send(doc);
  });

});

router.post('/signin', passport.authenticate('local'), users.signin );

router.post('/signup', users.signup);

router.get('/logout', users.logout);


module.exports = router;
