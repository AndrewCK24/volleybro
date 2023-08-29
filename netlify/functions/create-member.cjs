const connectMongoDB = require("./utils/connect-mongodb.cjs");
const Member = require("./models/member.cjs");

exports.handler = async (event) => {
  try {
    connectMongoDB.handler();
    const { name, number, role } = JSON.parse(event.body);
    const newMember = new Member({ name, number, role });
    await newMember.save();
    const members = await Member.find();
    return {
      statusCode: 201,
      body: JSON.stringify({ status: 201, message: "member created", members }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 500, error: "server error" }),
    };
  }
}