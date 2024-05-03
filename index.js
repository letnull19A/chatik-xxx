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

    const readyDataMessage = {
      owner: "BOT",
      message: "Запрос не корректен"
    };

    const message = msg.message;

    setTimeout(() => {
      if (message === "ping") {
        readyDataMessage.message = "pong";
      }

      if (message === "Привет") {
        readyDataMessage.message = "Приветствую! Чем могу помочь?";
      }
      
      if (message.includes('Хочу найти место')) {
        readyDataMessage.message = "Этот диалог работает";
      }

      if (message.includes('Случайное место')) {
        readyDataMessage.message = "Этот диалог работает";
      }

      if (message.includes('История запросов')) {
        readyDataMessage.message = "Этот диалог работает";
      }
      
      io.emit("chat message", readyDataMessage);
    }, 1000);
  });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
