const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const tagRouter = require("./routes/tagRoutes");
const authRouter = require("./routes/authRoutes");
const HttpError = require("./utils/http-error");

// Initializing
const app = express();

app.use(cookieParser());
// app.set('trust proxy', true);
app.use(express.json());
//Authorization
app.use(
  cookieSession({
    signed: false,
    //	secure: true
  })
);
// CORS
app.use(cors());

// MiddleWare - BodyParser
app.use(express.urlencoded({ extended: false }));
dotenv.config();

// Serving Images Statically
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Routers
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/auth", authRouter);
app.use("/tag", tagRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(error);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// PORT NUMBER 3030
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
