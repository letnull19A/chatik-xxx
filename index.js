import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import path from "path";
import { configDotenv } from "dotenv";

configDotenv({});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "css")));

app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  socket.on("chat message", async (msg) => {
    io.emit("chat message", msg);

    setTimeout(() => {
      if (msg.message === "ping") {
        io.emit("chat message", { owner: "BOT", message: "pong" });
      }

      if (msg.message === "Привет") {
        io.emit("chat message", { owner: "BOT", message: "Приветствую! Чем могу помочь?" });
      }
    }, 1000);
  });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
