const jwt = require("jsonwebtoken");
const JWT_SECRET = "Yashisgoodby";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  console.log("Token received:", token); 

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    console.log("Decoded user:", req.user);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).send({ error: "Token invalid" });
  }
};

module.exports = fetchuser;
