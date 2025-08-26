import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "#/firebase-config.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "#/firebase-config.js";


export const handleSignUp = async ({
  name,
  age,
  sex,
  lang,
  email,
  password,
  con_password,
  country,
  city,
  role,
  userId,
  navigate,
  setLoading,
  setError,
}) => {
  setError("");
  setLoading(true);

  // Validate required fields
  if (
    !name ||
    !email ||
    !password ||
    !con_password ||
    !age ||
    !sex ||
    !country ||
    !city ||
    !lang
  ) {
    setError("Please fill in all required fields.");
    setLoading(false);
    return;
  }

  // Validate age
  const ageNumber = parseInt(age);
  if (isNaN(ageNumber) || ageNumber < 13 || ageNumber > 60) {
    setError("Please enter a valid age between 13 and 60.");
    setLoading(false);
    return;
  }

  // Check password match
  if (password !== con_password) {
    setError("Passwords do not match.");
    setLoading(false);
    return;
  }

  // Check Telegram userId presence
  if (!userId) {
    setError("This app must be opened inside Telegram to sign up.");
    setLoading(false);
    return;
  }

  try {
    // Step 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Step 2: Update display name
    await updateProfile(user, { displayName: name });

    // Step 3: Store user data in Firestore
    const userData = {
      name,
      age: ageNumber,
      lang,
      gender: sex,
      email,
      uuid: user.uid,
      joined: serverTimestamp(),
      role: role || "user",
      streak: 1,
      country,
      city,
      lastActiveAt: serverTimestamp(),
      telegramId: String(userId),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    // Step 3b: Store telegram_links mapping
    const idData = {
      firebase_id: user.uid,
      chat_id: String(userId),
    };
    await setDoc(doc(db, "telegram_links", String(userId)), idData);



    // Step 4: Navigate to verification or dashboard
    navigate("/verify_email");
    
  } catch (err) {
    console.error("❌ Sign-up Error:", err);
    if (err.code) {
      // Firebase error codes
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use, try to sign in instead.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters.");
          break;
        default:
          setError("An unexpected error occurred, please try again later.");
      }
    } else {
      setError(err.message || "An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};

export const handleSignIn = async ({
  email,
  password,
  navigate,
  setLoading,
  setError,
}) => {
  await setError("");

  if (!email || !password) {
    setError("Please fill in all required fields.");
    return;
  }

  setLoading(true);

  try {
    // 1. Sign In
    await signInWithEmailAndPassword(auth, email, password);

    // 2. Let main.jsx handle navigation
    navigate("/profile");
  } catch (err) {
    console.error(err);
    switch (err.message) {
      case "auth/user-not-found":
        setError("No user found with this email.");
        break;
      case "auth/invalid-credential":
        setError("Incorrect credentials. Please try again.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format.");
        break;
      case "auth/network-request-failed":
        setError("Network failed to connect, reconnect and try again.");
        break;
      default:
        setError("An unexpected error occurred. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};

export const handleForgotPassword = async (email, setError, setSuccess) => {
  await setError("");
  await setSuccess("");

  if (!email) {
    setError("Please enter your email address to reset your password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setSuccess("Password reset email sent. Check your inbox.");
  } catch (err) {
    console.error(err);
    switch (err.code) {
      case "auth/user-not-found":
        setError("No user found with this email.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format.");
        break;
      default:
        setError("Failed to send reset email. Please try again later.");
    }
  }
};

export const handleLogout = async ({
  loading,
  error,
  navigate,
}) => {
  try {
    loading(true);
    error("");

    await signOut(auth); // Sign out from current firebase user session

    // Redirect to welcome page
    if (navigate) navigate("/about_us");
  } catch (err) {
    console.error("Logout error:", err);
    error("Failed to log out. Please try again.");
  } finally {
    loading(false);
  }
};
