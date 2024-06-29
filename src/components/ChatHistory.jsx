import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatHistory, Message, TypingIndicator } from "./App.styles";

function ChatHistory({ chat, isTyping }) {
  return (
    <ChatHistory>
      {chat.map((msg, index) => (
        <Message key={index} sender={msg.sender}>
          <div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    style={{ maxWidth: "200px", borderRadius: "10px" }}
                    {...props}
                    alt={props.alt || ""}
                  />
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        </Message>
      ))}
      {isTyping && (
        <Message sender="bot">
          <TypingIndicator>หลานกำลังพิมพ์...</TypingIndicator>
        </Message>
      )}
    </ChatHistory>
  );
}

export default ChatHistory;
