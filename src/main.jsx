import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
} from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";

// Context & Hooks
import { LanguageProvider } from "./LanguageContext";
import useUserData from "@/hooks/get_user_data.js";

// Pages & Components
import SplashScreen from "./components/SplashScreen.jsx";
import TabBar from "./components/Tabbar.jsx";
import Welcome from "./pages/auth_pages/welcome_page.jsx";
import Login from "./pages/auth_pages/login.jsx";
import Register from "./pages/auth_pages/register.jsx";
import Profile from "./pages/Profile.jsx";
import Courses from "./pages/user_pages/Dashboard.jsx";
import CoursesAdmin from "./pages/admin_pages/Dashboard_admin.jsx";
import AddModal from "./pages/admin_pages/Add_course_modal.jsx";
import DataCenter from "./pages/admin_pages/Data_center.jsx";
import CourseModal from "./pages/user_pages/Course_modal.jsx";
import VerifyEmail from "./pages/auth_pages/verify_email.jsx";

// wrap the app in the custom language provider
function AppRoutesWrapper() {
  const { user, loading, error } = useUserData();

  if (loading) return <SplashScreen />;
  if (error) return <p className="text-red-500">{error}</p>;

  const userLang = user?.lang || "am";

  return (
    <LanguageProvider userLang={userLang}>
      <AppRoutes user={user} />
    </LanguageProvider>
  );
}

// main app
function AppRoutes({ user }) {
  const location = useLocation();

  const authenticated = user?.authenticated;
  const shouldHideTabBar =
    ["/auth", "/login", "/register", "/verify_email", "/"].some((path) =>
      matchPath({ path, end: true }, location.pathname)
    ) ||
    matchPath("/courses/:courseId/:moduleId", location.pathname) ||
    matchPath("/courses_admin/:add_course", location.pathname);

  const background = location.state?.background || null;

  return (
    <div className={shouldHideTabBar ? "" : "pb-16"}>
      <Routes location={background || location}>
        {/* Main Routes; added conditional display and navigation*/}
        <Route
          path="/"
          element={
            authenticated ? (
              user.emailVerified ? (
                user.role === "user" ? (
                  <Navigate to="/courses" />
                ) : (
                  <Navigate to="/courses_admin" />
                )
              ) : (
                <Navigate to="/verify_email" />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/auth"
          element={
            !authenticated ? (
              <Welcome />
            ) : user.role === "user" ? (
              <Navigate to="/courses" />
            ) : (
              <Navigate to="/courses_admin" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authenticated ? (
              <Login />
            ) : user.role === "user" ? (
              <Navigate to="/courses" />
            ) : (
              <Navigate to="/courses_admin" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !authenticated ? (
              <Register />
            ) : user.role === "user" ? (
              <Navigate to="/courses" />
            ) : (
              <Navigate to="/courses_admin" />
            )
          }
        />
        <Route path="/verify_email" element={<VerifyEmail />} />
        <Route
          path="/profile"
          element={!authenticated ? <Navigate to="/auth" /> : <Profile />}
        />
        <Route
          path="/courses"
          element={
            !authenticated ? (
              <Navigate to="/auth" />
            ) : user.role === "user" ? (
              <Courses />
            ) : (
              <Navigate to="/courses_admin" />
            )
          }
        />
        <Route
          path="/courses_admin"
          element={
            !authenticated ? (
              <Navigate to="/auth" />
            ) : user.role === "user" ? (
              <Navigate to="/courses" />
            ) : (
              <CoursesAdmin />
            )
          }
        />
        <Route
          path="/user_data"
          element={
            !authenticated ? (
              <Navigate to="/auth" />
            ) : user.role === "user" ? (
              <Navigate to="/courses" />
            ) : (
              <DataCenter />
            )
          }
        />
      </Routes>

      {/* Modal Routes */}
      {background && (
        <Routes>
          <Route
            path="/courses/:courseId/:moduleId"
            element={<CourseModal />}
          />
          <Route path="/courses_admin/:add_course" element={<AddModal />} />
        </Routes>
      )}

      {/* Show TabBar only if it should not be hidden */}
      {!shouldHideTabBar && <TabBar />}
    </div>
  );
}

// insert the app into index.html to view from browser
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AppRoutesWrapper />
    </Router>
  </StrictMode>
);
