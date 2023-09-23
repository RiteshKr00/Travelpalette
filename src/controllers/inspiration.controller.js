const { Inspiration } = require("../models/inspiration");
const { Tags } = require("../models/tags");
const { all } = require("../routes/itinerary.routes");
const { getPagination } = require("../utils/pagination");
const { errorResponse, successResponse } = require("../utils/response");

exports.createInpiration = async (req, res, next) => {
  try {
    //validation check later
    if (!req.body.content)
      return res.status(400).json(errorResponse("Content is required", 400));
    const {
      title,
      type,
      content,
      description,
      notes,
      tags,
      activity,
      location,
    } = req.body;

    // Create a new inspiration object
    const newInspiration = new Inspiration({
      createdBy: req.user._id,
      title,
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

    //Save tags in db ::use bulk update to update db in one request
    var bulkUpdateOps = tags.map(function (t) {
      return {
        updateOne: {
          filter: { name: t },
          update: { $inc: { count: 1 }, $set: { createdBy: req.user._id } },
          upsert: true,
        },
      };
    });
    const updateTagCount = await Tags.bulkWrite(bulkUpdateOps);
    // console.log(updateTagCount);
    res
      .status(200)
      .json(
        successResponse(savedInspiration, "Inspiration created Successfully")
      );
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
    ).populate({ path: "createdBy", select: "-password" });

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

    const inspiration = await Inspiration.findOne({
      _id: inspirationId,
    }).populate({ path: "createdBy", select: "-password" });

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
      .populate({ path: "createdBy", select: "-password" })

      .skip(offset)
      .limit(limit)
      .sort("-createdAt");
    console.log(allInspiration);
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
exports.getFilteredInspiration = async (req, res) => {
  try {
    const { tags, startDate, endDate } = req.query;
    //create a filter
    const filter = {};
    //tags :filter using regex
    if (tags) {
      filter.tags = { $in: tags.split(",").map((tag) => new RegExp(tag, "i")) }; //case insensitve
    }
    //based on date
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const inspiration = await Inspiration.find({
      $and: [filter, { createdBy: req.user._id }],
    })
      .sort([["createdAt", -1]])
      .limit(10);

    return res
      .status(200)
      .json(successResponse(inspiration, "Filtered Inspiration"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
