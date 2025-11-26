//importing libraries, hooks and css component
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChatRoom.css";

export default function ChatRoom() {
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Fetch logged-in user
    axios
      .get("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setCurrentUser(res.data);
        return res.data.id;
      })
      .then(userId => {
        // Fetch messages after we have userId
        axios
          .get(`http://localhost:8000/chat/${userId}/${otherUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => setMessages(res.data))
          .catch(console.error);
      })
      .catch(console.error);
  }, [otherUserId]);

  const sendMessage = () => {
    if (!text.trim() || !currentUser) return;

    const token = localStorage.getItem("access_token");

    axios
      .post(
        "http://localhost:8000/chat",
        {
          sender_id: currentUser.id,
          recipient_id: Number(otherUserId),
          content: text
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setMessages(prev => [...prev, res.data]);
        setText("");
      })
      .catch(console.error);
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="chat-room">
      <h3>Chat with User {otherUserId}</h3>

      <div className="messages">
        {messages.map(m => (
          <div
            key={m.id}
            className={`bubble ${m.sender_id === currentUser.id ? "me" : "them"}`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="send-box">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
