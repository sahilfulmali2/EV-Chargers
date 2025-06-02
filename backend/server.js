const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Use CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://ev-chargers-fawn.vercel.app/",
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ MongoDB Atlas connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Models
const Register = require("./models/register");
const ChargingStation = require("./models/chargingstation");

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Routes

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Register.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Register({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "User Registration Error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Register.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User does not exist" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const isAdmin = user.email === process.env.ADMIN_EMAIL;
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

// Get chargers
app.get("/api/chargers", async (req, res) => {
  try {
    const chargers = await ChargingStation.find();
    res.json(chargers);
  } catch {
    res.status(500).json({ error: "Failed to fetch chargers" });
  }
});

// Add charger
app.post("/api/chargers", async (req, res) => {
  const lat = parseFloat(req.body.latitude);
  const lon = parseFloat(req.body.longitude);
  const { name, location, status, power, connector } = req.body;

  if (!name || !location || isNaN(lat) || isNaN(lon) || !status)
    return res.status(400).json({ error: "All fields are required" });

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
  } catch {
    res.status(500).json({ error: "Failed to add charger" });
  }
});

// Delete charger
app.delete("/api/chargers/:id", async (req, res) => {
  try {
    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: "Charger deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete charger" });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("EV Charger Backend is Running ✅");
});

// ✅ For Vercel: export app
module.exports = app;
