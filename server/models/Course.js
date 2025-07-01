const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_id: String,
  title: String,
  description: String,
  no_of_lessons: Number,
  course_index: Number, 
  metadata: Object,
});

module.exports = mongoose.model("Course", courseSchema, "courses");
