import { useEffect, useRef, useState } from "react";

import styles from "./Chat.module.css";

const Chat = () => {
  const websocket = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [chatLogs, setChatLogs] = useState<string[]>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!message || !websocket.current || !isConnected) return;

    websocket.current.send(message);
    setMessage("");
  };

  useEffect(() => {
    websocket.current = new WebSocket(`http://localhost:8080`);

    websocket.current.onopen = () => {
      setIsConnected(true);
      setChatLogs((prevLogs) => [...prevLogs, "웹소켓이 연결되었습니다."]);
    };

    websocket.current.onmessage = (event) => {
      console.log("메세지를 전달받았습니다.", event.data);
      setChatLogs((prevLogs) => [...prevLogs, event.data]);
    };

    websocket.current.onerror = (error) => {
      console.error(error);
    };

    websocket.current.onclose = (event) => {
      console.log(`웹소켓 연결이 종료되었습니다.`, event.code, event.reason);
      setIsConnected(false);
      setChatLogs((prevLogs) => [...prevLogs, "웹소켓 연결이 종료되었습니다."]);
    };

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
