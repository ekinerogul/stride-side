const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByType",
      required: true,
    },
    createdByType: {
      type: String,
      enum: ["Athlete", "Guide"],
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: null,
      autopopulate: {
        maxDepth: 1,
        select: "name email location languages rating",
      },
    },
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      default: null,
      autopopulate: {
        maxDepth: 1,
        select: "name email location languages rating",
      },
    },
    date: { type: Date, required: true },
    hour: { type: String, required: true },
    location: { type: String, required: true },
    distance: { type: Number, required: true },
    description: String,
    status: {
      current: {
        type: String,
        enum: ["open", "applied", "confirmed", "completed", "cancelled"],
        default: "open",
      },
      applicant: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "status.applicantType",
        default: null,
      },
      applicantType: {
        type: String,
        enum: ["Athlete", "Guide"],
        default: null,
      },
    },
    athleteRating: { type: Number, min: 1, max: 5, default: null },
    guideRating: { type: Number, min: 1, max: 5, default: null },
    athleteReview: { type: String, default: null },
    guideReview: { type: String, default: null },
  },
  { timestamps: true },
);

sessionSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Session", sessionSchema);
