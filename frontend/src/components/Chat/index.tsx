import { useEffect, useRef, useState } from "react";
import io, { type Socket } from "socket.io-client";

import styles from "./Chat.module.css";

const Chat = () => {
  const websocket = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [chatLogs, setChatLogs] = useState<string[]>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!message || !websocket.current || !isConnected) return;

    websocket.current.emit("chat", message);
    setMessage("");
  };

  useEffect(() => {
    websocket.current = io(`http://localhost:8080`);

    websocket.current.on("connect", () => {
      setIsConnected(true);
      console.log(isConnected);
      setChatLogs((prevLogs) => [...prevLogs, "웹소켓이 연결되었습니다."]);
    });

    websocket.current.on("chat", (msg) => {
      console.log("메세지를 전달받았습니다.", msg);
      setChatLogs((prevLogs) => [...prevLogs, msg]);
    });

    websocket.current.on("error", (error) => {
      console.error(error);
    });

    websocket.current.on("disconnect", (reason, detail) => {
      console.log(`웹소켓 연결이 종료되었습니다.`, reason, detail);
      setChatLogs((prevLogs) => [...prevLogs, "웹소켓 연결이 종료되었습니다."]);
    });

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div style={{ width: "100%" }}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="메세지를 입력하세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={!message || !isConnected}>
            보내기
          </button>
        </form>
      </div>
      <div style={{ width: "100%", maxHeight: "320px", overflow: "auto" }}>
        {chatLogs.map((chat, index) => (
          <p key={index}>{chat}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
