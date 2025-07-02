require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require('connect-mongo');
const multer = require('multer');

const app = express();
const port = 8080;

// Models
const User = require("./models/user");
const Listing = require("./models/listings");

// Utils
const ExpressError = require("./utils/ExpressError");

// Routers
const listingsRouter = require("./routers/listings");
const reviewsRouter = require("./routers/reviews");
const userRouter = require("./routers/user");
const staticRouter = require("./routers/static");

// Multer config (optional usage)
const upload = multer({ dest: 'uploads/' });

// ============================
// 🔌 MongoDB Connection
// ============================
const DB_URL = process.env.ATLAS_DB;

async function connectToDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectToDB();

// ============================
// 🛡 Session Store
// ============================
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret:  process.env.SECRET,
  },
  touchAfter: 24 * 3600, // delay update
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

// ============================
// ⚙️ App Config & Middleware
// ============================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

// ============================
// 🔐 Passport Config
// ============================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============================
// 🌍 Global Variables for Views
// ============================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ============================
// 🛣 Routes
// ============================

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", async (req, res) => {
  try {
    const featured = await Listing.find({}).limit(6);
    res.render("static/home.ejs", { featured });
  } catch (err) {
    console.error(err);
    res.render("static/home.ejs", { featured: [] });
  }
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/wanderlust", staticRouter);

app.get("/filters/:category", async (req, res) => {
  const { category } = req.params;
  let listings;
  if (category === "trending") {
    listings = await Listing.find({}).sort({ views: -1 }).limit(6);
  } else {
    listings = await Listing.find({ category });
  }
  res.render("static/filter", { category, listings });
});

// ============================
// ❌ 404 & Error Handler
// ============================
app.use((req, res, next) => {
  next(new ExpressError(404, `Page Not Found - ${req.originalUrl}`));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("listings/error", { err });
});

// ============================
// 🚀 Start Server
// ============================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});


