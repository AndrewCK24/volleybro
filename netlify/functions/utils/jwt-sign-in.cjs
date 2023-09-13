const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.handler = (user) => {
  const token = jwt.sign(
    {
      ...user,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  return token;
};
