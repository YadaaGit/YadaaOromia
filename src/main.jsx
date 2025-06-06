import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import Courses from './pages/user_pages/Dashboard.jsx'
// import Dashboard_admin from './pages/admin_pages/Dashboard_admin.jsx'
// import Data from './pages/admin_pages/Data_center.jsx'
// import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import TabBar from './components/Tabbar.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
      <div className="pb-16"> {/* padding to avoid tab bar overlap */}
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <TabBar />
      </div>
    </Router>
)
