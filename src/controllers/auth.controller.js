const { User, validateUser } = require("../models/user");
const { errorResponse, successResponse } = require("../utils/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    //validation check

    const { error } = validateUser(req.body);
    if (error) {
      return res
        .status(400)
        .json(successResponse("Validation error " + error.details, 400));
    }
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(403).json(errorResponse("User Already exist", 403));
    }
    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    res
      .status(200)
      .json(successResponse(createdUser, "User Registered Successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error" + error, 500));
  }
};
exports.signin = async (req, res) => {
  try {
    //validation check

    // const { error } = validateUser(req.body);
    // if (error) {
    //   return res
    //     .status(400)
    //     .json(successResponse("Validation error " + error.details, 400));
    // }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(403).json(errorResponse(" User not found", 403));
    }

    const passwordMatched = bcrypt.compare(password, existingUser.password);

    if (!passwordMatched) {
      return res
        .status(400)
        .send(errorResponse("Email or password is incorrect", 400));
    }

    const payload = { id: existingUser._id };
    const bearerToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1h",
    });
    //set cookie 
    res.cookie("token", bearerToken, { expire: new Date() + 360000 });
    res
      .status(200)
      .json(successResponse(bearerToken, "Signed in Successfully!"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error", 500));
  }
};
exports.signout = async (_req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
};
