const express = require("express");
const passport = require("passport");
const {
  getUsedTags,
  searchInspirationByTags,
} = require("../controllers/tags.controller");
const router = express.Router();

router.get(
  "/used",
  passport.authenticate("jwt", { session: false }),
  getUsedTags
);
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  searchInspirationByTags
);
router.get("/suggestions", passport.authenticate("jwt", { session: false }));

module.exports = router;
