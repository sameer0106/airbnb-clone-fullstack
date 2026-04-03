// external module
const express = require("express");
const bodyParser = require("body-parser");

// local module
const authRoute = express.Router();
const authController = require('../controllers/authController');  //controller imported

// post data handled by body parser
authRoute.use(bodyParser.urlencoded());

// route handling
authRoute.get("/login", authController.getLogin);
authRoute.post("/login", authController.postLogin);
authRoute.post("/logout", authController.postLogout);
authRoute.get("/signup", authController.getSignup);
authRoute.post("/signup", authController.postSignup);

exports.authRoute = authRoute;
