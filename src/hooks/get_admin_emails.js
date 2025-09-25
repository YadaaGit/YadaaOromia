import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "#/firebase-config.js";

// Module-level cache and subscribers
let cachedAdminEmails = null; // null = not loaded yet, [] = loaded but empty
let cachedError = null;
let listening = false; // indicates the snapshot listener was started
let loading = false; // indicates first-load is in progress
let subscribers = [];
let unsubscribeFn = null;

// Start listener only once and keep it for app lifetime
function startListening() {
  if (listening) return; // Already started

  listening = true;
  loading = true;

  const docRef = doc(db, "admin_emails", "emails");

  // onSnapshot returns an unsubscribe function
  unsubscribeFn = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        cachedAdminEmails = data.admin_emails_list || [];
        cachedError = null;
      } else {
        cachedAdminEmails = [];
        cachedError = new Error("No admin_emails/emails document found.");
      }
      loading = false;
      notifySubscribers();
    },
    (error) => {
      cachedAdminEmails = [];
      cachedError = error;
      loading = false;
      notifySubscribers();
    }
  );
}

function notifySubscribers() {
  subscribers.forEach((callback) => {
    try {
      callback(cachedAdminEmails, cachedError);
    } catch (e) {
      // swallow subscriber errors to avoid breaking others
      console.error("Subscriber callback error in useAdminEmails:", e);
    }
  });
}

export default function useAdminEmails() {
  const [adminEmails, setAdminEmails] = useState(() =>
    cachedAdminEmails === null ? [] : cachedAdminEmails
  );
  const [error, setError] = useState(cachedError);
  const [isLoading, setIsLoading] = useState(() => cachedAdminEmails === null);

  useEffect(() => {
    // Subscriber to receive updates from the shared listener
    const subscriber = (emails, err) => {
      setAdminEmails(emails || []);
      setError(err);
      setIsLoading(false);
    };
    subscribers.push(subscriber);

    // If we already have cached data/error, apply immediately
    if (cachedAdminEmails !== null || cachedError !== null) {
      setAdminEmails(cachedAdminEmails || []);
      setError(cachedError);
      setIsLoading(false);
    } else {
      // Not loaded yet: ensure listener is started so it will load once
      setIsLoading(true);
    }

    // Start the listener (only once for the app)
    startListening();

    // Cleanup: remove this subscriber but do NOT stop the listener;
    // listener persists for app lifetime so future mounts get cached data.
    return () => {
      subscribers = subscribers.filter((s) => s !== subscriber);
    };
  }, []);

  return { adminEmails, loading: isLoading, error };
}
