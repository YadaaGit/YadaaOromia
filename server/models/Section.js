import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  module_id: String,
  course_id: String,
  title: String,
  image: String,
  module_index: Number,
});

// Export the schema
export default moduleSchema;
