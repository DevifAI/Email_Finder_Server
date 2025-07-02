const express = require("express");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const planRoutes = require("./routes/plans.routes");
require("./config/passport");

const app = express();

// Middlewares
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/emailFinder/api/auth", authRoutes);
app.use("/emailFinder/api/users", userRoutes);
app.use("/emailFinder/api/plans", planRoutes);

module.exports = app;
