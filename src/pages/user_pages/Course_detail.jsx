import { useParams, useNavigate } from "react-router-dom";
import { useCourseData } from "@/hooks/get_course_data_test.js";
import { Skeleton } from "@mui/material";
import { useTranslation } from "@/utils/useTranslation.js";
import dummyPrograms from "@/hooks/get_course_data_test.js";
import useUserData from "@/hooks/get_user_data.js";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
import { useState } from "react";
import PopUp from "@/components/basic_ui/pop_up.jsx";

export default function CourseDetails() {
  const { t } = useTranslation();
  const { programId, courseId } = useParams();
  const { course, loading } = useCourseData(programId, courseId);
  const { user } = useUserData();
  const navigate = useNavigate();
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const program = dummyPrograms.find((p) => p.program_id === programId);
  const courses = program?.courses || [];
  const currentIndex = courses.findIndex((c) => c.course_id === courseId);

  const programProgress = user?.course_progress?.[programId];
  const unlockedCourseIndex = (programProgress?.current_course || 1) - 1;
  const unlockedModuleIndex = (programProgress?.current_module || 1) - 1;

  const openModule = (moduleId, isLocked) => {
    if (isLocked) {
      setLockMessage("Complete previous modules to unlock this module");
      setShowLockPopup(true);
    } else {
      navigate(`/courses/${programId}/${courseId}/${moduleId}`, {
        state: {
          background: { pathname: location.pathname, search: location.search },
        },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/courses/${programId}/${courses[currentIndex - 1].course_id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < courses.length - 1) {
      navigate(`/courses/${programId}/${courses[currentIndex + 1].course_id}`);
    } else if (program?.final_quiz) {
      navigate(`/courses/${programId}/final_quiz`);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 bg-black z-50 flex justify-center"
      style={{ alignItems: "flex-end" }}
      onClick={() => navigate("/courses", { replace: true })}
    >
      <div
        className="bg-white w-full max-h-[100vh] min-h-[100vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <button
            onClick={() => navigate("/courses", { replace: true })}
            className="text-xl font-bold"
          >
            ✕
          </button>
          {loading && <Skeleton variant="text" height={40} width="60%" />}
          {!loading && course && (
            <h2 className="text-2xl font-semibold">{course.title}</h2>
          )}
        </div>

        <div className="p-4">
          {loading && (
            <>
              <Skeleton variant="text" height={24} width="90%" />
              <Skeleton variant="text" height={24} width="80%" />
              <Skeleton variant="text" height={24} width="70%" />
            </>
          )}

          {!loading && course && (
            <>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px]">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full max-w-[300px] rounded mb-4"
                  />
                  <p className="text-gray-700 mb-2">{course.description}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Author:</span>{" "}
                      {course.metadata?.author}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {course.metadata?.estimated_time}
                    </p>
                    <p>
                      <span className="font-medium">Difficulty:</span>{" "}
                      {course.metadata?.difficulty}
                    </p>
                    <p>
                      <span className="font-medium">Release:</span>{" "}
                      {course.metadata?.release_date}
                    </p>
                  </div>
                </div>
              <div className="flex-1 min-w-[250px] max-h-[400px] overflow-y-auto border rounded p-2" style={{ borderRadius: 20 }}>
                  {course.modules.map((module, mIndex) => {
                    const isLocked = currentIndex < unlockedCourseIndex ? false : mIndex > unlockedModuleIndex;
                    return (
                      <div
                        key={module.module_id}
                        className="p-2 mb-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer relative"
                        onClick={() => openModule(module.module_id, isLocked)}
                        style={{ borderRadius: 15 }}
                      >
                        {isLocked && (
                          <div className="locked_cover absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {module.title}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={currentIndex === 0 ? "btn btn_disabled" : "btn"}
                >
                  Previous Course
                </button>
                <button onClick={handleNext} disabled={unlockedCourseIndex <= currentIndex} className={unlockedCourseIndex <= currentIndex ? "btn btn_disabled" : "btn"}>
                  {currentIndex < courses.length - 1
                    ? "Next Course"
                    : "Final Quiz"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <PopUp
        show={showLockPopup}
        onClose={() => setShowLockPopup(false)}
        message={lockMessage}
        type="error"
      />
    </div>
  );
}
