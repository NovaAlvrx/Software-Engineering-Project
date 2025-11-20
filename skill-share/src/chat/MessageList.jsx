import { useState, useEffect } from "react";
import axios from "axios";
import "./MessageList.css";

function MessageList({ currentUserId, recipientId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Polling messages every 2 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chat/${currentUserId}/${recipientId}`);
        setMessages(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [currentUserId, recipientId]);

  const sendMessage = async () => {
    if (!newMsg) return;
    try {
      await axios.post("http://localhost:8000/chat/", {
        sender_id: currentUserId,
        recipient_id: recipientId,
        content: newMsg,
      });
      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender_id === currentUserId ? "sent" : "received"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessageList;

