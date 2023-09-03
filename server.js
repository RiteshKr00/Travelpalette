const express = require("express");
const app = express();
require("dotenv").config();





app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});
