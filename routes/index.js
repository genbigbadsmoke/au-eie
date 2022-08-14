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
      console.log(req.user.id);
    }
  });
});

app.route('/register')
  .get((req, res) => {
    res.render("register");
  }).post((req, res) => {
    Student.register({matricNumber: req.body.matricNumber, username: req.body.matricNumber, firstname: req.body.firstname, middlename: req.body.middlename, lastname: req.body.lastname, department: req.body.department, level: req.body.level, religion: req.body.religion, stateOfOrigin: req.body.soa, lGA0fOrigin: req.body.loa, nationality: req.body.country}, req.body.password, function(err, user){
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

app.route('/viewProfile')
  .get((req, res) => {
    res.render("viewProfile" );
  }).post((req, res) => {
    const matricNumber = req.body.matricNumber;

    Student.findOne({matricNumber}, (err, foundStudent) => {
      if (err) {
        console.log(err);
      } else {
        if (foundStudent) {
          res.render('profile', {student: foundStudent, result: foundStudent.result});
        }
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

    Student.findOne({matricNumber}, (err, foundStudent) => {
      if (!err) {
        if (foundStudent) {
          const update = { $push: {courseRegistered: [{'semester': semester, 'code': courseCode, 'title': courseTitle, 'unit': courseUnit}]} };
          
          Student.updateOne({matricNumber: matricNumber}, update, (err, result) => {
            console.log(err);
            console.log(res);

            res.redirect('registerCourses');
          });
        }
      } else {
        console.log(err);
      }
    });

});

app.route('/result1')
  .get((req, res) => {
    res.render("result1");
  }).post((req, res) => {
    const matricNumber = req.body.matricNumber;
    
    Student.findOne({matricNumber}, (err, foundResult) => {
      if (!err) {
        res.render('result2', {student: foundResult, students: foundResult.result});
      } else {
        console.log(err);
      }
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