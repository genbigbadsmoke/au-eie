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

const firstSemesterSchema = new mongoose.Schema({
  course: [coursesSchema]
});

const secondSemesterSchema = new mongoose.Schema({
  course: [coursesSchema]
});

const departmentSchema = new mongoose.Schema({
  department: {
    type: String
  },
  level: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'level',
    required: true
  }]
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
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  matricNumber: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }]
});

const viewCourseSchema = new mongoose.Schema({
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'level',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  firstSemester: [firstSemesterSchema],
  secondSemester: [secondSemesterSchema]
});

const courses = mongoose.model('courses', coursesSchema);
const first = mongoose.model('first', firstSemesterSchema);
const second = mongoose.model('second', secondSemesterSchema);
const level = mongoose.model('level', levelSchema);
const view = mongoose.model('view', viewCourseSchema);
const department = mongoose.model('department', departmentSchema);

module.exports = {courses, first, second, level, view, department};