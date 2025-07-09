import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/logo_icon.png";
const AboutUs = () => {
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  return (
    <div style={styles.container}>
      <header style={styles.nav}>
        <img src={logo} alt="Company Logo" style={styles.logo} onClick={() => window.location.reload()} />
        <div>
          <button style={styles.button} onClick={handleAuthRedirect}>Sign Up</button>
          <button style={styles.button} onClick={handleAuthRedirect}>Login</button>
        </div>
      </header>

      <main style={styles.main}>
        <h1>About Us</h1>
        <p>
          Welcome to our platform! We build intuitive, accessible, and impactful learning tools.
        </p>
        <h2>Our Mission</h2>
        <p>
          Empower learners and educators through innovative digital experiences.
        </p>
        <h2>Our Team</h2>
        <p>
          We are developers, designers, and educators collaborating to improve access to quality education.
        </p>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fa",
    color: "#333",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#004080",
    padding: "10px 20px",
  },
  logo: {
    height: "40px",
    cursor: "pointer",
  },
  button: {
    marginLeft: "10px",
    padding: "8px 16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#004080",
  },
  main: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default AboutUs;
