const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { limiter } = require("./middleware/rate-limiter");
const athletesRouter = require("./routes/athletes");
const guidesRouter = require("./routes/guides");
const sessionsRouter = require("./routes/sessions");
const indexRouter = require("./routes/index");
require("./mongo-connection");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(limiter);

app.use("/athletes", athletesRouter);
app.use("/guides", guidesRouter);
app.use("/sessions", sessionsRouter);
app.use("/", indexRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ error: { message, status } });
});

module.exports = app;
