// ==============================
// User Authentication Router
// ==============================
const express = require("express");
const router = express.Router({ mergeParams: true });

// ==============================
// Modules
// ==============================
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");

// ==============================
// Routes
// ==============================

// 🔐 Signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup)); 

// 🔐 Login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// 🔓 Logout
router.get("/logout", userController.logout);

// ==============================
// Export
// ==============================
module.exports = router;
