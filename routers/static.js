// ==============================
// Static Routes Router
// ==============================
const express = require("express");
const router = express.Router();

// ==============================
// Static Pages
// ==============================
router.get("/about", (req, res) => {
  res.render("static/about");
});

router.get("/contact", (req, res) => {
  res.render("static/contact");
});

router.get("/privacy", (req, res) => {
  res.render("static/privacy");
});

router.get("/terms", (req, res) => {
  res.render("static/terms");
});

// ==============================
// Export
// ==============================
module.exports = router;
