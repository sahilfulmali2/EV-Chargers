const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const serverless = require("serverless-http");

const app = express();

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is not defined!");
}

// Define an async function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.error("Ensure your MONGO_URI is correct and IP access is whitelisted in MongoDB Atlas.");
    // Re-throw the error to ensure the cold start fails if connection fails
    throw err;
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'https://ev-chargers-frontend.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// Load User Model
const Register = require("./models/register");
const ChargingStation = require("./models/chargingstation");

// Get JWT_SECRET and ADMIN_EMAIL from environment variables.
// Provide a fallback for local development if not set in .env
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_fallback";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";

// Register Route
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Ensure DB is connected before proceeding
    if (mongoose.connection.readyState !== 1) {
      await connectDB(); // Attempt to reconnect if not connected
    }
    const existing = await Register.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already taken" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Register({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request with:", email, password);

  try {
    // Ensure DB is connected before proceeding
    if (mongoose.connection.readyState !== 1) {
      await connectDB(); // Attempt to reconnect if not connected
    }
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const isAdmin = user.email === ADMIN_EMAIL; // Use ADMIN_EMAIL from env

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, isAdmin });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

// Fetching Chargers
app.get("/api/chargers", async (req, res) => {
  try {
    // Ensure DB is connected before proceeding
    if (mongoose.connection.readyState !== 1) { // 1 means connected
      await connectDB(); // Attempt to reconnect if not connected
    }
    const chargers = await ChargingStation.find();
    res.json(chargers);
  } catch (err) {
    console.error("Failed to fetch chargers:", err);
    res.status(500).json({ error: "Failed to fetch chargers" });
  }
});

// Root endpoint for health check
app.get("/", async (req, res) => {
  try {
    // Ensure DB is connected before responding
    if (mongoose.connection.readyState !== 1) {
      await connectDB(); // Attempt to reconnect if not connected
    }
    if (mongoose.connection.readyState === 1) { // 1 means connected
      res.json({ message: "Backend working fine on Vercel and connected to MongoDB!" });
    } else {
      res.status(503).json({ error: "Backend is running, but not connected to MongoDB yet. Check Vercel logs for connection errors." });
    }
  } catch (err) {
    console.error("Error on root endpoint:", err);
    res.status(500).json({ error: "Failed to respond to root endpoint" });
  }
});

// Add Charging Station Route
app.post("/api/chargers", async (req, res) => {
  const lat = parseFloat(req.body.latitude);
  const lon = parseFloat(req.body.longitude);
  const { name, location, status, power, connector } = req.body;

  if (!name || !location || isNaN(lat) || isNaN(lon) || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Ensure DB is connected before proceeding
    if (mongoose.connection.readyState !== 1) {
      await connectDB(); // Attempt to reconnect if not connected
    }
    const newCharger = new ChargingStation({
      name,
      location,
      latitude: lat,
      longitude: lon,
      status,
      power,
      connector,
    });
    const saved = await newCharger.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Failed to add charger:", err);
    res.status(500).json({ error: "Failed to add charger" });
  }
});

// Delete Charger Route
app.delete("/api/chargers/:id", async (req, res) => {
  try {
    // Ensure DB is connected before proceeding
    if (mongoose.connection.readyState !== 1) {
      await connectDB(); // Attempt to reconnect if not connected
    }
    const result = await ChargingStation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Charger not found" });
    }
    res.json({ message: "Charger deleted" });
  } catch (err) {
    console.error("Failed to delete charger:", err);
    res.status(500).json({ error: "Failed to delete charger" });
  }
});

module.exports = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      console.error("Failed to connect to MongoDB during function invocation:", error);
      return res.status(500).json({ error: "Server initialization failed: Could not connect to database." });
    }
  }
  return serverless(app)(req, res);
};
