import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import UserList from "./UserList";
import ChatBox from "./ChatBox";
import MessageInput from "./MessageInput";
import NameInput from "./NameInput";
import PrivateMessageInput from "./PrivateMessageInput";
import { Message } from "./types";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
`;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [privateRecipient, setPrivateRecipient] = useState("");
  const ws = useRef<WebSocket | null>(null);
  let typingTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_WS_URL_PROD
        : process.env.REACT_APP_WS_URL;

    if (wsUrl) {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("Connected to the server");
        if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      };

      ws.current.onmessage = (event) => {
        const data = event.data;

        if (typeof data === "string") {
          try {
            const parsedData = JSON.parse(data);
            console.log("Received message: ", parsedData);
            if (parsedData.id && !userId) {
              setUserId(parsedData.id);
              if (parsedData.history) {
                setMessages(parsedData.history);
              }
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
    }

    return () => {
      ws.current?.close();
    };
  }, [userId]);

  const handleParsedMessage = (data: any) => {
    console.log("Handling parsed message: ", data);
    if (data.type === "message") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: data.id,
          name: data.id === userId ? "Me" : data.name,
          message: data.message,
          timestamp: data.timestamp,
        },
      ]);
      if (data.id !== userId && Notification.permission === "granted") {
        new Notification("New Message", {
          body: `${data.name}: ${data.message}`,
        });
      }
    } else if (data.type === "userList") {
      setUsers(data.users);
    } else if (data.type === "typing") {
      setTypingUsers((prev) => [...new Set([...prev, data.name])]);
    } else if (data.type === "stopTyping") {
      setTypingUsers((prev) => prev.filter((user) => user !== data.name));
    }
  };

  const sendMessage = async () => {
    if (ws.current?.readyState === WebSocket.OPEN && name && input) {
      const message = {
        type: "message",
        id: userId,
        name,
        message: input,
        recipient: privateRecipient,
        timestamp: new Date().toISOString(),
      };
      console.log("Sending message: ", message);

      try {
        await sendWebSocketMessage(message);
        setInput("");
        // Update the local message state first to show "Me" immediately
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: userId!,
            name: "Me",
            message: input,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error("Failed to send message: ", error);
      }
    }
  };

  const sendWebSocketMessage = (message: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
        resolve();
      } else {
        reject(new Error("WebSocket is not open"));
      }
    });
  };

  const setNameHandler = async () => {
    if (ws.current?.readyState === WebSocket.OPEN && name) {
      const message = { type: "setName", name };
      console.log("Setting name: ", message);
      await sendWebSocketMessage(message);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      sendMessage();
    } else {
      handleTyping();
    }
  };

  const handleTyping = async () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      await sendWebSocketMessage({ type: "typing", name });
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      typingTimeout = setTimeout(async () => {
        await sendWebSocketMessage({ type: "stopTyping", name });
      }, 3000);
    }
  };

  // Filter messages to hide the one immediately after "Me"
  const filteredMessages = [];
  let hideNextMessage = false;
  for (const msg of messages) {
    if (msg.name === "Me") {
      hideNextMessage = true;
    } else if (hideNextMessage) {
      hideNextMessage = false;
      continue;
    }
    filteredMessages.push(msg);
  }

  return (
    <AppContainer>
      <UserList users={users} />
      <ChatBox messages={filteredMessages} typingUsers={typingUsers} />
      <NameInput
        name={name}
        setName={setName}
        setNameHandler={setNameHandler}
      />
      <PrivateMessageInput
        users={users}
        privateRecipient={privateRecipient}
        setPrivateRecipient={setPrivateRecipient}
      />
      <MessageInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        handleKeyDown={handleKeyDown}
      />
    </AppContainer>
  );
}

export default App;
