import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "#/firebase-config.js";
import avatar from "@/assets/images/portrait.jpg";
import useAdminEmails from "@/hooks/get_admin_emails.js";

function formatTimestampToDateString(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options); // e.g., Jan 01, 2025
}

function formatTimestampToDateString2(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // e.g., 2025-07-08
}

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null); // store firebase user separately
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    adminEmails,
    loading: adminLoading,
    error: adminError,
  } = useAdminEmails();

  // Watch auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser({ authenticated: false });
        setFirebaseUser(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(firebaseUser); // save firebase user

      const userDocRef = doc(db, "users", firebaseUser.uid);

      const unsubscribeUser = onSnapshot(
        userDocRef,
        async (userSnapshot) => {
          try {
            if (!userSnapshot.exists()) {
              throw new Error("User data not found in Firestore");
            }

            const userData = userSnapshot.data();
            const formattedJoined = formatTimestampToDateString(userData.joined);
            const formattedLastActive = formatTimestampToDateString2(userData.lastActiveAt);

            const courseProgressRef = collection(
              db,
              "users",
              firebaseUser.uid,
              "programs"
            );
            const courseSnapshots = await getDocs(courseProgressRef);
            const courseProgress = {};
            courseSnapshots.forEach((docSnap) => {
              courseProgress[docSnap.id] = docSnap.data();
            });

            setUser((prev) => ({
              authenticated: true,
              uuid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              ...userData,
              joined: formattedJoined,
              lastActiveAt: formattedLastActive,
              avatar: userData.avatar || avatar,
              course_progress: courseProgress,
              role: prev?.role || "user", // default role until checked
            }));

            setError(null);
          } catch (err) {
            console.error("Error loading user snapshot:", err);
            setError("Failed to load user data");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Snapshot error:", err);
          setError("Failed to listen to user data");
          setLoading(false);
        }
      );

      return () => unsubscribeUser();
    });

    return () => unsubscribeAuth();
  }, []);

  // Separate useEffect to check adminEmails and set role
  useEffect(() => {
    if (
      firebaseUser &&
      !adminLoading &&
      !adminError &&
      adminEmails.length > 0
    ) {
      const email = firebaseUser.email.trim().toLowerCase();
      const isAdmin = adminEmails.includes(email);
      const role = isAdmin ? "admin" : "user";
      console.log(`${role} \n${email}\nadminEmails: ${adminEmails}`);

      setUser((prev) => prev ? { ...prev, role } : prev);
    }
  }, [firebaseUser, adminEmails, adminLoading, adminError]);

  return { user, loading, error };
}
