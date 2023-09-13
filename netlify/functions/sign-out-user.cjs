exports.handler = async () => {
  console.log(`[AUTH] USER signing out...`);
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": `token=; HttpOnly; Secure; Max-Age=0`,
    },
    body: JSON.stringify({ status: 200, message: "sign-out succeed" }),
  };
};