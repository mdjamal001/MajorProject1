const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { restoreRedirectPath } = require("../middlewares.js");

//sign up
router.get("/signup", (req, res) => {
  res.render("users/signUpPage.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const user = new User({ username, email });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/listings");
    });
  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

// sign in
router.get("/signin", (req, res) => {
  res.render("users/signInPage.ejs");
});

router.post(
  "/signin",
  restoreRedirectPath,
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  (req, res) => {
    res.locals.redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(res.locals.redirectUrl);
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl);
  }
);

//log out
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
