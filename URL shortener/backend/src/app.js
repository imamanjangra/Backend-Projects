import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.set("trust proxy", 1);
origin: ["https://url-sortner-psi.vercel.app", "http://localhost:5173", "http://localhost:4173" , "https://linkshort-nslt.onrender.com"],

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "https://url-sortner-psi.vercel.app",
        "https://linkshort-nslt.onrender.com",
      ];
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "16KB" }));
app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(cookieParser());


import userRoute from "./routes/user.routes.js"
import urlRoute from "./routes/url.routes.js"
import clickRoute from "./routes/click.route.js"
import adminRoute from "./routes/admin.route.js"
import { redirectUrl } from "./controllers/url.controller.js";

app.use("/api/v1/users" , userRoute);
app.use("/api/v1/url" , urlRoute);
app.use("/api/v1/click", clickRoute);
app.use("/api/v1/admin" , adminRoute)


app.get("/:shortID", redirectUrl);
export {app}