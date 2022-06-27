const express = require("express");
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");
const {Student, CourseReg, courseItems} = require("../models/student");

const auth = express();


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Student.findById(id, (err, user) => {
    done(err, user);
  });
});


passport.use(new LocalStrategy({
  usernameField: 'matricNumber',
  passwordField: 'password'
  },
  Student.authenticate()
));


module.exports = auth;