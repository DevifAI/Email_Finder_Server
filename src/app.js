import express from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";

import {
  authRoutes,
  userRoutes,
  planRoutes,
  subscriptionRoutes,
  fileUploadRoutes,
  emailAccountRoutes,
} from "./routes";

import "./config/passport.js";

dotenv.config();

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

export default app;
