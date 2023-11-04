import { SignJWT } from "jose";
const JWT_SECRET = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(JWT_SECRET);

const signJwt = async (data) => {
  const { _doc: user } = data;
  const token = await new SignJWT({
    ...user,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  return token;
};

export default signJwt;
