// external module
const express = require("express");
const bodyParser = require("body-parser");

// local module
const hostRoute = express.Router();
const hostController = require('../controllers/hostController');  //controller imported

// post data handled by body parser
hostRoute.use(bodyParser.urlencoded());

// route handling
hostRoute.get("/add-home", hostController.getAddHome);
hostRoute.post("/add-home", hostController.postAddHome);
hostRoute.get("/host-home-list", hostController.getHostHome);
hostRoute.get("/edit-home/:homeId", hostController.getEditHome);
hostRoute.post("/edit-home", hostController.postEditHome);
hostRoute.post("/delete-home/:homeId", hostController.postDeleteHome);

exports.hostRoute = hostRoute;
