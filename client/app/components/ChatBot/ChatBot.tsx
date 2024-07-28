"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";

const ChatBot = () => {
  const apiUrl = "http://127.0.0.1:5000/api/chat"; // Update with the actual URL

  const [messages, setMessages] = useState([
    {
      content:
        "Greetings! I'm here to help with any blockchain questions you have",
      role: "assistant",
    },
  ]);

  const [inputMessage, setinputMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const sentMessage = {
      content: inputMessage,
      role: "user",
    };
    setMessages([...messages, sentMessage]);
    setinputMessage("");
    await getReply(inputMessage);
  };

  const getReply = async (value: string) => {
    try {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: value }),
      })
        .then((response) => response.json())
        .then((data) => {
          const reply = {
            content: data.message,
            role: "assistant",
          };
          const sentMessage = {
            content: value,
            role: "user",
          };
          setMessages([...messages, sentMessage, reply]);
        });
    } catch (error) {
      //add error message in chatbot here
      console.error("Error:", error);
    }
  };
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageEndRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <div className="absolute bottom-1 left-3 z-10 p-3">
      <div className="dropdown dropdown-right dropdown-end ">
        <div
          tabIndex={0}
          role="button"
          className="w-14 rounded-full bg-base-100 p-1 bg-clip-border shadow-xl shadow-blue-gray-900/5"
        >
          <img alt="img" src="/chat.png" />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content z-[20] menu bg-base-100 rounded-box h-[380px] w-[330px]  bg-clip-border shadow-xl shadow-blue-gray-900/5"
        >
          <section className="container mx-auto w-full h-full fixed inset-0">
            <div className=" w-full h-full flex flex-col">
              <div className="p-1 flex w-full justify-center items-center font-medium text-xl border-b border-gray-400">
                Agora Chatbot
              </div>
              <div className="p-2  flex-grow flex flex-col  h-fit overflow-auto">
                {messages.length &&
                  messages.map((msg, i) => {
                    return (
                      <div
                        className={`chat ${
                          msg.role === "assistant" ? "chat-start" : "chat-end"
                        }`}
                        key={"chatKey" + i}
                      >
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt="img"
                              src={
                                msg.role === "assistant"
                                  ? "/assistant.png"
                                  : "/user.png"
                              }
                            />
                          </div>
                        </div>
                        <div
                          className={`chat-bubble text-white ${
                            msg.role === "assistant"
                              ? "bg-[#0285ff]"
                              : "bg-[#8f17fd]"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                <div ref={messageEndRef} />
              </div>
              <form className="h-[10%] items-center" onSubmit={handleSubmit}>
                <div className="w-full h-full items-center px-2 flex justify-around relative">
                  <input
                    className="block rounded-l-xl py-3.5 px-1.5 w-full text-sm text-gray-900 bg-transparent focus:outline-none "
                    value={inputMessage}
                    onChange={(e) => {
                      setinputMessage(e.target.value);
                    }}
                    type="text"
                    placeholder="Type a question and ask anything!"
                    required
                  />
                  <button
                    className="mx-1 p-2 rounded-full bg-gray-300 hover:bg-blue-300"
                    type="submit"
                  >
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
};

export default ChatBot;
