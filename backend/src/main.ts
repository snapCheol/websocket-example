import { createServer, IncomingMessage } from "http";
import { Server, WebSocket } from "ws";

const PORT = 8080;
const httpServer = createServer();
const webSocketServer = new Server({ server: httpServer });

webSocketServer.on("connection", (ws: WebSocket, request: IncomingMessage) => {
  console.log("클라이언트가 연결되었습니다.");
  console.log(request.socket.remoteAddress);

  ws.on("message", (message) => {
    console.log(`받은 메세지: ${message}`);
    webSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", (message) => {
    console.log("클라이언트 연결이 끊겼습니다.");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running is on port: ${PORT}`);
});
