import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopUp from "@/components/basic_ui/pop_up.jsx";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
import { useAllPrograms } from "@/hooks/get_courses.js";
import RemoteImage from "@/components/basic_ui/remoteImgDisplay.jsx";
import quiz_ill from "@/assets/images/quiz_ill.jpg";

function Courses() {
  const { user, loading: userLoading, error: userError } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showLockPopup, setShowLockPopup] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const progress = user?.course_progress || {};
  const {
    programsData,
    loading: programsLoading,
    error: programsError,
  } = useAllPrograms();

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

  const openFinalQuiz = (programId, finalQuizId, isLocked) => {
    if (isLocked) {
      setLockMessage("Finish all courses before taking the final quiz");
      setShowLockPopup(true);
    } else {
      navigate(`/courses/${programId}/final_quiz/${finalQuizId}`, {
        state: {
          background: { pathname: location.pathname, search: location.search },
        },
      });
    }
  };

  // ----- Loading or no user -----
  if (userLoading || !user || programsLoading) {
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
  }

  // ----- Error state -----
  if (userError || programsError)
    return <p className="text-red-500">{userError || programsError}</p>;

  // ----- Main dashboard -----
  return (
    <>
      <section id="welcome" className="mar_b_20">
        <h1 className="mar_0 width_100p" style={{ fontWeight: 600 }}>
          {t("hi")} {user.name.split(" ")[0]}
        </h1>
        <h3 className="mar_0 width_100p">{t("welcome_message_home")}</h3>
      </section>

      {/*  ----- No programs available ----- */}
      {/* if (!programsData || programsData.length === 0) {
    return (
      
    );
  } */}
      {programsData && programsData.length != 0 ? (
        <section id="courses">
          {programsData.map((program, pIndex) => {
            const programProgress = progress[program.uid];
            const unlockedCourseIndex =
              (programProgress?.current_course || 1) - 1;
            const isFinalQuizUnlocked = programProgress?.completed === true;

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
                  {program.final_quiz_id && (
                    <div
                      id="course_card"
                      onClick={() =>
                        openFinalQuiz(
                          program.uid,
                          program.final_quiz_id,
                          !isFinalQuizUnlocked
                        )
                      }
                      style={{ position: "relative" }}
                    >
                      {!isFinalQuizUnlocked && (
                        <div className="locked_cover">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div id="course_img">
                        <img src={quiz_ill} alt="Final Quiz" />
                      </div>
                      <div id="course_info">
                        <h4 style={{ fontWeight: 600 }}>
                          {t("take_final_quiz")}
                        </h4>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section id="courses" className="text-center p-10">
          <p>{t("no_course_for_lang")}</p>
        </section>
      )}

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
