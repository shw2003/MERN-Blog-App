import mongoose from "mongoose";

const Connection = async () => {
  // const URL = `mongodb+srv://${username}:${password}@blog-app.3rpsco8.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("error while connecting database ", error);
  }
};

export default Connection;
