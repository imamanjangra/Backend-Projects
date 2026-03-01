import mongoose from "mongoose"
const DBName = "urlShortner"

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DBName}`)
         console.log(`connect mongooDB succfully : ,${connect.connection.host}`);
    } catch (error) {
        console.log("Failed to connect MongooDB : " , error);
        process.exit(1);
    }
}

