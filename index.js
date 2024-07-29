require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
// DB
const connectDB = require("./db/connect");
// Routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
// Error Middleware
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use("*", notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5500;

const startDB = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server Running on PORT ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startDB();
