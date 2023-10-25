import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const signJwt = (user) => {
  return jwt.sign({ ...user }, JWT_SECRET, { expiresIn: "30d" });
};

export default signJwt;
