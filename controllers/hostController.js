const HomeCollection = require("../models/homeModel");
const fs = require("fs");

// input form handling of host router
exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "add home",
    activePage: "add-home",
    editing: false,
    home: {},
    isLoggedIn: req.session.isLoggedIn,
    logedUser: req.session.logedUser,
  });
};

// get edit-home handling of host router
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  HomeCollection.findById(homeId).then((home) => {
    if (!home) {
      console.log("home not found");
      res.redirect("/host-home-list");
    }
    // firstly check that user is authorized or not
    if (home.host.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }
    console.log(home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "edit home",
      activePage: "host-home",
      editing: "editing",
      isLoggedIn: req.session.isLoggedIn,
      logedUser: req.session.logedUser,
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send("server error");
  })
};

// user-view from userrouter
exports.getHostHome = async (req, res, next) => {
  // providing host id to give access to him
  await HomeCollection.find({ host: req.session.logedUser._id }).then(
    (addedHome) => {
      res.render("host/host-home-list", {
        addedHome: addedHome,
        pageTitle: "host-home",
        activePage: "host-home",
        isLoggedIn: req.session.isLoggedIn,
        logedUser: req.session.logedUser,
      });
    },
  );
};

// post home handling of host router
exports.postAddHome = (req, res, next) => {
  const { homename, rentprice, rating, location, description } = req.body;

  if (!req.file) {
    return res.status(422).send("home not provided");
  }
  const houseImage = req.file.path;

  const home = new HomeCollection({
    homename,
    rentprice,
    rating,
    location,
    houseImage,
    description,
    host: req.session.logedUser._id, //for particular user auth on home
  });
  home.save().then(() => {
    console.log("home added successfull");
  });

  console.log(req.body);

  res.render("host/post-handle", {
    pageTitle: "post handle",
    activePage: "add-home",
    isLoggedIn: req.session.isLoggedIn,
    logedUser: req.session.logedUser,
  });
};

// post postEditHome handling of host router
exports.postEditHome = (req, res, next) => {
  const { id, homename, rentprice, rating, location, description } = req.body;
  HomeCollection.findById(id)
    .then((home) => {
      home.homename = homename;
      home.rentprice = rentprice;
      home.rating = rating;
      home.location = location;
      home.description = description;

      if (req.file) {
        fs.unlink(home.houseImage, (err) => {
          if (err) {
            console.log("failed to delete photo from uploads");
          }
        });
        home.houseImage = req.file.path;
      }

      home
        .save()
        .then((result) => {
          console.log("home updated successfully", result);
        })
        .catch((err) => {
          console.log("error while updating home", err);
        });
      res.redirect("/host-home-list");
    })
    .catch((err) => {
      console.log("not find requested home", err);
    });
};

// postDeleteHome handling of host router
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;

  // 🔐 Authorization check
  if (home.host.toString() !== req.session.user._id.toString()) {
    return res.status(403).send("Unauthorized action");
  }

  HomeCollection.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host-home-list");
    })
    .catch((error) => {
      console.log("error while deleteing", error);
    });
};
