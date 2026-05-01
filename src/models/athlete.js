const mongoose = require("mongoose");
const baseFields = require("./base-schema");

const athleteSchema = new mongoose.Schema(
  {
    ...baseFields,
    disabilityType: { type: String, required: true },
    disabilityLevel: { type: String, enum: ["low", "medium", "high"] },
    usesGuideDog: { type: Boolean, default: false },
  },
  { timestamps: true },
);

athleteSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Athlete", athleteSchema);
