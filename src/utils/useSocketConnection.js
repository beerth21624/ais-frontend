import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

function useSocketConnection(setChat) {
    const [isTyping, setIsTyping] = useState(false);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('https://ais-be.tu4rl4.easypanel.host');

        socket.current.on('response', (data) => {
            setChat((prevChat) => {
                const updatedChat = prevChat.filter((msg) => msg.text !== 'กำลังพิมพ...');
                return [...updatedChat, { sender: 'bot', text: data }];
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
    }, [setChat]);

    return { socket: socket.current, isTyping };
}

export default useSocketConnection;