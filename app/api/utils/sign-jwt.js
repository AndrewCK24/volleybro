import { SignJWT } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

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
