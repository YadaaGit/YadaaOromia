import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  course_id: String,
  title: String,
  description: String,
  no_of_lessons: Number,
  course_index: Number,
  metadata: Object,
});

// Export the schema
export default courseSchema;
