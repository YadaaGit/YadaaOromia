import { useState, useEffect } from "react";

/**
 * Custom hook to fetch all programs with nested courses, modules, final quiz, and images
 * Assembles everything into one hierarchy
 */
export const useAllPrograms = (lang = "en") => {
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const baseUrl = import.meta.env.VITE_API_URL || "";

    const fetchData = async () => {
      try {
        // Fetch all resources in parallel
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

        // Assemble hierarchical structure
        const assembledPrograms = (programData || []).map((program) => {
          // Find program's courses
          const programCourses = (courseData || []).filter((c) =>
            Object.values(program.courses_ids || {}).includes(c.uid)
          );

          const coursesWithModules = programCourses.map((course) => {
            const courseModules = (moduleData || []).filter((m) =>
              Object.values(course.module_ids || {}).includes(m.uid)
            );

            return {
              ...course,
              modules: courseModules.map((m) => ({
                ...m,
                quiz: m.quiz || [],
              })),
            };
          });

          // Attach final quiz if exists
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

        setProgramsData(assembledPrograms);
      } catch (err) {
        console.error("❌ Error fetching hierarchical programs:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang]);

  return { programsData, loading, error };
};
