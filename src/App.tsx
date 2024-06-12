import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const UserList = styled.div`
  margin-bottom: 10px;
`;

const ChatBox = styled.div`
  width: 60%;
  height: 400px;
  border: 1px solid #ccc;
  overflow-y: scroll;
  padding: 10px;
  background-color: #f9f9f9;
`;

const Message = styled.div<{ $isMyMessage: boolean }>`
  display: flex;
  margin-bottom: 10px;
  max-width: 70%;
  align-self: ${(props) => (props.$isMyMessage ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.$isMyMessage ? "#daf8da" : "#e6e6e6")};
  padding: 10px;
  border-radius: 10px;
`;

const MessageSender = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const Input = styled.input`
  width: calc(60% - 22px);
  padding: 10px;
  margin: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
`;

function App() {
  const [messages, setMessages] = useState<
    { id: string; name: string; message: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [userId, setUserId] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://my-ts-chatapp-6914bfac3411.herokuapp.com`
        : "ws://localhost:8080";

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("Connected to the server");
    };

    ws.current.onmessage = (event) => {
      const data = event.data;

      if (typeof data === "string") {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.id && !userId) {
            setUserId(parsedData.id);
          } else {
            handleParsedMessage(parsedData);
          }
        } catch (err) {
          console.error("Failed to parse message", err);
        }
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from the server");
    };

    return () => {
      ws.current?.close();
    };
  }, [userId]);

  const handleParsedMessage = (data: any) => {
    if (data.type === "message") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: data.id, name: data.name, message: data.message },
      ]);
    } else if (data.type === "userList") {
      setUsers(data.users);
    }
  };

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN && name) {
      const message = { type: "message", name, message: input };
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  const setNameHandler = () => {
    if (ws.current?.readyState === WebSocket.OPEN && name) {
      const message = { type: "setName", name };
      ws.current.send(JSON.stringify(message));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <AppContainer>
      <UserList>
        <h3>Users:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </UserList>
      <ChatBox>
        {messages.map((msg, index) => (
          <Message key={index} $isMyMessage={msg.id === userId}>
            <MessageSender>{msg.id === userId ? "Me" : msg.name}</MessageSender>
            : {msg.message}
          </Message>
        ))}
      </ChatBox>
      <Input
        type="text"
        value={name}
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={setNameHandler}>Set Name</Button>
      <br />
      <Input
        type="text"
        value={input}
        placeholder="Enter your message"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={sendMessage}>Send</Button>
    </AppContainer>
  );
}

export default App;
