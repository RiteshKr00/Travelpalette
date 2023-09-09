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
    //data to be sent in response
    const data = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };
    //set cookie
    res.cookie("token", bearerToken, { expire: new Date() + 360000 });
    res.status(200).json(successResponse(data, "Signed in Successfully!"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error", 500));
  }
};
exports.googleSignin = async (req, res) => {
  try {
    // console.log(req.user);
    const { value } = req.user.emails[0];
    console.log("=======================", req.user.emails[0]);
    const existingUser = await User.findOne({ email: value });
    console.log("User alredy exist", existingUser);
    let token;
    if (existingUser) {
      //create new user
      existingUser.googleId = req.user.id;
      await existingUser.save();
      const payload = { id: existingUser._id };
      const bearerToken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "1h",
      });
      token = bearerToken;
    } else {
      const user = new User({
        name: req.user.displayName,
        email: req.user.emails[0].value,
        googleId: req.user.id,
      });
      const createdUser = await user.save();
      const payload = { id: createdUser._id };
      const bearerToken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "1h",
      });
      token = bearerToken;
    }

    //set cookie
    res.cookie("token", token, { expire: new Date() + 360000 }); //after call get user detail api at profile page
    res.redirect(`${process.env.Redirect_Url}`);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
};

exports.signout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
};
