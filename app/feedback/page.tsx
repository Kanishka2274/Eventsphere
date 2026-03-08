"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState("");

  const analyzeFeedback = async () => {
    if (!feedback) {
      alert("Please enter feedback");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: feedback,
        }),
      });

      const data = await response.json();
      setSentiment(data.sentiment);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Event Feedback</h2>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback here..."
        rows={5}
        style={{ width: "300px" }}
      />

      <br />
      <br />

      <button onClick={analyzeFeedback}>Submit Feedback</button>

      {sentiment && (
        <p style={{ marginTop: "20px" }}>
          <strong>AI Sentiment:</strong> {sentiment}
        </p>
      )}
    </div>
  );
}

      
    

