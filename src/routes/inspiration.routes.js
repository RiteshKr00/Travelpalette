const express = require("express");
const {
  signup,
  signin,
  signout,
  googleSignin,
} = require("../controllers/auth.controller");
const passport = require("passport");
const {
  createInpiration,
  updateInspiration,
  getInspirationById,
  getAllInspiration,
  deleteInspiration,
  getFilteredInspiration,
} = require("../controllers/inspiration.controller");
const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createInpiration
);
router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  updateInspiration
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllInspiration
);
router.get(
  "/filter",
  passport.authenticate("jwt", { session: false }),
  getFilteredInspiration
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getInspirationById
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteInspiration
);
module.exports = router;
