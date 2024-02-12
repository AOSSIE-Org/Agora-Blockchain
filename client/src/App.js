import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import "./App.css";
import ChatBot from "./Components/chatbot/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <Routing />
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;
