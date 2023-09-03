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
        inspirationId: mongoose.Schema.Types.ObjectId,
        day: Date,
        time: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default Itinerary = mongoose.model("Itinerary", itinerarySchema);
