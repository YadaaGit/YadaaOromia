import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  quiz_id: String,
  is_final: Boolean,
  title: String,
  questions: Object
});

// Export the schema
export default quizSchema;
