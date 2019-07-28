const express = require("express");
const router = express.Router();
const members = require("../../config/utils");
const models = require("../../models/index");
//home page route
router.get("", async (req, res) => {
  //Find all users
  var members;
  await models.User.findAll().then(users => {
    members = users;
  });

  res.render("index", {
    title: "Home Page",
    members
  });
});

module.exports = router;
