const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const planRoutes = require("./routes/plans.routes");
const subscriptionRoutes = require("./routes/subscription.route");
const fileUploadRoutes = require("./routes/fileupload.routes");
const emailAccountRoutes = require("./routes/emailaccount.routes");
const paymentRoutes = require("./routes/payment.routes");
const exportRoutes = require("./routes/export.route");
require("./config/passport");
require("dotenv").config();

const agenda = require("./jobs/agenda");
require("../src/jobs/emailverification.job").default(agenda);
require("../src/jobs/verifyandInsertEmail.job")(agenda);

const app = express();

// Middlewares
// Enable CORS for all origins
app.use(cors());
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

app.use("/emailFinder/api/payment", paymentRoutes);
app.use("/emailFinder/api/export", exportRoutes);

module.exports = app;
