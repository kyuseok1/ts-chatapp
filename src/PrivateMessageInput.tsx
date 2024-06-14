import React from "react";
import styled from "styled-components";

const PrivateMessage = styled.div`
  margin: 5px 0;
`;

interface PrivateMessageInputProps {
  users: string[];
  privateRecipient: string;
  setPrivateRecipient: (recipient: string) => void;
}

const PrivateMessageInput: React.FC<PrivateMessageInputProps> = ({
  users,
  privateRecipient,
  setPrivateRecipient,
}) => (
  <PrivateMessage>
    <label>Send to: </label>
    <select
      id="recipient-select"
      name="recipient"
      value={privateRecipient}
      onChange={(e) => setPrivateRecipient(e.target.value)}
    >
      <option value="">Everyone</option>
      {users.map((user, index) => (
        <option key={index} value={user}>
          {user}
        </option>
      ))}
    </select>
  </PrivateMessage>
);

export default PrivateMessageInput;
