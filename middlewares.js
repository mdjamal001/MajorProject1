module.exports.redirectPath = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  next();
};

module.exports.restoreRedirectPath = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl;
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Sign in to continue!");
    return res.redirect("/signin");
  }
  next();
};
