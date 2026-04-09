import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typedSummary, setTypedSummary] = useState("");

  // Parse AI response
  const parseResponse = (text) => {
    const summary = text
      .split("Key Points:")[0]
      .replace("Summary:", "")
      .trim();

    const keyPointsPart = text
      .split("Key Points:")[1]
      ?.split("Action Items:")[0];

    const actionItemsPart = text.split("Action Items:")[1];

    const keyPoints = keyPointsPart
      ?.split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace("-", "").trim());

    const actionItems = actionItemsPart
      ?.split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace("-", "").trim());
    

    return {
  summary,
  keyPoints: keyPoints || [],
  actionItems: actionItems || []
};
  };

  useEffect(() => {
  if (result?.summary) {
    let i = 0;
    setTypedSummary("");

    const interval = setInterval(() => {
      setTypedSummary((prev) => prev + result.summary[i]);
      i++;

      if (i >= result.summary.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }
}, [result]);

const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support voice input 😢");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.start();

  recognition.onstart = () => {
    console.log("Voice started...");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Error:", event.error);
  };
};
  // Send message to backend
  const sendMessage = async () => {
  setLoading(true);
  setResult(null);

  const res = await fetch("http://localhost:5000/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: input }),
  });

  const data = await res.json();

  const parsed = parseResponse(data.reply);
  setResult(parsed);
  setReply(data.reply);

  setLoading(false);
};

  return (
    <>
    <div className="orb orb1"></div>
    <div className="orb orb2"></div>
    
  <div className="container">
    <h1 className="title">✨ AI Meeting Assistant</h1>
    <div>
      <div className="input-container">
        <input
          className="input-box"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your meeting notes..."
        />

        <button className="button" onClick={sendMessage}>
          Analyze
        </button>
        <button className="mic-btn" onClick={startListening}>
          🎤
        </button>
        {loading && <p className="loader">🤖 AI is thinking...</p>}
        </div>
    </div>

    {result && (
      <div className="result-container">
        <div className="card">
          <h3>📝 Summary</h3>
          <p>{typedSummary}</p>
        </div>

        <div className="card">
          <h3>📌 Key Points</h3>
          <ul>
            {result.keyPoints?.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>✅ Action Items</h3>
          <ul>
            {result.actionItems?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
  </>
);
}

export default App;