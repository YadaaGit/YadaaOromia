import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  program_id: String,
  title: String,
  final_quiz_id: String,
  program_index: Number,
  courses_ids: Object,
  metadata: Object,
});

// Export the schema
export default programSchema;
