const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");
const Routes = express();


const {Student, courseReg, CourseReg, Result} = require("../models/student");
const {courses, view} =  require('../models/courses');
const User = require("../models/user");

//passport
const auth = require('../auth/auth');

//Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.route('/login')
  .get((req, res) => {
    res.render("login");
  }).post(function(req, res){
  
  const student = new Student({
    matricNumber: req.body.matricNumber,
    password: req.body.password
  });
  req.login(student, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/portalHome");
      });
    }
  });
});

app.route('/register')
  .get((req, res) => {
    res.render("register");
  }).post((req, res) => {
    Student.register({matricNumber: req.body.matricNumber, username: req.body.matricNumber, firstname: req.body.firstname, middlename: req.body.middlename, lastname: req.body.lastname, department: req.body.department, level: req.body.level}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/portalHome");
        });
      }
    });
});

app.get("/portalHome", (req, res) => {
  res.render("portalHome");
});

app.route('/editProfile')
  .get((req, res) => {
    Student.find({}, () => {
      res.render("editProfile", {firstname: Student.firstname});
    })
  }).post((req, res) => {
    const matricNumber = req.body.matricNumber;
    const firstname = req.body.firstname;
    const middlename = req.body.middlename;
    const lastname = req.body.lastname;
    const dept = req.body.department;

    Student.findOneAndUpdate({matricNumber: matricNumber}, {$push: {'firstname': firstname, 'middlename': middlename,'lastname': lastname, 'department': dept}}, {new: true}, (err, foundStudent) => {
      if (!err) {
        res.redirect('/portalHome');
      }
    });
  }
);

app.route('/registerCourses')
  .get((req, res) => {
    Student.find({}, (err, foundStudent) => {
      res.render("registerCourses", {courseReg: courseReg});
    })
  }).post((req, res) => {
    const matricNumber = req.body.matricNumber;
    const semester = req.body.semester;
    const courseCode = req.body.courseCode;
    const courseTitle = req.body.courseTitle;
    const courseUnit = req.body.courseUnit;

    if (semester === 'first' || semester === 'second') {
      Student.findOneAndUpdate({matricNumber: req.body.matricNumber}, {$push: {courseRegistered: {'code': courseCode, 'title': courseTitle, 'unit': courseUnit}}}, {new: true}, (err, foundStudent) => {
        if (err) {
          console.log(err)
        } else {
          Student.findOne({matricNumber: matricNumber}, (err, foundStudent) => {
            if (!err){
              res.render('registerCourses');
            }
          })
        }
      });
    }

    const courseReg = new CourseReg({
      code: courseCode,
      title: courseTitle,
      unit: courseUnit
    });
    courseReg.save();
});

app.route('/result1')
  .get((req, res) => {
    res.render("result1");
  }).post((req, res) => {
    const matricNumber = req.body.matricNumber;
    
    Student.find({'matricNumber': {$ne: null}}, (err, foundUsers) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render('result2');
        }
      }
    });
});
app.get("/result2", (req, res) => {
  Result.find({}, (err, foundResult) => {
    res.render('result2', {resultItems: foundResult});
  });
});

app.get("/courses", (req, res) => {
  res.render("courses");
}).post((req, res) => {
  const level = req.body.level;

  view.find({'level': level}, (err, foundView) => {
    if (!err) {
      res.render('courses', {views: foundView});
    }
  })
});
  
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = Routes;