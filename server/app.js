// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

// ========== Middleware Setup ========== //

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Logging HTTP requests
app.use(morgan("dev"));

// Parse URL-encoded data and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the frontend build (optional adjustment)
app.use(express.static(path.join(__dirname, "../public")));

// ========== Routes ========== //
app.use("/api", require("./routes")); // All API routes under /api

// ========== 404 Not Found Handler ========== //
app.use((req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

// ========== Error Handling Middleware ========== //
app.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);

  // Ensure response has appropriate status
  if (res.statusCode < 400) {
    res.status(500);
  }

  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
    ...(error.table && { table: error.table }),
  });
});

module.exports = app;
