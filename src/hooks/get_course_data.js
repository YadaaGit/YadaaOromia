/*
  - This hook will fetch the courses and avatars (for users to choose from and use as a profile pic) uploaded to the MongoDB setup for this bot
  - Only the courses and the avatars will be saved on the MongoDB, all other data (like user information and progress data) 
    will be saved on the firebase firestore databsase 
*/


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
