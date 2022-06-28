const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const imgSchema = new mongoose.Schema({
  matricNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  image: {
    type: String
  }
});

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
    type: String
  },
  password: {
    type: String
  },
  courseRegistered: [studentCourseRegSchema],
  result: [studentResultSchema]
});

StudentSchema.plugin(passportLocalMongoose);

const Student = mongoose.model('Student', StudentSchema);
const CourseReg = mongoose.model('CourseReg', studentCourseRegSchema);
const Result = mongoose.model('Result', studentResultSchema);
const DisplayImg = mongoose.model('DisplayImg', imgSchema);

// Definables
let courseReg = [];

module.exports = {Student, courseReg, CourseReg, Result, DisplayImg};