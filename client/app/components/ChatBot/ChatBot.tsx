"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/16/solid";

const ChatBot = () => {
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
      fetch("/flask-api/chat", {
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
    <div className="fixed bottom-1 left-3 z-10 p-2">
      <div className="dropdown dropdown-top ">
        <div
          tabIndex={0}
          role="button"
          className="w-14 rounded-full bg-base-100 p-1 bg-clip-border shadow-xl shadow-blue-gray-900/5"
        >
          <img alt="img" src="/assistant.png" />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content z-[20] menu bg-base-100 border border-gray-300 rounded-2xl h-[450px] w-[370px]  bg-clip-border shadow-xl shadow-blue-gray-900/5"
        >
          <section className="container w-full h-full fixed inset-0">
            <div className=" w-full h-full flex flex-col">
              <div className="p-2 flex w-full justify-center text-gray-600 items-center rounded-2xl font-medium text-xl ">
                Agora Chatbot
              </div>
              <hr className=" h-[2px] border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
              <div className="p-2 flex-grow flex flex-col  h-fit overflow-auto">
                {messages.length &&
                  messages.map((msg, i) => {
                    return (
                      <div
                        className={`chat my-1 ${
                          msg.role === "assistant" ? "chat-start" : "chat-end"
                        }`}
                        key={"chatKey" + i}
                      >
                        <div
                          className={`font-normal mx-1 py-2 px-3 rounded-2xl ${
                            msg.role === "assistant"
                              ? "bg-[#f0f0f0] text-[#404040]"
                              : "bg-[#333333] text-white"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                <div ref={messageEndRef} />
              </div>

              <form
                className="h-[10%] items-center mb-4 px-2.5"
                onSubmit={handleSubmit}
              >
                <div className="w-full h-full border border-gray-300 rounded-3xl items-center px-1 py-2.5 flex justify-stretch relative">
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
                    className="p-2 rounded-full text-white bg-gray-800 hover:bg-gray-600 "
                    type="submit"
                  >
                    <ArrowUpIcon className="w-5" />
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
