require("dotenv").config();

const express = require("express");
const app = express();
require("express-async-errors");

const cors = require("cors");
const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");
const collectionsRouter = require("./routes/collection");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/collections", collectionsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port http://localhost:${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
