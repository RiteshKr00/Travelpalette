const { Itinerary } = require("../models/itinerary");
const { getPagination } = require("../utils/pagination");
const { errorResponse, successResponse } = require("../utils/response");
//If users increases, create custom generator
const { customAlphabet } = require("nanoid");
const generateUniqueId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
  8
);

exports.createItinerary = async (req, res) => {
  try {
    //validation check later
    const { name, startDate, endDate, item } = req.body;

    // Create a new Itinerary object
    const newItinerary = new Itinerary({
      createdBy: req.user._id,
      name,
      startDate,
      endDate,
      item,
    });

    // Save the new Itinerary to the database
    const savedItinerary = await newItinerary.save();

    return res
      .status(200)
      .json(successResponse(savedItinerary, "Itinerary Created"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.updateItinerary = async (req, res) => {
  try {
    //validation check later
    const itinerary = req.params.id;

    // Use findOneAndUpdate to find and update the Itinerary document
    const updatedItinerary = await Itinerary.findOneAndUpdate(
      { _id: itinerary },
      { $set: req.body }, //update only available data
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json(errorResponse("Itinerary Updated", 404));
    }

    return res.status(200).json(successResponse(savedItinerary, "Itinerary "));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.getItineraryById = async (req, res) => {
  try {
    const itineraryId = req.params.id;

    const itinerary = await Itinerary.findOne({ _id: itineraryId });

    if (!itinerary) {
      return res.status(404).json(errorResponse("Itinerary not found", 404));
    }

    res.status(200).json(successResponse(itinerary, "Itinerary"));
  } catch (error) {
    console.error("Error fetching Itinerary:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.getAllItinerary = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allItinerary = await Itinerary.find({ createdBy: req.user._id })
      .skip(offset)
      .limit(limit)
      .sort("-createdAt");
    if (!allItinerary) {
      return res.status(404).json(errorResponse("Itinerary not found", 404));
    }

    res.status(200).json(successResponse(allItinerary, "User's Itinerary"));
  } catch (error) {
    console.error("Error fetching Itinerary:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.changeVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;
    const uniqueCode = generateUniqueId();
    let updatedItinerary;
    if (isPublic) {
      updatedItinerary = await Itinerary.findByIdAndUpdate(
        id,
        { isPublic, shareableLink: uniqueCode },
        { new: true }
      );
      if (!updatedItinerary) {
        return res.status(404).json(errorResponse("Itinerary not found", 404));
      }
    } else {
      // If it's not being made public, update only the 'isPublic' field
      updatedItinerary = await Itinerary.findByIdAndUpdate(
        id,
        { isPublic },
        { new: true }
      );
      if (!updatedItinerary) {
        return res.status(404).json(errorResponse("Itinerary not found", 404));
      }
    }

    res
      .status(200)
      .json(
        successResponse(
          null,
          `Visibility Changed to ${isPublic ? "Public" : "Private"}`
        )
      );
  } catch (error) {
    console.error("Error fetching Itinerary:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};

//share link to be created

exports.getShareableLink = async (req, res) => {
  try {
    const { shareableLink } = req.params;

    const itinerary = await Itinerary.findOne({ shareableLink });
    if (!itinerary || !itinerary.isPublic) {
      return res
        .status(404)
        .json(errorResponse("Public Itinerary not found", 404));
    }

    res.status(200).json(successResponse(itinerary, "Shared Itinerary"));
  } catch (error) {
    console.error("Error fetching Itinerary:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};

exports.deleteItinerary = async (req, res) => {
  try {
    const itineraryId = req.params.id;

    const itinerary = await Itinerary.findOneAndDelete({
      _id: itineraryId,
    });

    if (!itinerary) {
      return res.status(404).json(errorResponse("Itinerary not found", 404));
    }

    res
      .status(200)
      .json(successResponse(null, "Itinerary Deleted Successfully"));
  } catch (error) {
    console.error("Error deleting Itinerary:", error);
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
