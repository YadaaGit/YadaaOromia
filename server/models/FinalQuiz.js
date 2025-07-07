import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  quiz_id: String,
  quiz_title: String,
  quiz_description: String,
  is_final: Boolean,
  title: String,
  questions: Object,
  metadata: Object,
});

// Export the schema
export default quizSchema;
