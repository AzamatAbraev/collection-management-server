require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
require("express-async-errors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./db/connect");
const cache = require("./routeCache");

const authRouter = require("./routes/auth");
const collectionsRouter = require("./routes/collection");
const itemsRouter = require("./routes/item");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");
const searchRouter = require("./routes/search");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { getAllComments } = require("./controllers/comment");

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
});

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(apiRequestLimiter);


io.on("connection", (socket) => {
  socket.on("newComment", (comment) => {
    socket.broadcast.emit("receiveComment", comment);
  });

  socket.on("updateComment", (comment) => {
    socket.broadcast.emit("commentUpdated", comment);
  })

  socket.on("deleteComment", (commentId) => {
    socket.broadcast.emit("commentDeleted", commentId);
  })

  socket.on("likeItem", (item) => {
    socket.broadcast.emit("itemLiked", item);
  });

  socket.on("unlikeItem", (item) => {
    socket.broadcast.emit("itemUnliked", item);
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/collections", collectionsRouter);
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/items", commentsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/search", searchRouter);

app.get("/api/v1/comments", getAllComments);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () =>
      console.log(`Server is listening on port http://localhost:${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
