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
  }
});

const StudentSchema = new mongoose.Schema ({
  matricNumber: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  middlename: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: true
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