const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    languages: [{ type: String, required: true }],
    password: { type: String, required: true, select: false },
    location: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    rating: { type: Number, default: 0 },
    runningExperience: { type: String },
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        autopopulate: {
          maxDepth: 1,
          select: "date hour location status distance",
        },
      },
    ],
    notes: String,
    disabilityType: { type: String, required: true },
    disabilityLevel: { type: String, enum: ["low", "medium", "high"] },
    usesGuideDog: { type: Boolean, default: false },
  },
  { timestamps: true },
);

athleteSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Athlete", athleteSchema);
