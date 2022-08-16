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

AdminBro.registerAdapter(require('@admin-bro/mongoose'))

const app = express();

//mongoose connection
mongoose.connect("mongodb+srv://eieportal:smokeSZN1234@cluster0.sokb7s7.mongodb.net/coetDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const {Student, Result} = require("./models/student");
const User = require("./models/user");
const {courses, firstSemester, secondSemester, level, view, department} =  require('./models/courses');

// RBAC functions
const { canEdit } = ({ currentAdmin, record }) => {
  return currentAdmin && (
    currentAdmin.role === 'admin'
    || currentAdmin._id === record.param('ownerId')
  )
}
const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

const locale = {
  translations: {
    labels: {
      loginWelcome: 'E.I.E',
    },
    messages: {
      loginWelcome: 'Admin Panel for the Electrical & Informations Engineering Department, College of Engineering and Technology',
    },
  },
};

//Admin Bro
const adminBro = new AdminBro({
  resources: [{
    resource: User,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        },
        edit: { isAccessible: canModifyUsers },
        delete: { isAccessible: canModifyUsers },
        new: { isAccessible: canModifyUsers },
      }
    }
  },{
    resource: Student,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
      actions: {
        edit: { isAccessible: canEdit },
        delete: { isAccessible: canEdit },
        new: {
          before: async (request, { currentAdmin }) => {
            request.payload = {
              ...request.payload,
              ownerId: currentAdmin._id,
            }
            return request
          },
        }
      }
    }
  }, level, view, courses, department],
  rootPath: '/admin',
  locale,
  branding: {
    logo: '../images/logo/logo.png',
    companyName: 'College Of Engineering Technology',
    softwareBrothers: false,
  }
})
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
app.use(adminBro.options.rootPath, router)
app.use(bodyParser.json())


//middleware
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "College of Engineering",
  resave: false,
  saveUninitialized: true
}));




//passport
const auth = require('./auth/auth');

const Routes = require('./routes/index');


app.listen(8080, function() {
  console.log("Server started on port 8080.");
});

module.exports = app;