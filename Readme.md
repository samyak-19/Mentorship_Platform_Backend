# 🚀 MentorHub Backend

A scalable real-time backend for MentorHub using **Node.js, Express, Socket.io, and Supabase**.

---

## 🌐 Live API

https://your-backend.onrender.com

---

## 📌 Overview

This backend handles:

* Session lifecycle
* Real-time communication
* Chat persistence
* WebRTC signaling

---

## 🧱 Architecture

```text
Client (Next.js)
      ↓
Socket.io Server
      ↓
Express API Layer
      ↓
Supabase Database
```

---

## 🔄 Data Flow

### Session Flow

```text
Create → Join → Active → End
```

### Chat Flow

```text
Client → Server → DB → Broadcast
```

### WebRTC Flow

```text
Offer → Answer → ICE → Connected
```

---

## ✨ Features

### 🔗 REST APIs

* Session creation
* Session validation
* Session termination
* Message retrieval

---

### ⚡ Real-Time Engine

* Room-based communication
* Code sync
* Chat broadcasting

---

### 🎥 WebRTC Signaling

* Offer/Answer exchange
* ICE candidate routing

---

### 👥 Role Assignment

* First user → Mentor
* Others → Student

---

## 🛠️ Tech Stack

| Category  | Technology |
| --------- | ---------- |
| Runtime   | Node.js    |
| Framework | Express    |
| Realtime  | Socket.io  |
| DB        | Supabase   |

---

## 📂 Structure

```bash
server.js       # Main server
supabase.js     # DB client
```

---

## ⚙️ Setup

### Environment Variables

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PORT=5000
```

---

### Run Locally

```bash
npm install
node server.js
```

---

## 🔌 API Reference

| Endpoint        | Method | Description    |
| --------------- | ------ | -------------- |
| /session/create | POST   | Create session |
| /session/join   | POST   | Join session   |
| /session/end    | POST   | End session    |
| /messages/:id   | GET    | Fetch messages |

---

## ⚡ Socket Events

| Event         | Purpose     |
| ------------- | ----------- |
| join-session  | Join room   |
| code-change   | Sync editor |
| send-message  | Chat        |
| offer         | WebRTC      |
| answer        | WebRTC      |
| ice-candidate | WebRTC      |

---

## 🔐 Security

* Session validation before join
* Controlled room access
* Backend-enforced session lifecycle

---

## ⚡ Performance

* Lightweight socket events
* Efficient room broadcasting
* DB writes only when necessary

---

## 🚀 Deployment

### Render / Railway

1. Push repo
2. Add env variables
3. Start command:

```bash
node server.js
```

---

## 📊 Scalability

* Socket.io can be scaled with Redis adapter
* Stateless REST API
* WebRTC reduces server bandwidth usage

---

## 🐛 Troubleshooting

### ICE candidate errors

* Ensure correct signaling order

### Session not found

* Verify DB record exists

---

## 📌 Future Improvements

* JWT middleware
* Rate limiting
* Logging system
* Microservices architecture

---

## 👨‍💻 Author

Your Name

---

## ⭐ Support

Star the repo if helpful!
