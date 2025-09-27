import { useState, useEffect } from "react";

export const useUIDMap = () => {
  const [uidMap, setUIDMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLanguages = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "";

        // Fetch programs from all languages
        const [enRes, amRes, orRes] = await Promise.all([
          fetch(`${baseUrl}/api/en/programs`),
          fetch(`${baseUrl}/api/am/programs`),
          fetch(`${baseUrl}/api/or/programs`),
        ]);

        const [enPrograms, amPrograms, orPrograms] = await Promise.all([
          enRes.json(),
          amRes.json(),
          orRes.json(),
        ]);

        // Build uid -> title map
        const map = {};
        const allPrograms = [...enPrograms, ...amPrograms, ...orPrograms];

        allPrograms.forEach((p) => {
          if (p.uid) map[p.uid] = p.title || p.name || p.uid;
          if (Array.isArray(p.courses)) {
            p.courses.forEach((c) => {
              if (c.uid) map[c.uid] = c.title || c.name || c.uid;
              if (Array.isArray(c.modules)) {
                c.modules.forEach((m) => {
                  if (m.uid) map[m.uid] = m.title || m.name || m.uid;
                });
              }
            });
          }
        });

        setUIDMap(map);
        setLoading(false);
      } catch (err) {
        console.error("Failed to build UID map:", err);
        setLoading(false);
      }
    };

    fetchAllLanguages();
  }, []);

  return { uidMap, loading };
};
