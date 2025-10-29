import express from "express";
import mongoose from "mongoose";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://mongo:koaHHdJULQbvqcZXyFUSqxrQgVufWXny@mongodb-k7_2.railway.internal:27017";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Counter Schema
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 1 },
});

const Counter = mongoose.model("Counter", counterSchema);

// ✅ Function to get or increment counter
async function getNextCode(counterName) {
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
}

// ✅ API route to get next order number
app.get("/api/next-order", async (req, res) => {
  try {
    const { type, branch } = req.query;

    if (!branch || !type) {
      return res.status(400).json({ error: "Missing branch or type" });
    }

    // كل فرع له كاونتر منفصل لكل نوع
    const counterKey = `${type}_branch_${branch}`;

    const nextCode = await getNextCode(counterKey);
    res.json({ code: nextCode });
  } catch (err) {
    console.error("Error generating order code:", err);
    res.status(500).json({ error: "Failed to generate order code" });
  }
});


app.get("/", (req, res) => {
  res.send("Sweet Home Counter Backend is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
