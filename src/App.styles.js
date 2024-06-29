// App.styles.js
import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 96vh;
  background: linear-gradient(135deg, #6ABE3A, #359312);
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
  }
`;

export const ChatWindow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-top: 20px;

  @media (min-width: 768px) {
    width: 70%;
    margin-top: 0;
  }
`;

export const Header = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background: #6ABE3A;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`;

export const ChatHistory = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
`;

export const Message = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: ${props => (props.sender === 'user' ? 'flex-end' : 'flex-start')};

  & > div {
    max-width: 80%;
    padding:0px 18px;
    border-radius: 18px;
    background: ${props => (props.sender === 'user' ? '#6ABE3A' : '#fff')};
    color: ${props => (props.sender === 'user' ? '#fff' : '#333')};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    line-height: 1.4;
  }

  @media (min-width: 768px) {
    & > div {
      max-width: 70%;
    }
  }
`;

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 20px;
  background: #fff;
  border-top: 1px solid #eee;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #6ABE3A;
  border-radius: 25px;
  margin-right: 10px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 0 3px rgba(106, 190, 58, 0.3);
  }
    &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 12px 25px;
  border: none;
  background: #6ABE3A;
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #359312;
    transform: translateY(-2px);
  }
    &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;

    &:hover {
      background-color: #cccccc;
      transform: none;
    }
  }
`;

export const TypingIndicator = styled.div`
  height: 20px;
  font-size: 14px;
  color: #666;
  padding: 5px 20px;
  font-style: italic;
`;

export const CharacterSelection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  

  @media (min-width: 768px) {
    width: 25%;
    max-width: 300px;
    max-height: none;
    margin-right: 20px;
  }
`;

export const CharacterCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${props => (props.selected ? '2px solid #6ABE3A' : '2px solid #fff')};
  color : ${props => (props.selected ? '#6ABE3A' : '#000')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 15px;
    object-fit: cover;
  }

  label {
    font-size: 16px;
    font-weight: bold;
  }

  input {
    margin-right: 10px;
  }
`;


export const WarningMessage = styled.div`
  background-color: #ffcccc;
  color: #cc0000;
  padding: 10px;
  text-align: center;
  font-weight: bold;
`;



