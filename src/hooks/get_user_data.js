/*
  -This hook imports user data from Firebase Authentication and Firestore.
  -It checks session state via onAuthStateChanged.
  -It fetches additional profile data from Firestore and formats the joined timestamp.
*/

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

function formatTimestampToDateString(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options); // e.g., Jan 01, 2025
}
function formatTimestampToDateString2(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();

  // Format date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // e.g., 2025-07-08
}

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser({ authenticated: false });
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", firebaseUser.uid);

      // 🔄 Set up real-time listener on user document
      const unsubscribeUser = onSnapshot(
        userDocRef,
        async (userSnapshot) => {
          try {
            if (!userSnapshot.exists()) {
              throw new Error("User data not found in Firestore");
            }

            const userData = userSnapshot.data();
            const formattedJoined = formatTimestampToDateString(
              userData.joined
            );// e.g. Jan 01, 2025 format

            const formattedLastActive = formatTimestampToDateString2(
              userData.lastActiveAt
            ); // YYYY-MM-DD format

            // Fetch user's course progress (one-time)
            const courseProgressRef = collection(
              db,
              "users",
              firebaseUser.uid,
              "courses"
            );
            const courseSnapshots = await getDocs(courseProgressRef);

            const courseProgress = {};
            courseSnapshots.forEach((docSnap) => {
              courseProgress[docSnap.id] = docSnap.data();
            });

            setUser({
              authenticated: true,
              uuid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              ...userData,
              joined: formattedJoined,
              lastActiveAt: formattedLastActive,
              avatar: userData.avatar || avatar,
              course_progress: courseProgress,
            });

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

      return () => unsubscribeUser(); // 🔁 Clean up real-time listener
    });

    return () => unsubscribeAuth(); // 🔁 Clean up auth listener
  }, []);

  return { user, loading, error };
}
