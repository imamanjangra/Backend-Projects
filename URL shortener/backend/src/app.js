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
import urlRoute from "./routes/url.routes.js"
import clickRoute from "./routes/click.route.js"
app.use("/api/v1/users" , userRoute);
app.use("/api/v1/url" , urlRoute);
app.use("/api/v1/click", clickRoute)
export {app}