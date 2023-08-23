const mongoose = require("mongoose");

exports.handler = async () => {
	console.log("Connecting to MongoDB...");
	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		bufferCommands: false,
	});
	console.log("Connected to MongoDB.");
};
