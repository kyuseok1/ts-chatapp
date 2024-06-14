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

interface NameInputProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setNameHandler: () => void;
}

const NameInput: React.FC<NameInputProps> = ({
  name,
  setName,
  setNameHandler,
}) => {
  return (
    <>
      <Input
        id="name-input"
        name="name"
        type="text"
        value={name}
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={setNameHandler}>Set Name</Button>
    </>
  );
};

export default NameInput;
