// core module
const path = require("path");

// local module
const rootDir = require("./utils/path");
const userRoute = require("./routes/userRoutes");
const { hostRoute } = require("./routes/hostRoutes");
const { authRoute } = require("./routes/authRoutes");
const errorController = require("./controllers/errorController"); //controller imported

// external modules
const express = require("express");
const app = express();
const session = require("express-session");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const MongoStore = require("connect-mongo"); //using connect-mongo because old package (connect-mongodb-session) is not working for session
const DB_PATH =
  "mongodb+srv://darkaroma001:AromaticBeans@darkaroma.ixfqywl.mongodb.net/airbnb_db?appName=DarkAroma";

//for using ejs
app.set("view engine", "ejs");
app.set("views", "views");

// logic to create a file name by random strings
const randomString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// adding file type filter on backend side too
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// (custom file name) saving file uploaded by multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});

// multer conditions
const multerOptions = {
  storage,
  fileFilter,
};

// body-parser
app.use(express.urlencoded({ extended: false }));
// to use userView.css file from public folder
app.use(express.static(path.join(rootDir, "public")));

app.use('/uploads', express.static(path.join(rootDir, "uploads")));
// set multer for single image upload
app.use(multer(multerOptions).single("houseImage"));

// using session
app.use(
  session({
    secret: "darkaroma@secret", // secret key
    resave: false, // only save on modification
    saveUninitialized: false, // forces session to save Uninitialized to store
    store: MongoStore.create({
      mongoUrl: DB_PATH,
      collectionName: "sessions",
    }),
  }),
);

// local module
app.use(authRoute);
// making login compulsary.
app.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") {
    return next();
  }
  if (req.session.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
});
app.use(userRoute);
app.use(hostRoute);

// 404 page
app.use(errorController.error404);

const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("connected to mongoose");
    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("failed to connect mongoose", err);
  });
