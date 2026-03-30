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

  // 🔥 VIDEO CALL SIGNALING

  socket.on("offer", ({ sessionId, offer }) => {
    socket.to(sessionId).emit("offer", offer);
  });

  socket.on("answer", ({ sessionId, answer }) => {
    socket.to(sessionId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ sessionId, candidate }) => {
    socket.to(sessionId).emit("ice-candidate", candidate);
  });

   // 🔥 CODE SYNC
  socket.on("code-change", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code-update", code);
  });


 // 🔥 NEW: CHAT MESSAGE
  socket.on("send-message",async ({ sessionId, message, user   }) => {
    console.log("Saving message:", message);

     // ✅ Save to database
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        session_id: sessionId,
        message,
        sender_id: user.id,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    return;
  }

  const savedMessage = data[0];



    io.to(sessionId).emit("receive-message", {
      message: savedMessage.message,
      time: new Date(savedMessage.created_at).toLocaleTimeString(),
      user, 
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

app.get("/messages/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase error:",error);
    return res.status(500).json({ error: error.message });
  }
  
  console.log("Fetched messages from DB:", data);
  res.json(data);
});


server.listen(5000, () => {
  console.log("Server running on port 5000");
});