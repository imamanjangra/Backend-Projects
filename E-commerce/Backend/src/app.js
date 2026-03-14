import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16KB" }));
app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(cookieParser());


import userRoute from "./routes/user.routes.js"
import addressRoute from "./routes/address.routes.js"

app.use("/api/v1/users" , userRoute);
app.use("/api/v1/address" , addressRoute);
export {app}