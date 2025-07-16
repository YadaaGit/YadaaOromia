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
      className="fixed inset-0 bg-opacity-60 z-50 flex justify-center"
      style={{ alignItems: "flex-end" }}
      onClick={() => navigate("/courses", { replace: true })}
    >
      <div
        className="bg-white w-full max-h-screen min-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justi fy-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate("/courses", { replace: true })}
            className="text-2xl font-bold text-gray-500 hover:text-red-500 transition"
          >
            ✕
          </button>
          {loading ? (
            <Skeleton variant="text" height={40} width="60%" />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">
              {course?.title}
            </h2>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <>
              <Skeleton variant="text" height={24} width="90%" />
              <Skeleton variant="text" height={24} width="80%" />
              <Skeleton variant="text" height={24} width="70%" />
            </>
          ) : (
            course && (
              <>
                <div className="flex flex-wrap gap-6">
                  {/* Left: Course Info */}
                  <div className="flex-1 min-w-[250px]">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full max-w-[300px] rounded-xl shadow mb-4"
                      style={{ alignSelf: "center", justifySelf: "center" }}
                    />
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p
                        style={{
                          width: "100%",
                          height: 40,
                          backgroundColor: "#fbf9fa",
                          borderRadius: 7,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 10px 0 10px",
                        }}
                      >
                        <span className="font-medium">Author:</span>
                        <span>{course.metadata?.author}</span>
                      </p>
                      <p
                        style={{
                          width: "100%",
                          height: 40,
                          backgroundColor: "#fbf9fa",
                          borderRadius: 7,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 10px 0 10px",
                        }}
                      >
                        <span className="font-medium">Modules:</span>
                        <span>{course.modules?.length}</span>
                      </p>
                      <p
                        style={{
                          width: "100%",
                          height: 40,
                          backgroundColor: "#fbf9fa",
                          borderRadius: 7,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 10px 0 10px",
                        }}
                      >
                        <span className="font-medium">Estimated Time:</span>
                        <span>{course.metadata?.estimated_time}</span>
                      </p>
                      <p
                        style={{
                          width: "100%",
                          height: 40,
                          backgroundColor: "#fbf9fa",
                          borderRadius: 7,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 10px 0 10px",
                        }}
                      >
                        <span className="font-medium">Difficulty:</span>
                        <span>{course.metadata?.difficulty}</span>
                      </p>
                      <p
                        style={{
                          width: "100%",
                          height: 40,
                          backgroundColor: "#fbf9fa",
                          borderRadius: 7,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 10px 0 10px",
                        }}
                      >
                        <span className="font-medium">Release:</span>
                        <span>{course.metadata?.release_date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Modules */}
                  <div className="flex-1 min-w-[250px] max-h-[400px] overflow-y-auto border border-gray-200 rounded-2xl p-4 shadow-sm bg-gray-50">
                    <h6
                      style={{
                        fontWeight: "700",
                        fontSize: "large",
                        marginBottom: "10px",
                        color: "#364153",
                      }}
                    >
                      Modules
                    </h6>
                    {course.modules.map((module, mIndex) => {
                      const isLocked =
                        currentIndex < unlockedCourseIndex
                          ? false
                          : mIndex > unlockedModuleIndex;
                      return (
                        <div
                          key={module.module_id}
                          className="relative p-3 mb-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 cursor-pointer transition"
                          onClick={() => openModule(module.module_id, isLocked)}
                        >
                          {isLocked && (
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-opacity-50 rounded-xl"
                              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                            >
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <span className="text-gray-800 font-medium">
                            {module.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded-xl text-white transition ${
                      currentIndex === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Previous Course
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={unlockedCourseIndex <= currentIndex}
                    className={`px-4 py-2 rounded-xl text-white transition ${
                      unlockedCourseIndex <= currentIndex
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {currentIndex < courses.length - 1
                      ? "Next Course"
                      : "Final Quiz"}
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Lock Popup */}
      <PopUp
        show={showLockPopup}
        onClose={() => setShowLockPopup(false)}
        message={lockMessage}
        type="error"
      />
    </div>
  );
}
