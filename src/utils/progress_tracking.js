import { auth, db } from "#/firebase-config.js";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import dummyCourses from "@/hooks/get_course_data_test.js"; // local data to know structure

export const handleUpdateProgress = async ({
  programId,
  setError,
  setLoading
}) => {
  setError("");
  setLoading(true);

  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch program data locally (so we know total courses/modules)
    const programData = dummyCourses.find(p => p.program_id === programId);
    if (!programData) {
      throw new Error("Program not found");
    }

    const courses = programData.courses;
    const userProgressRef = doc(db, "users", user.uid, "programs", programId);
    const userProgressSnap = await getDoc(userProgressRef);

    if (!userProgressSnap.exists()) {
      throw new Error("User progress not found");
    }

    const progress = userProgressSnap.data();
    let { current_course, current_module, completed } = progress;

    if (completed) {
      setLoading(false);
      return;
    }

    // Determine current course & module
    const currentCourseObj = courses[current_course - 1];
    const modulesInCourse = currentCourseObj.modules;
    const totalModules = modulesInCourse.length;
    const totalCourses = courses.length;

    if (current_module < totalModules) {
      // Unlock next module in current course
      await updateDoc(userProgressRef, { current_module: current_module + 1 });
    } else if (current_course < totalCourses) {
      // Finished last module of current course, unlock next course
      await updateDoc(userProgressRef, {
        current_course: current_course + 1,
        current_module: 1
      });
    } else {
      // Last module of last course finished: mark completed
      await updateDoc(userProgressRef, { completed: true });
    }

  } catch (err) {
    console.error("Error updating course progress:", err);
    setError(err.message || "Failed to update progress");
  } finally {
    setLoading(false);
  }
};
