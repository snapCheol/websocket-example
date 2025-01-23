import * as WebSocket from "ws";
import { createServer } from "http";

class WebSocketSever {
  wss: WebSocket.Server;

  constructor(port: number = 8080) {
    const server = createServer();
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws) => {
      console.log("Client Connected");
    });

    server.listen(port, () => {
      console.log(`Websocket sever running on port: ${port}`);
    });
  }
}

new WebSocketSever(8080);
