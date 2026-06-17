import mongoose from "mongoose"
const DBName = "urlShortner"
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`connect mongooDB succfully : ,${connect.connection.host}`);
    } catch (error) {
        console.log("Failed to connect MongooDB : ", error);
        process.exit(1);
    }
}

