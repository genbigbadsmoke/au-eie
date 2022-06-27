const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");
const Routes = express();


const {Student, courseReg, CourseReg, Result, ProfileImg} = require("../models/student");
const User = require("../models/user");

//passport
const auth = require('../auth/auth');
//Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now())
  }
});
const upload = multer({storage: storage});

//Routes
app.get("/", (req, res) => {
    res.render("home");
});
 
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", function(req, res){
  
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
  
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  Student.register({matricNumber: req.body.matricNumber, username: req.body.matricNumber, firstname: req.body.firstname, lastname: req.body.lastname, department: req.body.department, level: req.body.level}, req.body.password, function(err, user){
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
  
app.get("/editProfile", (req, res) => {
  Student.find({}, () => {
    res.render("editProfile", {firstname: Student.firstname});
  })
});
  
app.get("/registerCourses", (req, res) => {
  Student.find({}, (err, foundStudent) => {
    res.render("registerCourses", {courseReg: courseReg});
  })
});
app.post('/registerCourses', (req, res) => {
  const matricNumber = req.body.matricNumber;
  const courseCode = req.body.courseCode;
  const courseTitle = req.body.courseTitle;
  const courseUnit = req.body.courseUnit;
  Student.findOneAndUpdate({matricNumber: req.body.matricNumber}, {$push: {courseRegistered: {'code': courseCode, 'title': courseTitle, 'unit': courseUnit}}}, {new: true}, (err, foundUsers) => {
    if (err) {
      console.log(err)
    } else {
      Student.findOne({matricNumber: matricNumber}, (err, foundStudent) => {
        if (!err){
          res.render('registerCourses', {courseReg: courseReg});
        }
      })
    }
  });
  const courseReg = new CourseReg({
    code: courseCode,
    title: courseTitle,
    unit: courseUnit
  });
  courseReg.save();
});
  
app.get("/result1", (req, res) => {
  res.render("result1");
});  
app.post('/result1', (req, res) => {
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
});
  
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = Routes;
