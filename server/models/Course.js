import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  course_id: String,
  title: String,
  description: String,
  final_quiz_id: String,
  course_index: Number,
  module_ids: Object,
  metadata: Object,
});

// Export the schema
export default courseSchema;
