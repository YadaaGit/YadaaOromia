import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  section_id: String,
  quiz_id: String,
  title: String,
  image: String,
  section_index: Number,
  contents: Object
});

// Export the schema
export default sectionSchema;
