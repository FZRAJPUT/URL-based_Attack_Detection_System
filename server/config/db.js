import mongoose from "mongoose";

const connectDB = async (uri) => {
    await mongoose.connect(uri)
        .then(() => console.log("Database connected..."))
        .catch((error) => console.log(error.message))
}

export default connectDB