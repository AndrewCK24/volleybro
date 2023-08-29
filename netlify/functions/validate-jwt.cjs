const signJWT = require("./utils/sign-jwt.cjs");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.handler = async (event) => {
  console.log("start validate-jwt");
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Token not found" }),
    };
  }

  
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const { _id, teams } = decoded;
    
    if (decoded && _id) {
      const token = signJWT.handler(_id, teams);
      return {
        statusCode: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Max-Age=${
            30 * 24 * 60 * 60
          }`,
        },
        body: JSON.stringify({ _id, teams }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Token validation failed" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Token is expired or incorrect" }),
    };
  }
};
