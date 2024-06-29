import { useState, useRef } from 'react';

function useSpeechRecognition(setMessage) {
    const [recognizing, setRecognizing] = useState(false);
    const recognitionRef = useRef(null);

    const startRecognition = () => {
        if (!recognitionRef.current) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'th-TH';
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setMessage((prev) => prev + event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setMessage((prev) => prev + interimTranscript);
            };
            recognitionRef.current.onend = () => {
                setRecognizing(false);
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

    return { recognizing, toggleRecognition };
}

export default useSpeechRecognition;