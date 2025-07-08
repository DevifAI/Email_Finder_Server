import jsonwebtoken from "jsonwebtoken";

// const jwt = require("jsonwebtoken");

require("dotenv").config();

export const generateToken = (user) => {
  return jsonwebtoken.sign(
    { id: user.id ?? user?._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRES_AT || "1d",
    }
  );
};
