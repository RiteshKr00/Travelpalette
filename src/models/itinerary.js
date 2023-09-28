const mongoose = require("mongoose");
const itinerarySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    item: [
      {
        _id: false,
        inspirationId: mongoose.Schema.Types.ObjectId,
        day: Date,
        time: Date,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareableLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = { Itinerary };
