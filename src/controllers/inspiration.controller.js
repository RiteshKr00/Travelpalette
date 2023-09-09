const { Inspiration } = require("../models/inspiration");
const { getPagination } = require("../utils/pagination");
const { errorResponse, successResponse } = require("../utils/response");

exports.createInpiration = async (req, res, next) => {
  try {
    //validation check later
    if (!req.body.content)
      return res.status(400).json(errorResponse("Content is required", 400));
    const { type, content, description, notes, tags, activity, location } =
      req.body;

    // Create a new inspiration object
    const newInspiration = new Inspiration({
      createdBy: req.user._id,
      type,
      content,
      description,
      notes,
      tags,
      activity,
      location,
    });

    // Save the new inspiration to the database
    const savedInspiration = await newInspiration.save();

    res
      .status(200)
      .json(successResponse(savedInspiration, "User Registered Successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.updateInspiration = async (req, res) => {
  try {
    const inspirationId = req.params.id;

    // Use findOneAndUpdate to find and update the inspiration document
    const updatedInspiration = await Inspiration.findOneAndUpdate(
      { _id: inspirationId },
      { $set: req.body }, //update only available data
      { new: true }
    );

    if (!updatedInspiration) {
      return res.status(404).json(errorResponse("Inspiration not found", 404));
    }

    res
      .status(200)
      .json(
        successResponse(updatedInspiration, "Inspiration updated successfully")
      );
  } catch (error) {
    console.error("Error updating inspiration:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.getInspirationById = async (req, res) => {
  try {
    const inspirationId = req.params.id;

    const inspiration = await Inspiration.findOne({ _id: inspirationId });

    if (!inspiration) {
      return res.status(404).json(errorResponse("Inspiration not found", 404));
    }

    res.status(200).json(successResponse(inspiration, "Inspiration"));
  } catch (error) {
    console.error("Error fetching inspiration:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.getAllInspiration = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allInspiration = await Inspiration.find({ createdBy: req.user._id })
      .skip(offset)
      .limit(limit)
      .sort("-createdAt");
    if (!allInspiration) {
      return res.status(404).json(errorResponse("Inspiration not found", 404));
    }

    res.status(200).json(successResponse(allInspiration, "User's Inspiration"));
  } catch (error) {
    console.error("Error fetching inspiration:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};

exports.deleteInspiration = async (req, res) => {
  try {
    const inspirationId = req.params.id;

    const inspiration = await Inspiration.findOneAndDelete({
      _id: inspirationId,
    });

    if (!inspiration) {
      return res.status(404).json(errorResponse("Inspiration not found", 404));
    }

    res
      .status(200)
      .json(successResponse(null, "Inspiration Deleted Successfully"));
  } catch (error) {
    console.error("Error deleting inspiration:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
