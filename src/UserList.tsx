import React from "react";
import styled from "styled-components";

const UserListContainer = styled.div`
  margin-bottom: 10px;
`;

const UserList: React.FC<{ users: string[] }> = ({ users }) => (
  <UserListContainer>
    <h3>Users:</h3>
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user}</li>
      ))}
    </ul>
  </UserListContainer>
);

export default UserList;
