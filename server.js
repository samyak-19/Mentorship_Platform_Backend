const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let sessions = [];

// CREATE SESSION
app.post("/session/create", (req, res) => {
  const { mentorId } = req.body;

  const sessionId = Math.random().toString(36).substring(2, 8);

  const session = {
    id: sessionId,
    mentorId,
    active: true,
  };

  sessions.push(session);

  res.json({ sessionId });
});

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// JOIN SESSION
app.post("/session/join", (req, res) => {
  const { sessionId } = req.body;

  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({ message: "Joined successfully", session });
});

app.post("/session/end", (req, res) => {
  const { sessionId } = req.body;

  const session = sessions.find(s => s.id === sessionId);

  if (session) {
    session.active = false;
  }

  res.json({ message: "Session ended" });
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});