import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyPrograms from "@/hooks/get_course_data_test.js"; // new dummy data
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
import "react-loading-skeleton/dist/skeleton.css";
import PopUp from "@/components/basic_ui/pop_up.jsx";

function Courses() {
  const { user, loading, error } = useUserData();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showLockPopup, setShowLockPopup] = useState(false);
    const [lockMessage, setLockMessage] = useState("");
  
    const progress = user?.course_progress || {};
  
    const openModule = (programId, courseId, isLocked) => {
      if (isLocked) {
        setLockMessage("Complete previous courses to unlock this course");
        setShowLockPopup(true);
      } else {
        navigate(`/courses/${programId}/${courseId}`, {
          state: { background: { pathname: location.pathname, search: location.search } }
        });
      }
    };
  
    const openFinalQuiz = (programId, isLocked) => {
      if (isLocked) {
        setLockMessage("Finish all courses before taking the final quiz");
        setShowLockPopup(true);
      } else {
        navigate(`/courses/${programId}/final_quiz`, {
          state: { background: { pathname: location.pathname, search: location.search } }
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
                  <div key={cIndex} id="course_card" style={{ cursor: "default" }}>
                    <div id="course_img">
                      <Skeleton height={80} width={120} />
                    </div>
                    <div id="course_info">
                      <h4><Skeleton width={150} /></h4>
                    </div>
                  </div>
                ))}
              </div>
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
            {t("hi")}
            {user.name.split(" ")[0]}
          </h1>
          <h3 className="mar_0 width_100p">{t("welcome_message_home")}</h3>
        </div>
      </section>

      <section>
        <button onClick={handleAddCourse} className="btn-primary">
          {t("add_course")}
        </button>
      </section>

      <section id="courses">
        {dummyPrograms.map((program, pIndex) => {
          const programProgress = progress[program.program_id];
          const unlockedCourseIndex = (programProgress?.current_course || 1) - 1;
          const isFinalQuizUnlocked = programProgress?.completed === true;

          return (
            <div key={pIndex} style={{ marginTop: 40 }}>
              <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>{program.title}</h2>
              <div id="course_list">
                {program.courses.map((course, cIndex) => {
                  const isLocked = cIndex > unlockedCourseIndex;
                  return (
                    <div
                      key={cIndex}
                      id="course_card"
                      onClick={() => openModule(program.program_id, course.course_id, isLocked)}
                      style={{ position: "relative" }}
                    >
                      {isLocked && (
                        <div className="locked_cover">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
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
                  onClick={() => openFinalQuiz(program.program_id, !isFinalQuizUnlocked)}
                  style={{ position: "relative" }}
                >
                  {!isFinalQuizUnlocked && (
                    <div className="locked_cover">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div id="course_img">
                    <img src={program.final_quiz.image} alt="Final Quiz" />
                  </div>
                  <div id="course_info">
                    <h4 style={{ fontWeight: 600 }}>{t("take_final_quiz")}</h4>
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
