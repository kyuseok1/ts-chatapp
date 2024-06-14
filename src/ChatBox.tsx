import React from "react";
import styled from "styled-components";
import { Message } from "./types";

const ChatBoxContainer = styled.div`
  width: 60%;
  height: 400px;
  border: 1px solid #ccc;
  overflow-y: scroll;
  padding: 10px;
  background-color: #f9f9f9;
`;

const MessageContainer = styled.div<{ $isMyMessage: boolean }>`
  display: flex;
  flex-direction: column;
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

const MessageContent = styled.span`
  margin-bottom: 5px;
`;

const Timestamp = styled.small`
  align-self: flex-end;
  color: #888;
`;

const ChatBox: React.FC<{ messages: Message[]; typingUsers: string[] }> = ({
  messages,
  typingUsers,
}) => {
  return (
    <ChatBoxContainer>
      {messages.map((msg, index) => (
        <MessageContainer key={index} $isMyMessage={msg.name === "Me"}>
          <MessageSender>{msg.name}</MessageSender>
          <MessageContent>{msg.message}</MessageContent>
          <Timestamp>{new Date(msg.timestamp).toLocaleTimeString()}</Timestamp>
        </MessageContainer>
      ))}
      {typingUsers.length > 0 && (
        <div>
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
          typing...
        </div>
      )}
    </ChatBoxContainer>
  );
};

export default ChatBox;
