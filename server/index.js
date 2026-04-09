const express = require('express');                 //importing express
const cors = require('cors');                       //importing CORS middleware

const app = express();                              //creating server instance
app.use(cors());                                    //enabling CORS for all routes
app.use(express.json());


//creating a POST API endpoint and sending response in JSON
app.post("/message", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
        You are an AI meeting assistant.

        Analyze the meeting notes and respond STRICTLY in this format:

        Summary:
        (2-3 lines summary)

        Key Points:
        - point 1
        - point 2
        - point 3

        Action Items:
        - action 1
        - action 2
        - action 3

        Do NOT add any extra text, explanation, or questions.

        Meeting Notes:
        ${userMessage}
        `,
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      reply: data.response
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
});
//starting the server on port 5000
app.listen(5000,() => {
    console.log("server zinda hai abhi.....port 5000");
});