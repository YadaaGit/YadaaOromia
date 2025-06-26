/*
  -This hook imports user data from Firebase Authentication and Firestore.
  -It checks session state via onAuthStateChanged.
  -It fetches additional profile data from Firestore and formats the joined timestamp.
*/

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "#/firebase-config.js";
import avatar from "@/assets/images/portrait.jpg"; // fallback avatar

function formatTimestampToDateString(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options); // e.g., Jan 01, 2025
}

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser({ authenticated: false });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
          throw new Error("User data not found in Firestore");
        }

        const userData = userSnapshot.data();

        // Format the joined date
        const formattedJoined = formatTimestampToDateString(userData.joined);

        setUser({
          authenticated: true,
          uuid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          ...userData,
          joined: formattedJoined,
          avatar: userData.avatar || avatar,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return { user, loading, error };
}
