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
import adminRoute from "./routes/admin.routes.js"
import paginationRoute from './routes/pagination.routes.js'
import ProductRoute from './routes/Product.routes.js'
import CategoryRoute from "./routes/category.routes.js"
import OrderRoute from "./routes/order.routes.js"
import finalorder from "./routes/FinalOrder.routes.js"
app.use("/api/v1/users" , userRoute);
app.use("/api/v1/address" , addressRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/pagination" , paginationRoute);
app.use("/api/v1/Product" , ProductRoute);
app.use("/api/v1/Category" , CategoryRoute);
app.use("/api/v1/cart" , OrderRoute)
app.use("/api/v1/order" , finalorder)
export {app}