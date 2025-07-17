// utils/updateUserProfile.js
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "#/firebase-config.js";

/**
 * Updates the current user's profile fields in Firestore,
 * with loading and error state callbacks.
 *
 * @param {Object} data - Fields to update (e.g., { name, age, gender })
 * @param {Function} setLoading - Callback to set loading state (boolean)
 * @param {Function} setError - Callback to set error message (string|null)
 * @returns {Promise<void>}
 */
export async function updateUserProfile(data, setLoading, setError) {
  const user = auth.currentUser;

  if (!user) {
    setError?.("No user is currently signed in.");
    return;
  }

  const userRef = doc(db, "users", user.uid);

  try {
    setLoading?.(true);
    setError?.(null);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    setError?.(error.message || "Failed to update user profile");
    throw error;
  } finally {
    setLoading?.(false);
  }
}
