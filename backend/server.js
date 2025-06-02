const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'https://ev-chargers-frontend.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/EVcharger";

await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Load User Model
const Register = require("./models/register");
const ChargingStation = require("./models/chargingstation");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register Route
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
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
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request with:", email, password);

  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const isAdmin = user.email === process.env.ADMIN_EMAIL;

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
    const chargers = await ChargingStation.find();
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chargers" });
  }
});
app.get("/", async (req, res) => {
  try {
    res.json({ message: "Backend working fine on Vercel!" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
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
    res.status(500).json({ error: "Failed to add charger" });
  }
});

// Delete Charger Route
app.delete("/api/chargers/:id", async (req, res) => {
  try {
    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: "Charger deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete charger" });
  }
});

// Export handler for Vercel serverless functions
module.exports = {
  app,
  handler: serverless(app),
};
