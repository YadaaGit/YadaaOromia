import { useEffect, useState } from "react";
import avatar from "@/assets/images/portrait.jpg";


export default function useUserData() {
  const [user, setUser] = useState(null); // null by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulated fetch – replace with real API call
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Example delay & mock data
        await new Promise((res) => setTimeout(res, 500));
        const data = {
          authenticated: false,
          name: "Abebe Kebede",
          xp: 134679,
          email: "Abebe@example.com",
          username: "Abebe_1",
          country: "Ethiopia",
          joined: "January 2023",
          Current_course: "bio_1",
          Current_module: "2",
          Current_section: "1",
          avatar: avatar,
          role: "admin",
          lang: "en",
        };

        setUser(data);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
