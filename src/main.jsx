import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
} from "react-router-dom";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";

// Context & hooks
import { init } from "./init.js";
import { LanguageProvider } from "./LanguageContext";
import useUserData from "@/hooks/get_user_data.js";
import { db } from "#/firebase-config.js";
import { doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";

// Pages & components
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
import CourseModal from "./pages/course_pages/Course_modal.jsx";
import CourseDetails from "./pages/course_pages/Course_detail.jsx";
import VerifyEmail from "./pages/auth_pages/verify_email.jsx";
import AboutUs from "./pages/about_us.jsx";
import CertificateVerify from "./pages/CertificateVerify.jsx";
import FinalQuizPage from "./pages/course_pages/Final_quiz_modal.jsx";

// Initialize client-side tools
init({
  debug: true,
  eruda: true,
  mockForMacOS: false,
});

// Top-level wrapper: loads user data and language context
function AppRoutesWrapper() {
  const { user, loading, error } = useUserData();

  if (loading) return <SplashScreen />;
  if (error) {
    console.error(error);
    return <SplashScreen />;
  }

  const userLang = user?.lang || "am";

  return (
    <LanguageProvider userLang={userLang}>
      <AppRoutes user={user} />
    </LanguageProvider>
  );
}

// Main routes component
function AppRoutes({ user }) {
  const location = useLocation();
  const authenticated = user?.authenticated;
  const role = user?.role || "user"; // always get latest role reactively

  // Paths where tab bar should be hidden
  const shouldHideTabBar =
    [
      "/welcome",
      "/login",
      "/register",
      "/verify_email",
      "/",
      "/about_us",
      "/certificates/:certId",
    ].some((path) => matchPath({ path, end: true }, location.pathname)) ||
    matchPath("/courses/:programId/:courseId", location.pathname) ||
    matchPath("/courses/:programId/:courseId/:moduleId", location.pathname) ||
    matchPath(
      "/courses/:programId/final_quiz/:finalQuizId",
      location.pathname
    ) ||
    matchPath("/courses_admin/:add_course", location.pathname);
  matchPath("/certificates/:certId", location.pathname);

  const background = location.state?.background || null;

  // Streak logic: update user's streak & last active date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(new Date().getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    if (authenticated && user.lastActiveAt) {
      if (user.lastActiveAt === today) return;

      const userDocRef = doc(db, "users", user.uuid);

      if (user.lastActiveAt === yesterday) {
        updateDoc(userDocRef, { streak: increment(1) }).catch((error) =>
          console.error("Error updating streak:", error)
        );
      } else if (user.lastActiveAt < yesterday) {
        updateDoc(userDocRef, { streak: 1 }).catch((error) =>
          console.error("Error resetting streak:", error)
        );
      }

      updateDoc(userDocRef, { lastActiveAt: serverTimestamp() }).catch(
        (error) => console.error("Error updating last active date:", error)
      );
    }
  }, [authenticated, user.lastActiveAt]);

  return (
    <div className={shouldHideTabBar ? "" : "pb-16"}>
      <Routes location={background || location}>
        {/* Public and protected main routes */}
        <Route
          path="/"
          element={
            authenticated ? (
              <Navigate
                state={location.state || null}
                to={role === "user" ? "/courses" : "/courses_admin"}
              />
            ) : (
              <Navigate state={location.state || null} to="/about_us" />
            )
          }
        />
        <Route
          path="/welcome"
          element={
            !authenticated ? (
              <Welcome />
            ) : (
              <Navigate
                state={location.state || null}
                to={role === "user" ? "/courses" : "/courses_admin"}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authenticated ? (
              <Login />
            ) : (
              <Navigate
                state={location.state || null}
                to={role === "user" ? "/courses" : "/courses_admin"}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            !authenticated ? (
              <Register />
            ) : (
              <Navigate
                state={location.state || null}
                to={role === "user" ? "/courses" : "/courses_admin"}
              />
            )
          }
        />
        <Route path="/verify_email" element={<VerifyEmail />} />
        <Route
          path="/profile"
          element={
            !authenticated ? (
              <Navigate state={location.state || null} to="/welcome" />
            ) : (
              <Profile />
            )
          }
        />
        <Route
          path="/courses"
          element={
            !authenticated ? (
              <Navigate state={location.state || null} to="/welcome" />
            ) : role === "user" ? (
              <Courses />
            ) : (
              <Navigate state={location.state || null} to="/courses_admin" />
            )
          }
        />
        <Route
          path="/courses_admin"
          element={
            !authenticated ? (
              <Navigate state={location.state || null} to="/welcome" />
            ) : role === "user" ? (
              <Navigate state={location.state || null} to="/courses" />
            ) : (
              <CoursesAdmin />
            )
          }
        />
        <Route
          path="/user_data"
          element={
            !authenticated ? (
              <Navigate state={location.state || null} to="/welcome" />
            ) : role === "user" ? (
              <Navigate state={location.state || null} to="/courses" />
            ) : (
              <DataCenter />
            )
          }
        />

        <Route path="/about_us" element={<AboutUs />} />

        {/* Direct access to course detail, module view, final quiz */}
        <Route path="/certificates/:certId" element={<CertificateVerify />} />
        <Route
          path="/courses/:programId/:courseId"
          element={<CourseDetails />}
        />
        <Route
          path="/courses/:programId/:courseId/:moduleId"
          element={<CourseModal />}
        />
        <Route
          path="/courses/:programId/final_quiz/:finalQuizId"
          element={<FinalQuizPage />}
        />
        <Route path="/courses_admin/:add_course" element={<AddModal />} />
      </Routes>

      {/* Modal overlays if background is set */}
      {background && (
        <Routes>
          <Route
            path="/courses/:programId/:courseId"
            element={<CourseDetails />}
          />
          <Route
            path="/courses/:programId/:courseId/:moduleId"
            element={<CourseModal />}
          />
          <Route
            path="/courses/:programId/final_quiz/:finalQuizId"
            element={<FinalQuizPage />}
          />
          <Route path="/courses_admin/:add_course" element={<AddModal />} />
        </Routes>
      )}

      {/* Bottom tab bar, only when appropriate */}
      {!shouldHideTabBar && <TabBar />}
    </div>
  );
}

// Mount the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AppRoutesWrapper />
      <Toaster
        toastOptions={{
          className: "bg-white text-sm font-medium shadow-md rounded-md p-3",
          success: {
            className: "bg-green-100 text-green-800",
          },
          error: {
            className: "bg-red-100 text-red-800",
          },
        }}
      />
    </Router>
  </StrictMode>
);
