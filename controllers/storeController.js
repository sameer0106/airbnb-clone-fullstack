const HomeCollection = require("../models/homeModel");
const userCollection = require("../models/userModel");

// user-view from userrouter
exports.getHomeIndex = (req, res, next) => {
  HomeCollection.find().then((addedHome) => {
    res.render("store/index", {
      addedHome: addedHome,
      pageTitle: "index",
      activePage: "index",
      isLoggedIn: req.session.isLoggedIn,
      logedUser: req.session.logedUser,
    });
  });
};

// index from userrouter
exports.getHomeList = (req, res, next) => {
  HomeCollection.find().then((addedHome) => {
    res.render("store/home-list", {
      addedHome: addedHome,
      pageTitle: "home-list",
      activePage: "Home",
      isLoggedIn: req.session.isLoggedIn,
      logedUser: req.session.logedUser,
    });
  });
};

// bookings from userrouter
exports.getHomeBookings = (req, res, next) => {
  HomeCollection.find().then((addedHome) => {
    res.render("store/bookings", {
      addedHome: addedHome,
      pageTitle: "bookings",
      activePage: "bookings",
      isLoggedIn: req.session.isLoggedIn,
      logedUser: req.session.logedUser,
    });
  });
};

// home-details from userrouter
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  HomeCollection.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for id:", homeId);
      return res.redirect("/home");
    } else {
      res.render("store/home-details", {
        home: home,
        pageTitle: "home-details",
        activePage: "Home",
        isLoggedIn: req.session.isLoggedIn,
        logedUser: req.session.logedUser,
      });
    }
  });
};

// fetching relation (using populate)
// favourite-list from userrouter
exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.logedUser._id;
  const logedUser = await userCollection.findById(userId).populate("favourite");
  res.render("store/favourite-list", {
    FavHomes: logedUser.favourite,
    pageTitle: "favourite-list",
    activePage: "favourite-list",
    isLoggedIn: req.session.isLoggedIn,
    logedUser: req.session.logedUser,
  });
};

exports.postFavouriteHouse = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.logedUser._id;
  const logedUser = await userCollection.findById(userId);

  if (!logedUser.favourite.includes({ homeId })) {
    logedUser.favourite.push(homeId);
    await logedUser.save();
  }
  res.redirect("/favourite-list");
};

// postDeleteHome handling of store router
exports.postDeleteFav = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.logedUser._id;
  const logedUser = await userCollection.findById(userId);

  if (!logedUser.favourite.includes({ homeId })) {
    logedUser.favourite = logedUser.favourite.filter((fav) => fav != homeId);
    await logedUser.save();
  }
  res.redirect("/favourite-list");
};
