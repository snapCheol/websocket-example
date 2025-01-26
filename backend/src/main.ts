import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 8080;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 종료되었습니다.");
  });

  socket.on("chat", (message) => {
    console.log("chat", message);

    io.emit("chat", message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running is on port: ${PORT}`);
});
