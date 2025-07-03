import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  module_id: String,
  title: String,
  image: String,
  module_index: Number,
  section_ids: Object,
});

// Export the schema
export default moduleSchema;
