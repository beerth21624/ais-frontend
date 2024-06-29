import React, { useState } from "react";
import {
  ChatInputContainer,
  ChatInput,
  SendButton,
  VoiceButton,
} from "./App.styles";
import useSpeechRecognition from "./hooks/useSpeechRecognition";

function ChatInput({ setChat, selectedCharacter, socket }) {
  const [message, setMessage] = useState("");
  const { recognizing, toggleRecognition } = useSpeechRecognition(setMessage);

  const sendMessage = () => {
    if (selectedCharacter && message.trim()) {
      setChat((prevChat) => [...prevChat, { sender: "user", text: message }]);
      setMessage("");
      setChat((prevChat) => [
        ...prevChat,
        { sender: "bot", text: "กำลังพิมพ..." },
      ]);
      socket.emit("message", message);
      socket.emit("typing", { userId: socket.id, isTyping: false });
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (selectedCharacter) {
      socket.emit("typing", { userId: socket.id, isTyping: true });
      setTimeout(() => {
        socket.emit("typing", { userId: socket.id, isTyping: false });
      }, 2000);
    }
  };

  return (
    <ChatInputContainer>
      <ChatInput
        type="text"
        value={message}
        onChange={handleTyping}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="พิมพ์ข้อความ..."
        disabled={!selectedCharacter}
      />
      <SendButton onClick={sendMessage} disabled={!selectedCharacter}>
        ส่ง
      </SendButton>
      <VoiceButton onClick={toggleRecognition}>
        {recognizing ? "หยุด" : "ไมค์"}
      </VoiceButton>
    </ChatInputContainer>
  );
}

export default ChatInput;
