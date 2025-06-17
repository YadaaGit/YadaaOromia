import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";

import TabBar from "./components/Tabbar.jsx";
import Welcome from "./pages/auth_pages/welcome_page.jsx";
import Login from "./pages/auth_pages/login.jsx";
import Register from "./pages/auth_pages/register.jsx";
import Profile from "./pages/Profile.jsx";
import Courses from "./pages/user_pages/Dashboard.jsx";
import CoursesAdmin from "./pages/admin_pages/Dashboard_admin.jsx";
import AddModal from "./pages/admin_pages/Add_course_modal.jsx";
import CourseModal from "./pages/user_pages/Course_modal.jsx";

function AppRoutes() {
  const location = useLocation();
  const hideTabBarRoutes = [
    "/auth",
    "/login",
    "/register",
    "/courses/:courseId",
    "/courses_admin/add_course",
    "/",
  ];
  const shouldHideTabBar = hideTabBarRoutes.includes(location.pathname);
  const authenticated = false;
  const background = location.state?.background
  ? { pathname: location.state.background.pathname, search: location.state.background.search }
  : null;
  return (
    <div className={shouldHideTabBar ? "" : "pb-16"}>
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            authenticated ? <Navigate to="/courses" /> : <Navigate to="/auth" />
          }
        />
        <Route path="/auth" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses_admin" element={<CoursesAdmin />} />
      </Routes>

      {/* Modal Route */}
      {background && (
        <Routes>
          <Route path="/courses/:courseId/:moduleId" element={<CourseModal />} />
          <Route path="/courses_admin/:add_course" element={<AddModal />} />
        </Routes>
      )}

      {/* Show TabBar only on main pages */}
      {!shouldHideTabBar && <TabBar />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>
);
