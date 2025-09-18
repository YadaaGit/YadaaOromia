import { useState, useEffect, useCallback } from "react";
import useUserData from "./get_user_data.js";

// ---------- Module-level cache to prevent multiple fetches ----------
const cachedDataPerLang = {};
const cachedErrorPerLang = {};
const cachedLoadingPerLang = {};
const subscribersPerLang = {};

/**
 * Custom hook: fetch programs and courses first, followed by modules, quizzes, and images.
 * Shared caching ensures only one fetch per language/session
 */
export const useAllPrograms = () => {
  const { user } = useUserData();
  const lang = user?.lang || "am";

  const [programsData, setProgramsData] = useState(cachedDataPerLang[lang] || []);
  const [loading, setLoading] = useState(!lang || !cachedDataPerLang[lang]);
  const [error, setError] = useState(cachedErrorPerLang[lang] || null);

  const fetchProgramsAndCourses = useCallback(async () => {
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

    // Set the loading state
    cachedLoadingPerLang[lang] = true;
    setLoading(true);

    const baseUrl = import.meta.env.VITE_API_URL || "";

    try {
      // Step 1: Fetch programs and courses first
      const [programRes, courseRes] = await Promise.all([
        fetch(`${baseUrl}/api/${lang}/programs`),
        fetch(`${baseUrl}/api/${lang}/courses`),
      ]);

      if (!programRes.ok) throw new Error("Failed to fetch programs");
      if (!courseRes.ok) throw new Error("Failed to fetch courses");

      const [programData, courseData] = await Promise.all([
        programRes.json(),
        courseRes.json(),
      ]);

      // Assemble programs and courses
      const assembledPrograms = programData.map((program) => {
        const programCourses = courseData
          .filter((c) => Object.values(program.courses_ids || {}).includes(c.uid))
          .sort((a, b) => (a.course_index ?? 0) - (b.course_index ?? 0));

        return {
          ...program,
          courses: programCourses,
        };
      });

      // Cache the results for the current language
      cachedDataPerLang[lang] = assembledPrograms;
      cachedErrorPerLang[lang] = null;

      setProgramsData(assembledPrograms);
      setLoading(false);

      // Step 2: Fetch modules, final quiz, and images in parallel
      fetchAdditionalData(programData, courseData);

      // Notify subscribers with the assembled programs data
      subscribersPerLang[lang].forEach((subscriber) => subscriber(assembledPrograms, null));
      subscribersPerLang[lang] = [];
    } catch (err) {
      cachedErrorPerLang[lang] = err;
      setError(err);
      setLoading(false);

      // Notify any subscribers about the error
      subscribersPerLang[lang].forEach((subscriber) => subscriber([], err));
      subscribersPerLang[lang] = [];
    } finally {
      cachedLoadingPerLang[lang] = false;
    }
  }, [user, lang]);

  // Step 2: Fetch the remaining data (modules, final quiz, and images)
  const fetchAdditionalData = async (programData, courseData) => {
    const baseUrl = import.meta.env.VITE_API_URL || "";

    try {
      const [moduleRes, finalQuizRes, imagesRes] = await Promise.all([
        fetch(`${baseUrl}/api/${lang}/modules`),
        fetch(`${baseUrl}/api/${lang}/final_quiz`),
        fetch(`${baseUrl}/api/${lang}/images`),
      ]);

      if (!moduleRes.ok) throw new Error("Failed to fetch modules");
      if (!finalQuizRes.ok) throw new Error("Failed to fetch final quizzes");
      if (!imagesRes.ok) throw new Error("Failed to fetch images");

      const [moduleData, finalQuizData, imagesData] = await Promise.all([
        moduleRes.json(),
        finalQuizRes.json(),
        imagesRes.json(),
      ]);

      // Assemble programs with modules, quizzes, and images
      const assembledProgramsWithDetails = programData.map((program) => {
        const programCourses = courseData
          .filter((c) => Object.values(program.courses_ids || {}).includes(c.uid))
          .sort((a, b) => (a.course_index ?? 0) - (b.course_index ?? 0));

        const coursesWithModules = programCourses.map((course) => {
          const courseModules = moduleData
            .filter((m) => Object.values(course.module_ids || {}).includes(m.uid))
            .sort((a, b) => (a.module_index ?? 0) - (b.module_index ?? 0));

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
          finalQuizData.find((q) => q.uid === program.final_quiz_id);

        return {
          ...program,
          courses: coursesWithModules,
          final_quiz: finalQuiz || null,
          images: imagesData.map((img) => ({
            ...img,
            coverImage: img.coverImage || null,
          })),
        };
      });

      // Cache and update state with detailed programs
      cachedDataPerLang[lang] = assembledProgramsWithDetails;
      setProgramsData(assembledProgramsWithDetails);
    } catch (err) {
      setError(err);
      cachedErrorPerLang[lang] = err;
    }
  };

  useEffect(() => {
    fetchProgramsAndCourses();
  }, [fetchProgramsAndCourses]);

  return { programsData, loading, error };
};
