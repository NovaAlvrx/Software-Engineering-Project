//importing libraries, hooks and css component
import { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MessageList.css";

export default function MessageList() {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Fetch logged-in user
    axios
      .get("http://localhost:8000/auth/me", {
        withCredentials: true
      })
      .then(res => {
        setCurrentUser(res.data);
        return res.data.id;
      })
      .then(userId => {
        // Fetch conversations after fetching userId
        axios
          .get(`http://localhost:8000/chat/conversations/${userId}`, {
            withCredentials: true
          })
          .then(res => setConversations(res.data))
          .catch(console.error);
      })
      .catch(console.error);
  }, []);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="messages-list">
      <h3>Your Conversations</h3>

      {conversations.length === 0 && <p>No conversations found.</p>}

      {conversations.map(c => (
        <div
          key={c.conversationId}
          className="conversation-item"
          onClick={() => navigate(`/messages/${c.otherUserId}`)}
        >
          <strong>User {c.otherUserId}</strong>
          <p>{c.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}
