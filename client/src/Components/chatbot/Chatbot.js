import React, { useState, useRef, useEffect } from 'react'
import "../styles/Chatbot.scss";
import { BsSend } from "react-icons/bs";
import assistantImage from "../assets/assistant.png";
import userImage from "../assets/user.png";
import chatbotIcon from "../assets/chat.png";
const ChatBot = () => {

    const apiUrl = 'http://127.0.0.1:5000/api/chat';  // Update with the actual URL

    const [messages, setMessages] = useState([
        {
            content: "Greetings! I'm here to help with any blockchain questions you have",
            role: "assistant"
        },
    ]);

    const [inputMessage, setinputMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sentMessage = {
            content: inputMessage,
            role: "user"
        }
        setMessages([...messages, sentMessage]);
        setinputMessage('');
        await getReply(inputMessage);
    }

    const getReply = async (value) => {
        try {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: value }),
            })
                .then(response => response.json())
                .then(data => {
                    const reply = {
                        content: data.message,
                        role: "assistant"
                    }
                    const sentMessage = {
                        content: value,
                        role: "user"
                    }
                    setMessages([...messages, sentMessage, reply]);
                })
        } catch (error) {
            console.error('Error:', error)
        }
    }
    const messageEndRef = useRef(null);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

    return (
        <div className='chatbot'>
            <div className="dropdown dropdown-right dropdown-end">
                <div tabIndex={0} role="button" className="w-16 rounded-full  shadow bg-base-100 p-1">
                    <img alt='img' src={chatbotIcon} />
                </div>
                <div tabIndex={0} className="dropdown-content z-[20] menu shadow bg-base-100 rounded-box h-[540px] w-[410px]">
                    <section className='container mx-auto w-full h-full fixed inset-0'>
                        <div className=" w-full h-full flex flex-col">
                            <div className='p-2 flex w-full justify-center items-center font-serif text-xl'>Agora Chatbot</div>
                            <div className='p-2  flex-grow flex flex-col  h-fit overflow-auto'>
                                {
                                    messages.length && messages.map((msg, i) => {
                                        return (
                                            <div className={`chat ${msg.role === 'assistant' ? 'chat-start' : 'chat-end'}`} key={'chatKey' + i}>
                                                <div className="chat-image avatar">
                                                    <div className="w-10 rounded-full">
                                                        <img alt='img' src={msg.role === 'assistant' ? assistantImage : userImage} />
                                                    </div>
                                                </div>
                                                <div className={`chat-bubble text-white ${msg.role === 'assistant' ? 'bg-[#0285ff]' : 'bg-[#8f17fd]'}`}>{msg.content}</div>
                                            </div>
                                        )
                                    })
                                }
                                <div ref={messageEndRef} />
                            </div>
                            <form className="h-[10%] pb-4 items-center" onSubmit={handleSubmit}>
                                <div className="w-full h-full items-start flex justify-around relative">
                                    <input className="input p-1 mt-1 mx-1 flex-grow" value={inputMessage} onChange={(e) => { setinputMessage(e.target.value) }} type="text" placeholder="Type a question and ask anything!" required />
                                    <button className="btn rounded-full btn-square mx-1" type="submit">
                                        <BsSend size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default ChatBot