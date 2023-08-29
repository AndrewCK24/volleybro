const connectMongoDB = require("./utils/connect-mongodb.cjs");
const Member = require("./models/member.cjs");

exports.handler = async (event) => {
  try {
    connectMongoDB.handler();
    const { number } = JSON.parse(event.body);
    await Member.findOneAndDelete({ number });
    return {
      statusCode: 201,
      body: JSON.stringify({ status: 201, message: "member created" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
};
