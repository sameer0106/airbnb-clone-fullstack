// 404 error handling from app.js
exports.error404 = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "error 404",
    isLoggedIn: req.session.isLoggedIn,
    logedUser: req.session.logedUser,
  });
};
