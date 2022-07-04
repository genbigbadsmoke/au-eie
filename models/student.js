const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const level = require('./courses');


const studentCourseRegSchema = new mongoose.Schema ({
  code: {
      type: String,
      required: true
  },
  title: {
      type: String,
      required: true
  },
  unit: {
      type: Number,
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
  level: {
    type: Number
  },
  password: {
    type: String
  },
  courseRegistered: [
    {
      first: [studentCourseRegSchema],
      second: [studentCourseRegSchema]
    }
  ],
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

module.exports = {Student, courseReg, CourseReg, Result};