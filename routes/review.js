const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const { reviewSchema } = require("../models/serverSchema.js"); //For server side validations
const ExpressError = require("../utilities/ExpressError.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middlewares.js");

//middleware function to valildate schema of review
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//POSTs a review for a particuar listing
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review({ ...req.body.review, user: req.user });

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    console.log("review saved!");
    res.redirect(`/listings/${req.params.id}`);
  })
);

router.patch(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, req.body.review);
    res.redirect(`/listings/${id}`);
  })
);

//DELETEs a review for a particuar listing made by a user
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
