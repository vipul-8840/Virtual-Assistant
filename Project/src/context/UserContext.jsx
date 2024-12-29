import React, { createContext, useState } from 'react';
import run from '../gemini';

export const datacontext = createContext();

const UserContext = ({ children }) => {
    const [speaking, setSpeaking] = useState(false);
    const [prompt, setPrompt] = useState("listening");
    const [response, setResponse] = useState(false);

    function speak(Text) {
        try {
            let text_speak = new SpeechSynthesisUtterance(Text);
            text_speak.volume = 1;
            text_speak.rate = 1;
            text_speak.pitch = 1;
            text_speak.lang = "hi-GB";
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(text_speak);
        } catch (error) {
            console.error("Error in speech synthesis:", error);
            setPrompt("Sorry, there was an issue with speech synthesis.");
        }
    }

    async function aiResponse(prompt) {
        try {
            let text = await run(prompt);
            let newText = text
                .replace(/google/gi, "Krishna Vipul")
                .replace(/\*/g, ""); 
            setPrompt(newText);
            speak(newText);
            setResponse(true);

            setTimeout(() => { setSpeaking(false); }, 5000);
        } catch (error) {
            console.error("Error in AI response:", error);
            speak("Sorry, I couldn't get a response from the AI.");
            setPrompt("Error: Failed to get AI response.");
        }
    }

    function takeCommand(command) {
        try {
            if (command.includes("open")) {
                const siteName = command.split("open")[1].trim();
                if (siteName) {
                    const url = `https://${siteName}.com`;
                    try {
                        window.open(url);
                        speak(`Opening ${siteName}`);
                        setPrompt(`Opening ${siteName}`);
                        setResponse(true);
                        setTimeout(() => { setSpeaking(false); }, 3000);
                    } catch (error) {
                        console.error("Error opening site:", error);
                        speak(`Sorry, I couldn't open ${siteName}`);
                        setPrompt(`Failed to open ${siteName}`);
                        setTimeout(() => { setSpeaking(false); }, 5000);
                    }
                }
            } else {
                aiResponse(command);
            }
        } catch (error) {
            console.error("Error in processing command:", error);
            speak("Sorry, there was an issue processing the command.");
            setPrompt("Error: Command could not be processed.");
        }
    }

    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new speechRecognition();

    recognition.onresult = (e) => {
        try {
            let currentIndex = e.resultIndex;
            let transcript = e.results[currentIndex][0].transcript;
            setPrompt(transcript);
            takeCommand(transcript.toLowerCase());
        } catch (error) {
            console.error("Error in speech recognition:", error);
            setPrompt("Sorry, I couldn't understand the command.");
        }
    }

    let value = {
        recognition,
        speaking,
        setSpeaking,
        prompt,
        setPrompt,
        response,
        setResponse
    }

    return (
        <div className="p-4">
            <datacontext.Provider value={value}>
                {children}
            </datacontext.Provider>
        </div>
    );
}

export default UserContext;
