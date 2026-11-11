const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully ✅"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Feedback Schema & Model
const feedbackSchema = new mongoose.Schema({
  q1: String, // Name
  q2: String, // Department
  q3: String, // Session Title
  q4: String, // Feedback
  q5: String, // Suggestions
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Default route
app.get("/", (req, res) => {
  res.send("Feedback Server Running ✅");
});

// POST route to save feedback to MongoDB
app.post("/api/feedback", async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    console.log("Saved Feedback to DB:", newFeedback);
    res.status(200).json({ message: "Feedback received and saved successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Failed to save feedback." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
