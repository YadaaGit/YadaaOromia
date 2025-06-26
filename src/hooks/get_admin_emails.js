import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "#/firebase-config.js";

export default function useAdminEmails() {
  const [adminEmails, setAdminEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminEmails = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "admin_emails", "emails");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminEmails(data.admin_emails_list);
        } else {
          throw new Error("No admin_emails/emails document found.");
        }
      } catch (err) {
        console.error("Error fetching admin emails:", err);
        setError(err.message || "Failed to fetch admin emails.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEmails();
  }, []);

  return { adminEmails, loading, error };
}
