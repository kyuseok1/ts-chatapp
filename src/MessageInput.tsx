import React, { useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  width: calc(60% - 22px);
  padding: 10px;
  margin: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
`;

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  sendMessage,
  handleKeyDown,
}) => {
  return (
    <>
      <Input
        id="message-input"
        name="message"
        type="text"
        value={input}
        placeholder="Enter your message"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={sendMessage}>Send</Button>
    </>
  );
};

export default MessageInput;
