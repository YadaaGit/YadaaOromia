import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyPrograms from "@/hooks/get_course_data_test.js";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopUp from "@/components/basic_ui/pop_up.jsx";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
function Courses() {
  const { user, loading, error } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const program_data = [...dummyPrograms];
  const progress = user?.course_progress || {}; // user course progress

  const openModule = (programId, courseId, isLocked) => {
    if (isLocked) {
      setLockMessage("Complete all courses before this to open this");
      setShowLockPopup(true);
    } else {
      navigate(`/courses/${programId}/${courseId}`, {
        state: {
          background: { pathname: location.pathname, search: location.search },
        },
      });
    }
  };

  const openFinalQuiz = (programId) => {
    navigate(`/courses/${programId}/final_quiz`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  if (loading)
    return (
      <section id="courses">
        {[...Array(2)].map((_, pIndex) => (
          <div key={pIndex} style={{ marginTop: 30 }}>
            <h2 style={{ fontWeight: "bold" }}>
              <Skeleton width={220} height={26} />
            </h2>
            {[...Array(2)].map((_, cIndex) => (
              <div key={cIndex} style={{ marginTop: 20 }}>
                <h3 style={{ fontWeight: "500" }}>
                  <Skeleton width={180} height={22} />
                </h3>
                <div id="course_list">
                  {[...Array(2)].map((_, mIndex) => (
                    <div
                      key={mIndex}
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
                        <span>
                          <Skeleton width={100} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <section id="welcome" className="mar_b_20">
        <div className="width_100p">
          <h1 className="mar_0 width_100p" style={{ fontWeight: 600 }}>
            {t("hi")} {user.name.split(" ")[0]}
          </h1>
          <h3 className="mar_0 width_100p">{t("welcome_message_home")}</h3>
        </div>
      </section>

      <section id="courses">
        {program_data.map((program, pIndex) => 
        (
          <div key={pIndex} style={{ marginTop: 40 }}>
            <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>
              {program.title}
            </h2>
            <div id="course_list">
              {program.courses.map((course, cIndex) => {
                const courseProgress = progress[course.course_id];
                const isCompleted = courseProgress?.completed;
                const isFirstLocked =
                  !isCompleted &&
                  !program.courses
                    .slice(0, cIndex)
                    .every(
                      (prevCourse) => progress[prevCourse.course_id]?.completed
                    );

                return (
                  <div
                    key={cIndex}
                    id="course_card"
                    onClick={() =>
                      openModule(
                        program.program_id,
                        course.course_id,
                        isFirstLocked
                      )
                    }
                    className={`course_card_id_${cIndex}`}
                    style={{position: "relative"}}
                  >
                    {isFirstLocked ? (
                      <div className="locked_cover">
                        <Lock className="w-6 h-6" style={{ color: "white" }} />
                      </div>
                    ) : null}
                    <div id="course_img">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div id="course_info">
                      <h4>{course.title}</h4>
                    </div>
                  </div>
                );
              })}

              <div
                id="course_card"
                className={`quiz_card_id_${pIndex}`}
                onClick={() => openFinalQuiz(program.program_id)}
                style={{ cursor: "pointer", position: "relative" }}
              >
              {true ? (
                      <div className="locked_cover">
                        <Lock className="w-6 h-6" style={{ color: "white" }} />
                      </div>
                    ) : null}
                <div id="course_img">
                  <img src={program.final_quiz.image} alt="Final Course" />
                </div>
                <div id="course_info">
                  <h4 style={{ fontWeight: "600" }}>{t("take_final_quiz")}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
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
