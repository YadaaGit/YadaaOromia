import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
import "react-loading-skeleton/dist/skeleton.css";
import PopUp from "@/components/basic_ui/pop_up.jsx";
import EditableCourseDashboard from "./EditCourseDashboard.jsx";
import { useAllPrograms } from "@/hooks/get_courses.js";
import RemoteImage from "@/components/basic_ui/remoteImgDisplay.jsx";

function Courses() {
  const { user, loading, error } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showLockPopup, setShowLockPopup] = useState(false);
  const [isEditabe, setIsEditabe] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const progress = user?.course_progress || {};
  const { programsData, loading: loading_p, error: error_p } = useAllPrograms();

  const openModule = (programId, courseId, isLocked) => {
    if (isLocked) {
      setLockMessage("Complete previous courses to unlock this course");
      setShowLockPopup(true);
    } else {
      navigate(`/courses/${programId}/${courseId}`, {
        state: {
          background: { pathname: location.pathname, search: location.search },
        },
      });
    }
  };

  const openFinalQuiz = (programId, isLocked) => {
    if (isLocked) {
      setLockMessage("Finish all courses before taking the final quiz");
      setShowLockPopup(true);
    } else {
      navigate(`/courses/${programId}/final_quiz`, {
        state: {
          background: { pathname: location.pathname, search: location.search },
        },
      });
    }
  };

  const handleAddCourse = () => {
    navigate(`/courses_admin/add_course`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  if (loading || !user)
    return (
      <section id="courses">
        {[...Array(2)].map((_, pIndex) => (
          <div key={pIndex} style={{ marginTop: 30 }}>
            <h2 style={{ fontWeight: "bold" }}>
              <Skeleton width={220} height={26} />
            </h2>
            <div id="course_list">
              {[...Array(2)].map((_, cIndex) => (
                <div
                  key={cIndex}
                  id="course_card"
                  style={{ cursor: "default" }}
                >
                  <div id="course_img">
                    <Skeleton height={80} width={120} />
                  </div>
                  <div id="course_info">
                    <h4>
                      <Skeleton width={150} />
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  if (isEditabe)
    return (
      <EditableCourseDashboard
        initialData={programsData}
        handleCancel={setIsEditabe}
      />
    );

  return (
    <>
      <section id="welcome" className="mar_b_20">
        <div className="width_100p">
          <h1 className="mar_0 width_100p" style={{ fontWeight: 600 }}>
            {t("hi")}
            {user.name.split(" ")[0]}
          </h1>
          <h3 className="mar_0 width_100p">{t("welcome_message_home")}</h3>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 15,
          padding: 10,
        }}
      >
        <button onClick={handleAddCourse} className="btn-primary">
          {t("add_course")}
        </button>
        <button
          onClick={() => setIsEditabe(!isEditabe)}
          className="btn-primary"
        >
          {t("edit_course")}
        </button>
      </section>

      <section id="courses">
        {programsData &&
          programsData.map((program, pIndex) => {
            // ✅ Default progress if not found
            const programProgress = progress[program.uid] || {
              current_course: 1,
              current_module: 1,
              completed: false,
            };

            // Determine unlocked course & quiz
            const unlockedCourseIndex = programProgress.current_course - 1;
            const isFinalQuizUnlocked = programProgress.completed === true;

            return (
              <div key={pIndex} style={{ marginTop: 40 }}>
                <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>
                  {program.title}
                </h2>
                <div id="course_list">
                  {program.courses.map((course, cIndex) => {
                    const isLocked = cIndex > unlockedCourseIndex;
                    return (
                      <div
                        key={cIndex}
                        id="course_card"
                        onClick={() =>
                          openModule(program.uid, course.uid, isLocked)
                        }
                        style={{ position: "relative" }}
                      >
                        {isLocked && (
                          <div className="locked_cover">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div id="course_img">
                          {course.cover_img && (
                            <RemoteImage
                              uid={course.cover_img}
                              lang={user?.lang || "en"}
                              alt={course.title}
                            />
                          )}
                        </div>
                        <div id="course_info">
                          <h4>{course.title}</h4>
                        </div>
                      </div>
                    );
                  })}

                  {/* Final quiz card */}
                  <div
                    id="course_card"
                    onClick={() =>
                      openFinalQuiz(program.uid, !isFinalQuizUnlocked)
                    }
                    style={{ position: "relative" }}
                  >
                    {!isFinalQuizUnlocked && (
                      <div className="locked_cover">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div id="course_img"></div>
                    <div id="course_info">
                      <h4 style={{ fontWeight: 600 }}>
                        {t("take_final_quiz")}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </section>

      <PopUp
        show={showLockPopup}
        onClose={() => setShowLockPopup(false)}
        message={lockMessage}
        type="error"
      />
    </>
  );
}

export default Courses;
