import { useState, useEffect } from "react";
import useUserData from "./get_user_data.js";

// ---------- Module-level cache to prevent multiple fetches ----------
const cachedDataPerLang = {};
const cachedErrorPerLang = {};
const cachedLoadingPerLang = {};
const subscribersPerLang = {};

/**
 * Custom hook: fetch all programs with nested courses, modules, final quiz, and images
 * Shared caching ensures only one fetch per language/session
 */
export const useAllPrograms = () => {
  const { user } = useUserData();
  const lang = user?.lang || "am";

  const [programsData, setProgramsData] = useState(
    (lang && cachedDataPerLang[lang]) || []
  );
  const [loading, setLoading] = useState(
    !lang || (!cachedDataPerLang[lang] && !cachedErrorPerLang[lang])
  );
  const [error, setError] = useState(
    (lang && cachedErrorPerLang[lang]) || null
  );

  useEffect(() => {
    if (!user || !lang) return;

    // Initialize subscribers array for this language if needed
    if (!subscribersPerLang[lang]) subscribersPerLang[lang] = [];

    // Use cached data if available for this language
    if (cachedDataPerLang[lang]) {
      setProgramsData(cachedDataPerLang[lang]);
      setLoading(false);
      return;
    }

    // Subscribe if another fetch is in progress for this language
    if (cachedLoadingPerLang[lang]) {
      const subscriber = (data, err) => {
        setProgramsData(data);
        setError(err);
        setLoading(false);
      };
      subscribersPerLang[lang].push(subscriber);
      return () => {
        subscribersPerLang[lang] = subscribersPerLang[lang].filter(
          (s) => s !== subscriber
        );
      };
    }

    cachedLoadingPerLang[lang] = true;

    const baseUrl = import.meta.env.VITE_API_URL || "";

    const fetchData = async () => {
      try {
        const [programRes, courseRes, moduleRes, finalQuizRes, imagesRes] =
          await Promise.all([
            fetch(`${baseUrl}/api/${lang}/programs`),
            fetch(`${baseUrl}/api/${lang}/courses`),
            fetch(`${baseUrl}/api/${lang}/modules`),
            fetch(`${baseUrl}/api/${lang}/final_quiz`),
            fetch(`${baseUrl}/api/${lang}/images`),
          ]);

        if (!programRes.ok) throw new Error("Failed to fetch programs");
        if (!courseRes.ok) throw new Error("Failed to fetch courses");
        if (!moduleRes.ok) throw new Error("Failed to fetch modules");
        if (!finalQuizRes.ok) throw new Error("Failed to fetch final quizzes");
        if (!imagesRes.ok) throw new Error("Failed to fetch images");

        const [programData, courseData, moduleData, finalQuizData, imagesData] =
          await Promise.all([
            programRes.json(),
            courseRes.json(),
            moduleRes.json(),
            finalQuizRes.json(),
            imagesRes.json(),
          ]);

        // Assemble hierarchy
        const assembledPrograms = (programData || []).map((program) => {
          const programCourses = (courseData || [])
            .filter((c) =>
              Object.values(program.courses_ids || {}).includes(c.uid)
            )
            .sort((a, b) => (a.course_index ?? 0) - (b.course_index ?? 0)); // ✅ sort courses

          const coursesWithModules = programCourses.map((course) => {
            const courseModules = (moduleData || [])
              .filter((m) =>
                Object.values(course.module_ids || {}).includes(m.uid)
              )
              .sort((a, b) => (a.module_index ?? 0) - (b.module_index ?? 0)); // ✅ sort modules

            return {
              ...course,
              modules: courseModules.map((m) => ({
                ...m,
                quiz: m.quiz || [],
              })),
            };
          });

          const finalQuiz =
            program.final_quiz_id &&
            (finalQuizData || []).find((q) => q.uid === program.final_quiz_id);

          return {
            ...program,
            courses: coursesWithModules,
            final_quiz: finalQuiz || null,
            images: (imagesData || []).map((img) => ({
              ...img,
              coverImage: img.coverImage || null,
            })),
          };
        });

        // Cache results for this language
        cachedDataPerLang[lang] = assembledPrograms;
        cachedErrorPerLang[lang] = null;

        setProgramsData(assembledPrograms);
        setLoading(false);

        // Notify subscribers
        subscribersPerLang[lang].forEach((s) => s(assembledPrograms, null));
        subscribersPerLang[lang] = [];
      } catch (err) {
        cachedErrorPerLang[lang] = err;
        setError(err);
        setLoading(false);

        subscribersPerLang[lang].forEach((s) => s([], err));
        subscribersPerLang[lang] = [];
      } finally {
        cachedLoadingPerLang[lang] = false;
      }
    };

    fetchData();
  }, [user, lang]);

  return { programsData, loading, error };
};
