//jshint esversion:6
require('dotenv').config();
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBroExpress = require('@admin-bro/express')
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const ejs = require("ejs");
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");
global.app = express();

//middleware
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: "College of Engineering",
  resave: false,
  saveUninitialized: true
}));

//mongoose connection
mongoose.connect("mongodb://localhost:27017/coetDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const {Student, CourseReg, courseItems, Result, resultItems} = require("./models/student");
const User = require("./models/user");
const {courses, firstSemester, secondSemester, level, view} =  require('./models/courses');
const { actions } = require('admin-bro');


//Admin Bro
AdminBro.registerAdapter(AdminBroMongoose)
const AdminBroOptions = {
  resources: [{
    resource: User,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'String',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if (request.payload.record.password) {
              request.payload.record = {
                ...request.payload.record,
                encryptedPassword: await bcrypt.hash(request.payload.record, 10),
                password: undefined,
              }
            }
            return request
          }
        }
      }
    }
  }, Student, CourseReg, level, view],
  rootPath: '/admin',
  branding: {
    logo: '../images/logo/new_logo-2.png',
    companyName: 'College Of Engineering Technology',
    softwareBrothers: false,
  }
}
const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encrypyedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'college-of-engineering-and-technology',
})
app.use(adminBro.options.rootPath, router)
app.use(bodyParser.json())



//passport
const auth = require('./auth/auth');

const Routes = require('./routes/index');


app.listen(8080, function() {
  console.log("Server started on port 8080.");
});