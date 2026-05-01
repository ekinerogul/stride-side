const mongoose = require("mongoose");
const baseFields = require("./base-schema");

const guideSchema = new mongoose.Schema(
  {
    ...baseFields,
    guidingExperience: String,
  },
  { timestamps: true },
);

guideSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Guide", guideSchema);
