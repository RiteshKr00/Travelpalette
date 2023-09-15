const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0, // You can set a default count value if needed
    },
  },
  {
    timestamps: true,
  }
);

const Tags = mongoose.model("Tags", tagSchema);
module.exports = { Tags };
