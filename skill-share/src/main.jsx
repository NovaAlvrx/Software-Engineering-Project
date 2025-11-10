import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import PostDetail from './pages/PostDetail.jsx'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/post/:postId" element={<PostDetail />} />
        <Route path="/profile/:username/post/:postId" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>    
  </StrictMode>,
)
