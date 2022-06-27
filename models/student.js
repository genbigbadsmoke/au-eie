const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const imageSchema = new mongoose.Schema ({
  img: {
    data: Buffer,
    contentType: String
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
  profileImg: imageSchema,
  firstname: {
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
const ProfileImg = mongoose.model('ProfileImg', imageSchema);

// Definables
let courseReg = [];

module.exports = {Student, courseReg, CourseReg, Result, ProfileImg};