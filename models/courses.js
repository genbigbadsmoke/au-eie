const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
},
courseCode: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  courseUnit: {
    type: String,
    required: true
  }
});

const firstSemsesterSchema = new mongoose.Schema({
  course: [coursesSchema]
});

const secondSemesterSchema = new mongoose.Schema({
  course: [coursesSchema]
});

const courses = mongoose.model('courses', coursesSchema);
const firstSemester = mongoose.model('firstSemester', firstSemsesterSchema);
const secondSemester = mongoose.model('secondSemester', secondSemesterSchema);

module.exports = {courses, firstSemester, secondSemester};