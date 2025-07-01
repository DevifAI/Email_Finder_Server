const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", {
    expiresIn: "1d",
  });
};

module.exports = generateToken;
