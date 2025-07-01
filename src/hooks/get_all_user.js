/*
  - This hook fetches ALL users registered in the Firestore `users` collection.
  - It runs once on mount and supports error and loading states.
  - Each user's `joined` timestamp is formatted.
  - Optionally, you can also fetch course progress for each user (toggle via `includeCourses` flag).
*/

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "#/firebase-config.js";

function formatTimestampToDateString(timestamp) {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "";
  const date = timestamp.toDate();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}

export default function useAllUsers({ includeCourses = false } = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const userCollection = collection(db, "users");
        const snapshot = await getDocs(userCollection);

        const usersWithCourseData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const formattedJoined = formatTimestampToDateString(data.joined);

            let course_progress = {};
            if (includeCourses) {
              const courseCollection = collection(
                db,
                "users",
                docSnap.id,
                "courses"
              );
              const courseSnapshot = await getDocs(courseCollection);
              courseSnapshot.forEach((courseDoc) => {
                course_progress[courseDoc.id] = courseDoc.data();
              });
            }

            return {
              id: docSnap.id,
              ...data,
              joined: formattedJoined,
              course_progress,
            };
          })
        );

        setUsers(usersWithCourseData);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [includeCourses]);

  return { users, loading, error };
}
