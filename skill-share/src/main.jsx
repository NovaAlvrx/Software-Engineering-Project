import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Layout from './routes/Layout.jsx'
import Profile from './pages/profile-page/Profile.jsx'
import PostDetail from './pages/PostDetail.jsx'
import SessionsRev from './pages/SessionsRev.jsx'
import Explore from './pages/explore-page/Explore.jsx'
import MockSignUp from './pages/mock-sign-up/MockSignUp.jsx'
import MockLogin from './pages/mock-login/MockLogin.jsx'
import MessageList from "./chat/MessageList.jsx";
import ChatRoom from "./chat/ChatRoom.jsx"
import Home from './pages/home-page/Home.jsx'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/:id/post/:post_id" element={<PostDetail />} />
          <Route path="/explore" element={<Explore />} />

          <Route path="/messages" element={<MessageList />} />
          <Route path="/messages/:otherUserId" element={<ChatRoom />} />
        </Route>
        <Route path="/mock-sign-up" element={<MockSignUp />} />
        <Route path="/mock-login" element={<MockLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-a-sessionreview" element={<SessionsRev />} />
      </Routes>
    </BrowserRouter>    
  </StrictMode>,
)
