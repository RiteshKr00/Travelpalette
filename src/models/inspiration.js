const mongoose = require("mongoose");
const inspirationSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["IMAGE", "VIDEO", "LINK"],
      // default: 'LINK'
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    activity: {
      type: String,
    },
    location: {
      type: String,
    },
    favorite: {
      type: Boolean,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Inspiration = mongoose.model("Inspiration", inspirationSchema);
