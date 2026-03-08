const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const feedback = req.body.feedback;

  try {
    const response = await axios.post("http://localhost:5000/analyze", {
      text: feedback,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send("AI service error");
  }
});

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});