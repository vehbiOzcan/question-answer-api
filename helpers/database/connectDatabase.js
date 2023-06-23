import mongoose from "mongoose";

export const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch(err => {
        console.error(err);
    })
}

