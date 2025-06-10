import { useEffect, useState } from 'react';

export const useCourseData = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your actual API or DB call
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Dummy data for now
        const response = await fetch(`/api/courses/${courseId}`);
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return { course, loading };
};
