const express = require("express");
const { errorResponse, successResponse } = require("../utils/response");
const { signup, signin, signout } = require("../controllers/auth.controller");
const router = express.Router();
const passport = require("passport");

//signup
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("Authenticated user:", req.user);
    return res.json(successResponse(req.user, "protected"));
  }
);
module.exports = router;
