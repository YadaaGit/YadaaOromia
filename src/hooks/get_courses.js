import { useState, useEffect, useCallback } from "react";
import useUserData from "./get_user_data.js";

// ---------- Module-level cache to prevent multiple fetches ----------
const cachedDataPerLang = {};
const cachedErrorPerLang = {};
const cachedLoadingPerLang = {};
const subscribersPerLang = {};

/**
 * Custom hook: fetch programs and courses first, followed by modules and quizzes.
 * Shared caching ensures only one fetch per language/session
 */
export const useAllPrograms = () => {
  const { user } = useUserData();
  const lang = user?.lang || "am";

  const [programsData, setProgramsData] = useState(() =>
    cachedDataPerLang[lang] ? cachedDataPerLang[lang] : []
  );
  const [loading, setLoading] = useState(() =>
    cachedDataPerLang[lang] ? false : true
  );
  const [error, setError] = useState(() => cachedErrorPerLang[lang] || null);

  // Reset state when language changes (but prefer cached values)
  useEffect(() => {
    setProgramsData(cachedDataPerLang[lang] || []);
    setLoading(!cachedDataPerLang[lang]);
    setError(cachedErrorPerLang[lang] || null);
  }, [lang]);

  const fetchProgramsAndCourses = useCallback(async () => {
    if (!user || !lang) return;

    if (!subscribersPerLang[lang]) subscribersPerLang[lang] = [];

    // If cached, return immediately
    if (cachedDataPerLang[lang]) {
      setProgramsData(cachedDataPerLang[lang]);
      setLoading(false);
      setError(null);
      return;
    }

    // If another fetch is in progress, subscribe to it
    if (cachedLoadingPerLang[lang]) {
      const subscriber = (data, err) => {
        setProgramsData(data || []);
        setError(err || null);
        setLoading(false);
      };
      subscribersPerLang[lang].push(subscriber);
      // cleanup for this subscription if component unmounts
      return () => {
        subscribersPerLang[lang] = subscribersPerLang[lang].filter(
          (s) => s !== subscriber
        );
      };
    }

    cachedLoadingPerLang[lang] = true;
    setLoading(true);
    setError(null);

    const baseUrl = import.meta.env.VITE_API_URL || "";

    try {
      // Fetch all endpoints in parallel to reduce latency
      const endpoints = [
        `${baseUrl}/api/${lang}/programs`,
        `${baseUrl}/api/${lang}/courses`,
        `${baseUrl}/api/${lang}/modules`,
        `${baseUrl}/api/${lang}/final_quiz`,
      ];
      const responses = await Promise.all(endpoints.map((u) => fetch(u)));

      // Check all responses
      responses.forEach((res, idx) => {
        if (!res.ok) {
          const names = ["programs", "courses", "modules", "final_quiz"];
          throw new Error(`Failed to fetch ${names[idx]}: HTTP ${res.status}`);
        }
      });

      const [programData, courseData, moduleData, finalQuizData] =
        await Promise.all(responses.map((r) => r.json()));

      const programs = Array.isArray(programData) ? programData : [];
      const courses = Array.isArray(courseData) ? courseData : [];
      const modules = Array.isArray(moduleData) ? moduleData : [];
      const finalQuizzes = Array.isArray(finalQuizData) ? finalQuizData : [];

      // Build maps for O(1) lookups
      const coursesById = Object.create(null);
      for (const c of courses) coursesById[c.uid] = c;

      const modulesById = Object.create(null);
      for (const m of modules) modulesById[m.uid] = m;

      const finalQuizById = Object.create(null);
      for (const q of finalQuizzes) finalQuizById[q.uid] = q;

      const assembledProgramsWithDetails = programs.map((program) => {
        // normalize course ids array
        let courseIds = [];
        if (Array.isArray(program.courses_ids)) {
          courseIds = program.courses_ids;
        } else if (program.courses_ids && typeof program.courses_ids === "object") {
          courseIds = Object.values(program.courses_ids);
        }

        // Map courseIds to course objects (fast lookup), preserve order by course_index if available
        const programCourses = courseIds
          .map((cid) => coursesById[cid])
          .filter(Boolean)
          .sort((a, b) => (a.course_index ?? 0) - (b.course_index ?? 0))
          .map((course) => {
            // normalize module ids
            let moduleIds = [];
            if (Array.isArray(course.module_ids)) {
              moduleIds = course.module_ids;
            } else if (course.module_ids && typeof course.module_ids === "object") {
              moduleIds = Object.values(course.module_ids);
            }

            const courseModules = moduleIds
              .map((mid) => modulesById[mid])
              .filter(Boolean)
              .sort((a, b) => (a.module_index ?? 0) - (b.module_index ?? 0))
              .map((m) => ({
                ...m,
                quiz: m.quiz || [],
              }));

            return {
              ...course,
              modules: courseModules,
            };
          });

        const finalQuiz =
          program.final_quiz_id && finalQuizById[program.final_quiz_id]
            ? finalQuizById[program.final_quiz_id]
            : null;

        return {
          ...program,
          courses: programCourses,
          final_quiz: finalQuiz,
        };
      });

      // Cache and notify
      cachedDataPerLang[lang] = assembledProgramsWithDetails;
      cachedErrorPerLang[lang] = null;
      cachedLoadingPerLang[lang] = false;

      setProgramsData(assembledProgramsWithDetails);
      setLoading(false);
      setError(null);

      (subscribersPerLang[lang] || []).forEach((subscriber) =>
        subscriber(assembledProgramsWithDetails, null)
      );
      subscribersPerLang[lang] = [];
    } catch (err) {
      console.error("[get_courses.js] Fetch or assembly error:", err);
      cachedErrorPerLang[lang] = err;
      cachedLoadingPerLang[lang] = false;

      setError(err);
      setLoading(false);

      (subscribersPerLang[lang] || []).forEach((subscriber) =>
        subscriber([], err)
      );
      subscribersPerLang[lang] = [];
    }
  }, [user, lang]);

  useEffect(() => {
    fetchProgramsAndCourses();
  }, [fetchProgramsAndCourses]);

  return { programsData, loading, error };
};
