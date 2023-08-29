const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.handler = (_id, teams) => {
  const token = jwt.sign(
    {
      _id: _id,
      teams: teams,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  return token;
};
