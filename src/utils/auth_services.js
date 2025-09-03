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
  phone_number,
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
  await setError("");
  await setLoading(true);

  // Validate required fields
  if (
    !name ||
    !email ||
    !password ||
    !con_password ||
    !age ||
    !sex ||
    !phone_number ||
    !country ||
    !city ||
    !lang
  ) {
    setError("fill_required");
    setLoading(false);
    return;
  }

  // Validate age
  const ageNumber = parseInt(age);
  if (isNaN(ageNumber) || ageNumber < 13 || ageNumber > 60) {
    setError("invalid_age");
    setLoading(false);
    return;
  }

  // Check password match
  if (password !== con_password) {
    setError("password_mismatch");
    setLoading(false);
    return;
  }

  // Check Telegram userId presence
  if (!userId) {
    setError("telegram_required");
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
      phone_number,
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

    // Step 4: let main.jsx handle navigation
    navigate("/");
  } catch (err) {
    console.error("❌ Sign-up Error:", err);
    if (err.code) {
      // Firebase error codes
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("email_in_use");
          break;
        case "auth/invalid-email":
          setError("invalid_email");
          break;
        case "auth/weak-password":
          setError("weak_password");
          break;
        default:
          setError("unexpected_error");
      }
    } else {
      setError(err.message || "unexpected_error");
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
    setError("fill_required");
    return;
  }

  setLoading(true);

  try {
    // 1. Sign In
    await signInWithEmailAndPassword(auth, email, password);

    // 2. Let main.jsx handle navigation
    navigate("/courses");
  } catch (err) {
    console.error(err);
    switch (err.code) {
      case "auth/user-not-found":
        setError("no_user");
        break;
      case "auth/invalid-credential":
        setError("invalid_credentials");
        break;
      case "auth/invalid-email":
        setError("invalid_email");
        break;
      case "auth/network-request-failed":
        setError("network_failed");
        break;
      default:
        setError("unexpected_error");
    }
  } finally {
    setLoading(false);
  }
};

export const handleForgotPassword = async (email, setError, setSuccess) => {
  await setError("");
  await setSuccess("");

  if (!email) {
    setError("enter_email_reset");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setSuccess("reset_email_sent");
  } catch (err) {
    console.error(err);
    switch (err.code) {
      case "auth/user-not-found":
        setError("no_user");
        break;
      case "auth/invalid-email":
        setError("invalid_email");
        break;
      default:
        setError("reset_failed");
    }
  }
};

export const handleLogout = async ({ loading, error, navigate }) => {
  try {
    loading(true);
    error("");

    await signOut(auth); // Sign out from current firebase user session

    // Redirect to welcome page
    if (navigate) navigate("/about_us");
  } catch (err) {
    console.error("Logout error:", err);
    error("logout_failed");
  } finally {
    loading(false);
  }
};
