# 🌐 채팅 사이트

`WebSocket`을 이용해 만든 채팅 사이트입니다. `TypeScript`와 `Express`, `Node`를 사용했으며, 프론트는 `Vercel`, 백엔드는 `Heroku`를 사용해 배포했습니다.

<br>

## 🚀 Demo 링크
[https://chatapp-seven-rosy.vercel.app](https://ts-chatapp.vercel.app/)

<br>
<br>

## 🕰️ 제작 기간 & 참여 인원
- **제작 기간**: 2024년 6월 12일 - 2023년 6월 15일
- **참여 인원**: 1명

<br>
<br>


## 🛠️ 기술 스택

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Styled-Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white)
<br>
<br>

<br>



## ✨ 주요 기능
- **실시간 채팅**: WebSocket을 통해 빠르고 실시간으로 메시지를 주고받을 수 있습니다.
  - **기술**: WebSocket
  - **설명**: 클라이언트는 WebSocket을 사용하여 서버와의 실시간 연결을 유지하고, 메시지를 송수신합니다. 메시지가 도착하면 `useState` 훅을 통해 메시지 상태가 업데이트됩니다.

- **사용자 인증**: 기본적인 사용자 인증 기능을 제공하여, 각 사용자는 고유한 사용자명으로 채팅할 수 있습니다.
  - **기술**: Express.js, Node.js
  - **설명**: 서버 측에서 사용자 인증을 처리하여 각 사용자가 고유한 이름을 설정할 수 있도록 합니다. 클라이언트 측에서는 `setNameHandler` 함수로 사용자 이름을 설정합니다.

- **채팅방**: 여러 채팅방을 생성하고 참여할 수 있습니다.
  - **기술**: WebSocket, Express.js, Node.js
  - **설명**: 서버는 여러 채팅방을 관리하고, 사용자는 특정 채팅방에 참여하여 메시지를 주고받을 수 있습니다. 클라이언트는 채팅방별 메시지와 사용자를 관리합니다.

- **반응형 디자인**: 다양한 기기에서 원활하게 사용할 수 있도록 반응형으로 디자인되었습니다.
  - **기술**: Styled-components, CSS
  - **설명**: `styled-components`를 사용하여 반응형 디자인을 구현하였습니다. 다양한 기기에서 적절한 레이아웃과 스타일을 적용합니다.

- **타이핑 알림**: 사용자가 메시지를 입력할 때 다른 사용자에게 타이핑 중임을 알립니다.
  - **기술**: WebSocket, React state management
  - **설명**: 사용자가 메시지를 입력할 때 WebSocket을 통해 타이핑 상태를 서버에 알리고, 다른 클라이언트에 타이핑 중임을 표시합니다. `typingTimeout`을 사용하여 타이핑 중지 상태를 관리합니다.
 
- **알림 기능**: 새로운 메시지가 도착하면 알림을 제공합니다.
  - **기술**: Web Notifications API, WebSocket
  - **설명**: 브라우저의 Web Notifications API를 사용하여 새로운 메시지가 도착하면 알림을 표시합니다. 사용자가 처음 연결할 때 알림 권한을 요청합니다.
<br>
<br>
<br>

## 🛠️ 트러블슈팅 경험 / 자랑하고 싶은 코드

#### 트러블슈팅 경험
- **문제**: 서버와의 WebSocket 연결이 끊어지는 문제 발생
  - **상황**: 사용자가 채팅을 할 때 서버와의 WebSocket 연결이 불안정해지는 현상이 자주 발생했습니다. 특히, 네트워크 상태가 불안정한 환경에서 문제를 더 자주 겪었습니다.
  - **해결 방법**: `onclose` 이벤트 핸들러를 통해 재연결 로직을 구현하여 안정적인 연결을 유지했습니다. WebSocket 연결이 끊어졌을 때, 일정 시간 간격으로 재연결을 시도하도록 설정했습니다.
  ```typescript
  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_WS_URL_PROD
        : process.env.REACT_APP_WS_URL;

    const connectWebSocket = () => {
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
        console.log("Disconnected from the server, attempting to reconnect...");
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

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

#### 자랑하고 싶은 코드
- **코드**: 사용자 타이핑 상태 관리 로직

- **설명**: 사용자가 메시지를 입력할 때 타이핑 중임을 서버에 알리고, 일정 시간 동안 입력이 없으면 타이핑 중지 상태로 변경하는 로직입니다. 이 기능을 통해 다른 사용자는 누가 타이핑 중인지 실시간으로 알 수 있습니다.

```typescript
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

const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === "Enter") {
    sendMessage();
  } else {
    handleTyping();
  }
};
```
## 📌 회고 / 느낀 점

이번 프로젝트를 통해 `WebSocket`을 활용한 실시간 통신의 중요성을 느끼게 되었습니다.  
처음에는 `WebSocket`의 개념이 생소했지만, 구현 과정을 통해 많은 것을 배울 수 있었습니다.  
특히, 서버와의 안정적인 연결을 유지하고 사용자의 타이핑 상태를 실시간으로 반영하는 부분에서 많은 성장을 했습니다.  
또한, 브라우저 알림 기능을 추가하여 사용자 경험을 향상시킬 수 있었습니다.  
앞으로도 더욱 다양한 실시간 기능을 구현해 보고 싶습니다.  
이 프로젝트를 통해 얻은 경험을 바탕으로 더 복잡하고 기능이 풍부한 애플리케이션을 만들 수 있을 것이라는 자신감이 생겼습니다.


