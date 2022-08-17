//jshint esversion:6
require('dotenv').config();
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose');
const AdminBroExpress = require('@admin-bro/express');
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
mongoose.connect("mongodb://localhost:27017/coetDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const {Student, courseReg, Result} = require("./models/student");
const User = require("./models/user");
const {level, view, department} =  require('./models/courses');

// RBAC functions
const { canEdit } = ({ currentAdmin, record }) => {
  return currentAdmin && (
    currentAdmin.role === 'admin'
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
  }, level, view, department],
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


// Routes

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/portalHome", (req, res) => {
res.render("portalHome");
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
  Student.register({matricNumber: req.body.matricNumber, username: req.body.matricNumber, firstname: req.body.firstname, middlename: req.body.middlename, lastname: req.body.lastname, department: req.body.department, level: req.body.level, religion: req.body.religion, stateOfOrigin: req.body.soa, lGA0fOrigin: req.body.loa, nationality: req.body.country, number: req.body.number, gender: req.body.gender}, req.body.password, function(err, user){
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



app.route('/viewProfile')
.get((req, res) => {
  res.render("viewProfile" );
}).post((req, res) => {
  const matricNumber = req.body.matricNumber;

  Student.findOne(matricNumber, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render('profile', {student: data})
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

app.route('/courses')
.get((req, res) => {
  res.render('courses');
}).post((req, res) => {
  const level = req.body.level;
  view.findOne({level}, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      res.render('courses2', {view: data.firstSemester, views: data.secondSemester})
    }
  });
})

app.get("/logout", (req, res) => {
req.logout();
res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}

app.listen(port, function() {
  console.log("Server started on port 8080.");
});
