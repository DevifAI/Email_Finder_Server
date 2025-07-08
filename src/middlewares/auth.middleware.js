import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded token");
    req.user = {
      id: decoded.id,
      role: decoded.role,
      token,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== roles.ADMIN) {
    return res.status(403).json({ message: "Access denied: admins only" });
  }
  next();
};
