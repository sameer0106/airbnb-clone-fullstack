const { check, validationResult } = require("express-validator");
const userCollection = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    activePage: "signup",
    isLoggedIn: false,
    error: [],
    oldInput: {
      fullname: "",
      username: "",
      email: "",
      gender: "",
      password: "",
      usertype: "",
    },
    logedUser: {},
  });
};

exports.postSignup = [
  check("fullname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name is atleast 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name only contains letters"),

  check("username")
    .trim()
    .isLength({ min: 2 })
    .withMessage("username is atleast 2 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can contain only letters, numbers, and underscore"),

  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail({ gmail_remove_dots: false })
    .custom((value) => {
      return userCollection.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email already exists");
        }
      });
    }),

  check("gender")
    .notEmpty()
    .withMessage("Please select a gender")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender selected"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("password is atleast 8 characters long")
    .matches(/[a-z]/)
    .withMessage("password must contains one lowercase")
    .matches(/[A-Z]/)
    .withMessage("password must contains one uppercase")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("password do not match");
      }
      return true;
    }),

  check("usertype")
    .notEmpty()
    .withMessage("user type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  (req, res, next) => {
    const { fullname, username, email, gender, password, usertype } = req.body;
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "signup",
        activePage: "signup",
        isLoggedIn: false,
        error: error.array(),
        oldInput: { fullname, username, email, gender, password, usertype },
      });
    }

    // encrypting password by hash mapping
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const userData = new userCollection({
          fullname,
          username,
          email,
          gender,
          password: hashedPassword,
          usertype,
        });
        return userData.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "signup",
          activePage: "signup",
          isLoggedIn: false,
          error: [err],
          oldInput: { fullname, username, email, gender, password, usertype },
          logedUser: {},
        });
      });
  },
];

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    activePage: "login",
    isLoggedIn: false,
    error: [],
    oldInput: { email: "" },
    logedUser: {},
  });
};

// using session
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const logedUser = await userCollection.findOne({ email });
  if (!logedUser) {
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      activePage: "login",
      isLoggedIn: false,
      error: ["user doesn't exist"],
      oldInput: { email },
      logedUser: {},
    });
  }

  const isMatch = await bcrypt.compare(password, logedUser.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      activePage: "login",
      isLoggedIn: false,
      error: ["invalid password"],
      oldInput: { email },
      logedUser: {},
    });
  }

  req.session.isLoggedIn = true;
  req.session.logedUser = logedUser;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

// why need session ???????
// note-
