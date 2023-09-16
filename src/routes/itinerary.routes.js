const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Itinerary } = require("../models/itinerary");
const {
  createItinerary,
  updateItinerary,
  getAllItinerary,
  getItineraryById,
  deleteItinerary,
  changeVisibility,
  getShareableLink,
} = require("../controllers/itinerary.controller");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createItinerary
);
router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  updateItinerary
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllItinerary
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getItineraryById
);
router.get(
  "/public/:shareableLink",
  passport.authenticate("jwt", { session: false }),
  getShareableLink
);
router.put(
  "/:id/toggle",
  passport.authenticate("jwt", { session: false }),
  changeVisibility
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteItinerary
);

module.exports = router;
