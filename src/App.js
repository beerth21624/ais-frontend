import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import io from 'socket.io-client';
import { FaMicrophone } from 'react-icons/fa';
import { IoStop } from "react-icons/io5";
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { Mic } from 'lucide-react';
import { MicOff } from 'lucide-react';


import {
  AppContainer,
  CharacterCard,
  CharacterSelection,
  ChatHistory,
  ChatInput,
  ChatInputContainer,
  ChatWindow,
  Header,
  Message,
  SendButton,
  TypingIndicator,
  WarningMessage,
  VoiceButton
} from './App.styles';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const socket = useRef(null);
  const typingTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const [recognizing, setRecognizing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);


  const speak = (text) => {
    if (ttsEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH'; // Set language to Thai
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechRecognitionSupported(!!SpeechRecognition);
  }, []);

  useEffect(() => {
    socket.current = io('https://ais-be.tu4rl4.easypanel.host');

    socket.current.on('response', (data) => {
      setChat((prevChat) => {
        const updatedChat = prevChat.filter((msg) => msg.text !== 'กำลังพิมพ...');
        const newChat = [...updatedChat, { sender: 'bot', text: data }];
        speak(data);
        return newChat;
      });
      setIsTyping(false);
    });

    socket.current.on('typing', ({ userId, isTyping }) => {
      if (userId !== socket.current.id) {
        setIsTyping(isTyping);
      }
    });

    socket.current.on('error', (error) => {
      setChat((prevChat) => {
        const updatedChat = prevChat.filter((msg) => msg.text !== 'กำลังพิมพ...');
        return [...updatedChat, { sender: 'bot', text: error }];
      });
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
      setMessage('');

      setChat((prevChat) => [...prevChat, { sender: 'bot', text: 'กำลังพิมพ...' }]);

      socket.current.emit('message', message);

      clearTimeout(typingTimeoutRef.current);
      socket.current.emit('typing', { userId: socket.current.id, isTyping: false });
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (selectedCharacter) {
      clearTimeout(typingTimeoutRef.current);

      socket.current.emit('typing', { userId: socket.current.id, isTyping: true });

      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit('typing', { userId: socket.current.id, isTyping: false });
      }, 2000);
    }
  };

  const handleCharacterSelect = (characterId) => {
    setSelectedCharacter(characterId);
    socket.current.emit('initialize', characterId);
    setChat([]);
  };

  const startRecognition = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'th-TH';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        let currentInterimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setMessage((prev) => prev + event.results[i][0].transcript + ' ');
          } else {
            currentInterimTranscript += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(currentInterimTranscript);
      };
      recognitionRef.current.onend = () => {
        setRecognizing(false);
        setInterimTranscript('');
      };
    }
    recognitionRef.current.start();
    setRecognizing(true);
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecognizing(false);
    }
  };

  const toggleRecognition = () => {
    if (recognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const toggleTts = () => {
    if (ttsEnabled) {
      window.speechSynthesis.cancel();

    }
    setTtsEnabled((prev) => !prev);

  };



  return (
    <AppContainer>
      <CharacterSelection>
        <Header>ทดสอบ AI หลานเอง</Header>
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
              onChange={() => handleCharacterSelect(char._id)}
            />
            <img src={char.image_url} alt={char.name} />
            <label htmlFor={char._id}>{char.name}</label>
          </CharacterCard>
        ))}
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
            value={message + interimTranscript}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="พิมพ์ข้อความ..."
            disabled={!selectedCharacter}
          />
          {speechRecognitionSupported && (
            <VoiceButton
              onClick={toggleRecognition}
              recognizing={recognizing}
              disabled={!selectedCharacter}
              title={recognizing ? "หยุดการรับรู้เสียง" : "เริ่มการรับรู้เสียง"}
            >
              {recognizing ? <Mic /> : <MicOff />}
            </VoiceButton>
          )}
          <SendButton onClick={sendMessage} disabled={!selectedCharacter}>ส่ง</SendButton>
         
          {/* <VoiceButton onClick={() => toggleTts()} recognizing={ttsEnabled}>
            {ttsEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </VoiceButton> */}
        </ChatInputContainer>
      </ChatWindow>
    </AppContainer>
  );
}

export default App;
