require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const authRouter = require("./routes/authRoutes");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/auth", authRouter);

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
  }
};

startDB();
