import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.css';

import Courses from './pages/user_pages/Dashboard.jsx';
import Welcome from './pages/auth_pages/welcome_page.jsx';
import Login from './pages/auth_pages/login.jsx';
import Register from './pages/auth_pages/register.jsx';
import Profile from './pages/Profile.jsx';
import TabBar from './components/Tabbar.jsx';

function AppRoutes() {
  const location = useLocation();
  const hideTabBarRoutes = ['/auth', '/login', '/register', "/"];
  const shouldHideTabBar = hideTabBarRoutes.includes(location.pathname);
  const authenticated = false
  return (
    <div className={shouldHideTabBar ? '' : 'pb-16'}>
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/courses" /> :<Navigate to="/auth" />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Show TabBar only on main pages */}
      {!shouldHideTabBar && <TabBar />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>
);
