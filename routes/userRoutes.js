const express = require("express");

const userRoute = express.Router();
const homeController = require('../controllers/storeController');  //controller imported

// user view
userRoute.get("/", homeController.getHomeIndex);
userRoute.get("/home", homeController.getHomeList);
userRoute.get("/bookings", homeController.getHomeBookings);
userRoute.get("/favourite-list", homeController.getFavouriteList);
userRoute.get("/home-details/:homeId", homeController.getHomeDetails);
userRoute.post("/favourite/:homeId", homeController.postFavouriteHouse);
userRoute.post("/delete-favourite/:homeId", homeController.postDeleteFav);

module.exports = userRoute;
