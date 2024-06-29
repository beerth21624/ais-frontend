import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import SimplePeer from 'simple-peer';

import {
  AppContainer,
  ChatWindow,
  Header,
  ChatHistory,
  Message,
  ChatInputContainer,
  ChatInput,
  SendButton,
  TypingIndicator,
  CharacterSelection,
  CharacterCard,
  WarningMessage
} from './App.styles';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const socket = useRef(null);
  const [stream, setStream] = useState(null);
  const peerRef = useRef(null);
  

  useEffect(() => {
    socket.current = io('https://ais-be.tu4rl4.easypanel.host');

    socket.current.on('response', (data) => {
      setChat((prevChat) => [...prevChat, { sender: 'bot', text: data }]);
      setIsTyping(false);
    });

    socket.current.on('typing', (typing) => {
      setIsTyping(typing);
    });

    socket.current.on('error', (error) => {
      setChat((prevChat) => [...prevChat, { sender: 'bot', text: error }]);
      setIsTyping(false);
    });

    return () => {
      socket.current.off('response');
      socket.current.off('typing');
      socket.current.off('error');
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    getCharacters();
  }, []);


  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(mediaStream);

      socket.current = io('http://localhost:8080');

      peerRef.current = new SimplePeer({
        initiator: true,
        stream: mediaStream,
        trickle: false,
      });

      peerRef.current.on('signal', (signal) => {
        socket.current.emit('signal', { target: 'admin', signal });
      });

      socket.current.on('signal', (data) => {
        peerRef.current.signal(data.signal);
      });
    } catch (err) {
      console.error('Error accessing display media:', err);
    }
  };

  const getCharacters = async () => {
    try {
      const response = await axios.get('https://ais-be.tu4rl4.easypanel.host/character?record_status=A', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCharacters(response.data);
    } catch (error) {
      console.error('Error fetching character:', error);
    }
  };

  const sendMessage = () => {
    if (selectedCharacter && message.trim()) {
      setChat((prevChat) => [...prevChat, { sender: 'user', text: message }]);
      socket.current.emit('message', message);
      setMessage('');
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (selectedCharacter) {
      socket.current.emit('typing', e.target.value.trim() !== '');
    }
  };

  const handleCharacterSelect = (characterId) => {
    setSelectedCharacter(characterId);
    socket.current.emit('initialize', characterId);
    setChat([]);
  };

  return (
    <AppContainer>
      <CharacterSelection>
        <Header>หลานเอง v0.1.0</Header>
        <h2>เลือกตัวละคร</h2>
        {characters.map((char, index) => (
          <CharacterCard
            key={index}
            onClick={() => handleCharacterSelect(char._id)}
            selected={selectedCharacter === char._id}
          >
            <input
              type="radio"
              name="character"
              id={char._id}
              value={char._id}
              checked={selectedCharacter === char._id}
              onChange={(e) => handleCharacterSelect(char._id)}
            />
            <img src={char.image_url} alt={char.name} />
            <label htmlFor={char._id}>{char.name}</label>
          </CharacterCard>
        ))}
       <div className='mt-auto'>
           <button onClick={startScreenShare}>Share Screen</button>
        </div>
      </CharacterSelection>

      <ChatWindow>
        <div style={{ padding: '10px', color: '#fff', fontWeight: 'bold' }}>
          {selectedCharacter ? (
            <div style={{ padding: '10px', color: '#6ABE3A', fontWeight: 'bold' }}>
              คุณเลือกตัวละคร: {characters.find((char) => char._id === selectedCharacter)?.name}
            </div>
          ) : (
            <WarningMessage>กรุณาเลือกตัวละครก่อนเริ่มแชท</WarningMessage>
          )}
        </div>

        <ChatHistory>
          {chat.map((msg, index) => (
            <Message key={index} sender={msg.sender}>
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        style={{ maxWidth: '200px', borderRadius: '10px' }}
                        {...props}
                        alt={props.alt || ""}
                      />
                    )
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
        <ChatInputContainer>
          <ChatInput
            type="text"
            value={message}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="พิมพ์ข้อความ..."
            disabled={!selectedCharacter}
          />
          <SendButton onClick={sendMessage} disabled={!selectedCharacter}>ส่ง</SendButton>
        </ChatInputContainer>
      </ChatWindow>

      {stream && <video autoPlay playsInline ref={video => video && (video.srcObject = stream)} />}
    </AppContainer>
  );
}

export default App;