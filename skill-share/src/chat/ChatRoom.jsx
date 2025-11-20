import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import axios from "axios";

export default function ChatBox({ chatId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`http://localhost:8000/chat/${chatId}`, { withCredentials: true });
      setMessages(res.data);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // simple polling
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    await axios.post(
      "http://localhost:8000/chat/send",
      { chatId, senderId: currentUserId, content: newMsg },
      { withCredentials: true }
    );

    setNewMsg("");
    const res = await axios.get(`http://localhost:8000/chat/${chatId}`, { withCredentials: true });
    setMessages(res.data);
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} currentUserId={currentUserId} />
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
