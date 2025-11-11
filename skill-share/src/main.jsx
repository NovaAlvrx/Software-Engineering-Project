import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Layout from './routes/Layout.jsx'
import Profile from './pages/profile-page/Profile.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Explore from './pages/explore-page/Explore.jsx'
import MockSignUp from './pages/mock-sign-up/MockSignUp.jsx'
import MockLogin from './pages/mock-login/MockLogin.jsx'
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
          <Route index element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
        </Route>
        <Route path="/sign-up" element={<MockSignUp />} />
        <Route path="/login" element={<MockLogin />} />
        <Route path="/profile/post/:postId" element={<PostDetail />} />
        <Route path="/profile/:username/post/:postId" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>    
  </StrictMode>,
)
