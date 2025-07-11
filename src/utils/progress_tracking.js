import { auth } from "#/firebase-config.js";
import { doc, setDoc } from "firebase/firestore";
import { db } from "#/firebase-config.js";


export const handleUpdateProgress = async ({
  programId,
  coursePassed,
  setError,
  setLoading,
}) => {
  setError("");
  setLoading(true);

  try {
    // Step 1: use Firebase Auth to get user uid

    // Step 2: Update the course progress
    

    // the progress was stored using the following procedure
            // const user_progress = {
            //   current_course: 1,
            //   current_module: 1,
            //   final_quiz_score: 0,
            //   completed: false,
            //   certificate_link: "",
            // };

            // await Promise.all(
            //   course_data.map((element) =>
            //     setDoc(
            //       doc(db, "users", user.uid, "courses", element.course_id),
            //       user_progress
            //     )
            //   )
            // );

  } catch (err) {
    console.error("Error updating course progress:", err);
    setError(err.message)
  } finally {
    setLoading(false);
  }
};
