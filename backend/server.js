const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();


// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Main API router
app.use("/api", routes);

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to Gym Project!" });
});

// Page not found middleware
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// ERROR HANDLING Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
