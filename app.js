//core imports
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
// const { Client } = require("pg");
const Sequelize = require("sequelize");
const Twit = require("twit");

//custom imports
const CONSTANTS = require("./config/CONSTANTS");
// const logger = require("./middleware/logger");
// const members = require("./config/utils");

//model imports
// const models = require("./models/index");

//routes imports
const memberRoutes = require("./routes/api/members");
const homeRoutes = require("./routes/home/home");
const twitterRoutes = require("./routes/api/twitter");

//initialize express
const app = express();

//handle cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//initialize the sequilizer orm
const sequelize = new Sequelize(
  CONSTANTS.DB_NAME,
  CONSTANTS.DB_USER,
  CONSTANTS.DB_PASSWORD,
  {
    host: CONSTANTS.DB_HOST,
    dialect: "postgres"
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection has been established successfully.",
      new Date().toDateString()
    );
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

//initialize Twitter
var T = new Twit({
  consumer_key: CONSTANTS.API_KEY,
  consumer_secret: CONSTANTS.SECRET_KEY,
  access_token: CONSTANTS.ACCESS_TOKEN,
  access_token_secret: CONSTANTS.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
  // strictSSL: true // optional - requires SSL certificates to be valid.
});

//init middleware
// app.use(logger);

//body parser middle ware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

//Handlebars middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//home page route
app.use("/", homeRoutes);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//members api routes
app.use("/api/members", memberRoutes);

//twitter api routes
app.use("/api/twitter", twitterRoutes);

app.listen(CONSTANTS.PORT, () => {
  console.log(`server started on port ${CONSTANTS.PORT}`);
});
