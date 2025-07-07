import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  module_id: String,
  title: String,
  module_index: Number,
  section_ids: Object,
  metadata: Object,
});

// Export the schema
export default moduleSchema;
