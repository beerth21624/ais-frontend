// import React from "react";
// import { ChatWindowComponent, WarningMessage } from '../App.styles'
// import ChatHistory from "./ChatHistory";
// import ChatInput from "./ChatInput";

// function ChatWindowComponent({
//   chat,
//   setChat,
//   isTyping,
//   selectedCharacter,
//   socket,
//   characters,
// }) {
//   return (
//     <ChatWindowComponent>
//       <div style={{ padding: "10px", color: "#fff", fontWeight: "bold" }}>
//         {selectedCharacter ? (
//           <div
//             style={{ padding: "10px", color: "#6ABE3A", fontWeight: "bold" }}
//           >
//             คุณเลือกตัวละคร:{" "}
//             {characters.find((char) => char._id === selectedCharacter)?.name}
//           </div>
//         ) : (
//           <WarningMessage>กรุณาเลือกตัวละครก่อนเริ่มแชท</WarningMessage>
//         )}
//       </div>
//       <ChatHistory chat={chat} isTyping={isTyping} />
//       <ChatInput
//         setChat={setChat}
//         selectedCharacter={selectedCharacter}
//         socket={socket}
//       />
//     </ChatWindowComponent>
//   );
// }

// export default ChatWindowComponent;
