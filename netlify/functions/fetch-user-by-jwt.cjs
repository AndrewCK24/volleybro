const validateAuth = require("./utils/validate-auth.cjs");

exports.handler = async (event) => {
  const validateAuthRes = await validateAuth.handler(event);
  if (validateAuthRes.status === 200) {
    const { status, userData, newToken } = validateAuthRes;
    return {
      statusCode: status,
      headers: {
        "Set-Cookie": `token=${newToken}; HttpOnly; Max-Age=${
          30 * 24 * 60 * 60
        }`,
      },
      body: JSON.stringify({
        status,
        userData,
      }),
    };
  } else {
    const { status, error } = validateAuthRes;
    return {
      statusCode: status,
      body: JSON.stringify({ status, error }),
    };
  }
};
