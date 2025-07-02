const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

// ===========================
// 👤 Render Signup Form
// ===========================
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// ===========================
// 📝 Handle Signup Logic
// ===========================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", `Welcome, ${username}, to WanderLust!`);
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ===========================
// 🔐 Render Login Form
// ===========================
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// ===========================
// 🔓 Handle Login Logic
// ===========================
module.exports.login = (req, res) => {
  const { username } = req.body;
  req.flash("success", `${username} logged in to WanderLust!`);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// ===========================
// 🚪 Logout Handler
// ===========================
module.exports.logout = (req, res, next) => {
  req.logOut(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
