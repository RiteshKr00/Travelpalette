const { Inspiration } = require("../models/inspiration");
const { Tags } = require("../models/tags");
const { errorResponse, successResponse } = require("../utils/response");

exports.getUsedTags = async (req, res) => {
  try {
    const usedTags = await Tags.find({ createdBy: req.user._id }).sort([
      ["updatedAt", -1], //most recent
      ["count", -1], //most used
    ]);
    //   .select("name");
    return res
      .status(200)
      .json(successResponse(usedTags, "Most Used and Recent Tags"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};

exports.searchInspirationByTags = async (req, res) => {
  try {
    const { query } = req.query;
    const queryPattern = new RegExp("^" + query);
    console.log(queryPattern);
    const inspiration = await Inspiration.find({
      $and: [
        { tags: { $regex: query, $options: "i" } },
        { createdBy: req.user._id },
      ],
    })
      .sort([["createdAt", -1]])
      .limit(10);

    return res
      .status(200)
      .json(successResponse(inspiration, "Inspiration matching Given tags"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
