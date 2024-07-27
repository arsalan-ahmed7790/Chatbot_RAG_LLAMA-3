import { FC, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { PlusIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Message from './Message'; // Ensure this path is correct

// Define the type for the message
interface MessageProps {
    direction: 'prompt' | 'response';
    time: string;
    text: string;
}

const Search: FC = () => {
    const [opened, setOpened] = useState(false);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim() && !loading) {
            const userMessage: MessageProps = {
                direction: 'prompt',
                time: new Date().toLocaleTimeString(),
                text: input
            };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput('');
            setLoading(true); // Set loading to true

            try {
                const response = await axios.post('http://127.0.0.1:8000/llm_on_cpu', {
                    prompt: input
                });
                const botMessage: MessageProps = {
                    direction: 'response',
                    time: new Date().toLocaleTimeString(),
                    text: response.data.answer
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setLoading(false); // Set loading to false
            }
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="fixed bottom-10 right-5 sm:right-10">
            <button
                type="button"
                onClick={() => setOpened(!opened)}
                className={classnames(
                    'size-14 flex items-center justify-center bg-orange-500 rounded-full transform transition-all hover:bg-orange-400',
                    { 'rotate-45': opened }
                )}
            >
                <PlusIcon className="h-6" />
            </button>

            <div
                className={classnames(
                    'absolute w-[calc(100vw-2.5rem)] sm:w-96 h-[28rem] md:h-[30rem] rounded-3xl shadow-lg border bg-orange-500 border-gray-200 bottom-20 right-0 overflow-hidden flex flex-col transition duration-500',
                    {
                        'invisible translate-y-8 opacity-0': !opened,
                        'visible translate-y-0 opacity-100': opened
                    }
                )}
                style={{ scrollbarWidth: 'thin' }} // Hide scrollbar on Firefox
            >
                <style>
                    {`
                        ::-webkit-scrollbar {
                            width: 5px; /* thin scrollbar */
                        }

                        ::-webkit-scrollbar-track {
                            background: transparent; /* transparent track */
                        }

                        ::-webkit-scrollbar-thumb {
                            background: #888; /* color of the thumb */
                            border-radius: 10px; /* roundness of the thumb */
                        }

                        @keyframes pulsingDots {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                        }

                        .pulsing-dots {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: auto;
                            height: 24px;
                        }

                        .pulsing-dot {
                            width: 8px;
                            height: 8px;
                            background-color: #888;
                            border-radius: 50%;
                            margin: 0 2px;
                            animation: pulsingDots 0.6s infinite;
                        }

                        .pulsing-dot:nth-child(1) {
                            animation-delay: 0s;
                        }

                        .pulsing-dot:nth-child(2) {
                            animation-delay: 0.1s;
                        }

                        .pulsing-dot:nth-child(3) {
                            animation-delay: 0.2s;
                        }
                    `}
                </style>
                <header className="h-20 flex items-center px-6 justify-between flex-shrink-0 bg-orange-500 z-10">
                    <h1 className="text-lg font-bold text-white">UET Chatbot</h1>
                </header>
                <main className="flex-1 rounded-t-3xl bg-gray-50 flex flex-col relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, index) => (
                            <Message key={index} direction={msg.direction} time={msg.time}>
                                {msg.text}
                            </Message>
                        ))}
                        {loading && (
                            <div className="pulsing-dots">
                                <div className="pulsing-dot"></div>
                                <div className="pulsing-dot"></div>
                                <div className="pulsing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form
                        className="h-20 flex items-center justify-between px-6 flex-shrink-0 relative"
                        onSubmit={handleSendMessage}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="h-12 bg-white rounded-full w-full border border-gray-300 px-4 pr-14 focus:border-gray-500"
                            placeholder="Ask me anything"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="absolute top-1/2 right-7 rounded-full transform -translate-y-1/2 h-9 w-12 bg-blue-600 flex items-center justify-center text-white transition-colors hover:bg-blue-500"
                            disabled={loading}
                        >
                            <PaperAirplaneIcon className="size-5" />
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Search;
