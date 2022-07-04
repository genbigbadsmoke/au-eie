const mongoose = require('mongoose');
const Student =  require('./student');

const coursesSchema = new mongoose.Schema({
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'level'
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

const levelSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  matricNumber: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }]
})

const viewCourseSchema = new mongoose.Schema({
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'level',
    required: true
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  firstSemester: [firstSemsesterSchema],
  secondSemester: [secondSemesterSchema]
})

const courses = mongoose.model('courses', coursesSchema);
const firstSemester = mongoose.model('firstSemester', firstSemsesterSchema);
const secondSemester = mongoose.model('secondSemester', secondSemesterSchema);
const level = mongoose.model('level', levelSchema);
const view = mongoose.model('view', viewCourseSchema)

module.exports = {courses, firstSemester, secondSemester, level, view};