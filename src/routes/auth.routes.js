const express = require("express");
const { errorResponse, successResponse } = require("../utils/response");
const {
  signup,
  signin,
  signout,
  googleSignin,
  refreshToken,
  userData,
} = require("../controllers/auth.controller");
const router = express.Router();
const passport = require("passport");

//signup
router.post("/signup", signup);
router.post("/signin", signin);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false, failureRedirect: "/" }),
//   function (req, res) {
//     res.redirect("/profile");
//   }
// );
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleSignin
);
router.get("/signout", signout);
router.get(
  "/refreshtoken",
  passport.authenticate("jwt", { session: false }),
  refreshToken
);
router.get(
  "/userdata",
  passport.authenticate("jwt", { session: false }),
  userData
);
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("Authenticated user:", req.user);
    return res.json(successResponse(req.user, "protected"));
  }
);
module.exports = router;
