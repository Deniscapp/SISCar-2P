const User = require('../models/user');
const passport = require('passport');

exports.signup = (req, res, next) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

exports.signin = (req, res, next) => {
    console.log(req.user);
    res.redirect('/');
};

exports.logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};