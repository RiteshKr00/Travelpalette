const express = require("express");
const { connectDB } = require("./src/config/db");
const app = express();
require("dotenv").config();

app.use(express.json());

connectDB();

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});
