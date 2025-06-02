 const serverless = require("serverless-http");
    const { app, connectDB } = require('../server'); // Import app and connectDB from server.js
    const mongoose = require("mongoose"); // Import mongoose here as well for readyState check

    // This is the Vercel serverless function handler.
    // It ensures the database connection is established before handling requests.
    module.exports = async (req, res) => {
      // Ensure DB is connected for every invocation (especially cold starts)
      // Mongoose connection state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      if (mongoose.connection.readyState !== 1) {
        try {
          await connectDB();
        } catch (error) {
          console.error("Failed to connect to MongoDB during function invocation:", error);
          // Return a 500 error if the database connection fails
          return res.status(500).json({ error: "Server initialization failed: Could not connect to database." });
        }
      }
      // If connected, or successfully reconnected, then handle the request
      return serverless(app)(req, res);
    };
    