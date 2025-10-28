// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Connect to MongoDB ===
const mongoURI = "mongodb://mongo:koaHHdJULQbvqcZXyFUSqxrQgVufWXny@mongodb-k7_2.railway.internal:27017";
mongoose.connect(mongoURI, { dbName: "sweet_home" })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("Mongo Error:", err));

// === Schema for tracking the last order number ===
const counterSchema = new mongoose.Schema({
  name: String,
  seq: Number
});
const Counter = mongoose.model("Counter", counterSchema);

// === API endpoint to get next order code ===
app.get("/api/next-order", async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "order_code" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    res.json({ code: counter.seq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get next order code" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
