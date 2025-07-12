/**
 * React hook: loads Firebase user + Firestore user profile + course progress + role.
 * Keeps user object atomic: only sets it once when all data (including role) are ready.
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
import useAdminEmails from "@/hooks/get_admin_emails.js";

/**
 * Format Firestore Timestamp to e.g., "Jan 01, 2025"
 * @param {Timestamp | null} timestamp
 * @returns {string}
 */
function formatTimestampToDateString(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Format Firestore Timestamp to e.g., "2025-07-08"
 * @param {Timestamp | null} timestamp
 * @returns {string}
 */
function formatTimestampToDateString2(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    adminEmails,
    loading: adminLoading,
    error: adminError,
  } = useAdminEmails();

  useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser({ authenticated: false });
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", firebaseUser.uid);

      // Listen to Firestore user document
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

            // Fetch user's course progress
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

            // Wait until adminEmails is ready
            if (!adminLoading && !adminError) {
              const email = firebaseUser.email.trim().toLowerCase();
              const isAdmin = adminEmails.includes(email);
              const role = isAdmin ? "admin" : "user";

              console.log(`Assigned role: ${role} for email: ${email}`);

              // Set full user object, atomic update
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
                role,
              });
            } else {
              // adminEmails not ready yet: keep waiting (do nothing)
            }

            setError(null);
          } catch (err) {
            console.error("Error loading user data:", err);
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
  }, [adminEmails, adminLoading, adminError]); // re-run if adminEmails change

  return { user, loading, error };
}
