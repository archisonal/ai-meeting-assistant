const express = require('express');                 //importing express
const cors = require('cors');                       //importing CORS middleware

const app = express();                              //creating server instance
app.use(cors());                                    //enabling CORS for all routes
app.use(express.json());


//creating a POST API endpoint and sending response in JSON
app.post("/message", (req, res) => {
  console.log("Request received:", req.body);

  try {
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.json({ reply: "No message received from frontend" });
    }

    res.json({
      reply: `AI says: I understand ${userMessage}`
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Something broke" });
  }
});
//starting the server on port 5000
app.listen(5000,() => {
    console.log("server zinda hai abhi.....port 5000");
});