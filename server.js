const express = require("express");
const cors = require("cors");
const supabase = require("./supabase")

const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CREATE HTTP SERVER (needed for socket.io)
const server = http.createServer(app);

// 🔥 INITIALIZE SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend connection
  },
});

// 🔥 SOCKET LOGIC (REAL-TIME PART)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific session room
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
  });

   // 🔥 CODE SYNC
  socket.on("code-change", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code-update", code);
  });


 // 🔥 NEW: CHAT MESSAGE
  socket.on("send-message", ({ sessionId, message }) => {
    //  console.log("Message received on server:", message);
    // send message to all users in same room
    io.to(sessionId).emit("receive-message", {
      message,
      time: new Date().toLocaleTimeString(),
    });
  });


  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// CREATE SESSION
app.post("/session/create", async (req, res) => {
   const { mentorId } = req.body;

  const { data, error } = await supabase
    .from("sessions")
    .insert([
      {
        mentor_id: mentorId,
        active: true,
      },
    ])
    .select();   

  if (error) return res.status(500).json({ error: error.message });

  res.json({ sessionId: data[0].id });
});


// JOIN SESSION
app.post("/session/join", async (req, res) => {
  const { sessionId } = req.body;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({ message: "Joined successfully", session: data });
});

// END sESSION
app.post("/session/end", async (req, res) => {
  const { sessionId } = req.body;

  const { error } = await supabase
    .from("sessions")
    .update({ active: false })
    .eq("id", sessionId);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Session ended" });
});



server.listen(5000, () => {
  console.log("Server running on port 5000");
});