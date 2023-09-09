const express = require("express");
const { connectDB } = require("./src/config/db");
const app = express();
const logger = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const userRoutes = require("./src/routes/auth.routes");
const inspirationRoutes = require("./src/routes/inspiration.routes");
const { successResponse } = require("./src/utils/response");
const passport = require("passport");

// Passport middleware
app.use(passport.initialize());

require("./src/config/passport");

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

//connect DB
connectDB();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/inspiration", inspirationRoutes);

app.get("/ping", (req, res) => {
  return res.status(200).json(successResponse(null, "Server is Live"));
});
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});
