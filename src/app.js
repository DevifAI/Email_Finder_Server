const express = require("express");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const planRoutes = require("./routes/plans.routes");
const subscriptionRoutes = require("./routes/subscription.route");
const fileUploadRoutes = require("./routes/fileupload.routes");
const emailAccountRoutes = require("./routes/emailaccount.routes");
require("./config/passport");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
app.use("/emailFinder/api/subscriptions", subscriptionRoutes);

app.use("/emailFinder/api/upload", fileUploadRoutes);
app.use("/emailFinder/api/emailaccounts", emailAccountRoutes);

module.exports = app;
