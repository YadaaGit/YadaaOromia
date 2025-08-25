import { auth, db } from "#/firebase-config.js";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

/**
 * Update user progress (unlock next module/course, or mark completed).
 * Requires program data to be passed in from `useAllPrograms`.
 */
export const handleUpdateProgress = async ({
  programId,
  setError,
  setLoading,
  programsData,
}) => {
  setError("");
  setLoading(true);

  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get program structure
    const programData = programsData.find((p) => p.uid === programId);
    if (!programData) {
      throw new Error("Program not found in programsData");
    }

    const courses = programData.courses;
    const userProgressRef = doc(db, "users", user.uid, "programs", programId);
    const userProgressSnap = await getDoc(userProgressRef);

    // If no progress exists, create default entry
    if (!userProgressSnap.exists()) {
      const defaultProgress = {
        certificate_link: "",
        completed: false,
        current_course: 1,
        current_module: 2,
        final_quiz_score: 0,
      };

      await setDoc(userProgressRef, defaultProgress);

      // Increment people_started in programs/:uid
      const programRef = doc(db, "programs", programId);
      await updateDoc(programRef, { people_started: increment(1) });

      setLoading(false);
      return;
    }

    // Otherwise, update progress
    const progress = userProgressSnap.data();
    let { current_course, current_module, completed } = progress;

    if (completed) {
      setLoading(false);
      return;
    }

    const currentCourseObj = courses[current_course - 1];
    const modulesInCourse = currentCourseObj.modules;
    const totalModules = modulesInCourse.length;
    const totalCourses = courses.length;

    if (current_module < totalModules) {
      // Unlock next module in current course
      await updateDoc(userProgressRef, { current_module: current_module + 1 });
    } else if (current_course < totalCourses) {
      // Unlock first module of next course
      await updateDoc(userProgressRef, {
        current_course: current_course + 1,
        current_module: 1,
      });
    } else {
      // Mark program completed
      await updateDoc(userProgressRef, { completed: true });
    }
  } catch (err) {
    console.error("❌ Error updating course progress:", err);
    setError(err.message || "Failed to update progress");
  } finally {
    setLoading(false);
  }
};

/* ===============================
   Extra tracking helpers
================================*/

export const incrementStartedCount = async (programId) => {
  const programRef = doc(db, "programs", programId);
  await updateDoc(programRef, { people_started: increment(1) });
};

export const incrementFinishedCount = async (programId, courseIdx) => {
  const programRef = doc(db, "programs", programId);
  await updateDoc(programRef, {
    [`people_finished_course_${courseIdx + 1}`]: increment(1),
  });
};

export const incrementFinishedAllCount = async (programId) => {
  const programRef = doc(db, "programs", programId);
  await updateDoc(programRef, { people_finished_all_courses: increment(1) });
};

export const markCourseStartedForUser = async (programId, courseIdx) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const userProgressRef = doc(db, "users", user.uid, "programs", programId);
  await setDoc(
    userProgressRef,
    { [`course_${courseIdx + 1}_started`]: true },
    { merge: true }
  );
};

export const markCourseFinishedForUser = async (programId, courseIdx) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const userProgressRef = doc(db, "users", user.uid, "programs", programId);
  await setDoc(
    userProgressRef,
    { [`course_${courseIdx + 1}_finished`]: true },
    { merge: true }
  );
};

export const markAllCoursesFinishedForUser = async (programId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const userProgressRef = doc(db, "users", user.uid, "programs", programId);
  await setDoc(
    userProgressRef,
    { all_courses_finished: true },
    { merge: true }
  );
};
