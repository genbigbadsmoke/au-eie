const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const level = require('./courses');


const studentCourseRegSchema = new mongoose.Schema ({
  code: {
      type: Array,
      required: true
  },
  semester: {
    type: String
  },
  title: {
      type: Array,
      required: true
  },
  unit: {
      type: Array,
      required: true
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }
});

const studentResultSchema = new mongoose.Schema ({
  courseCode: {
      type: String,
      required: true
  },
  courseTitle: {
      type: String,
      required: true
  },
  courseGrade: {
      type: String,
      required: true
  },
  gpa: {
      type: String
  },
  cgpa: {
      type: String
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  matricNumber: {
    type: String,
    ref: 'Student'
  }
});

const StudentSchema = new mongoose.Schema ({
  matricNumber: {
    type: String,
  },
  firstname: {
    type: String
  },
  middlename: {
    type: String
  },
  lastname: {
    type: String
  },
  department: {
    type: String
  },
  gender: {
    type: String
  },
  level: {
    type: Number
  },
  religion: {
    type: String
  },
  stateOfOrigin: {
    type: String
  },
  lGAOfOrigin: {
    type: String
  },
  nationality: {
    type: String
  },
  password: {
    type: String
  },
  courseRegistered: [studentCourseRegSchema],
  result: [studentResultSchema],
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }
});

StudentSchema.plugin(passportLocalMongoose);

const Student = mongoose.model('Student', StudentSchema);
const CourseReg = mongoose.model('CourseReg', studentCourseRegSchema);
const Result = mongoose.model('Result', studentResultSchema);

// Definables
let courseReg = [];

module.exports = {Student, CourseReg, Result};