import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
import "react-loading-skeleton/dist/skeleton.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import EditableCourseDashboard from "./EditCourseDashboard.jsx";
import { useAllPrograms } from "@/hooks/get_courses.js";
import RemoteImage from "@/components/basic_ui/remoteImgDisplay.jsx";
import quiz_ill from "@/assets/images/quiz_ill.jpg";
import ConfettiExplosion from "react-confetti-explosion";

function Courses() {
  const { user, loading: userLoading, error: userError } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    type,
    message,
    current_programId,
    next_is_final_quiz,
    next_title,
    next_id,
    final_quiz_id,
  } = location.state || {}; // optional chaining, safe access

  const [isEditable, setIsEditable] = useState(false);

  const progress = user?.course_progress || {};
  const {
    programsData,
    loading: programsLoading,
    error: programsError,
  } = useAllPrograms();


  const openModule = (programId, courseId, isLocked) => {
    if (isLocked) {
      toast.error("Complete previous courses to unlock this course");
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
      toast.error("Finish all courses before taking the final quiz");
    } else {
      navigate(`/courses/${programId}/final_quiz/${finalQuizId}`, {
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
  if (userError || programsError) {
    return <p className="text-red-500">{userError || programsError}</p>;
  }
  // ----- Editable mode -----
  if (isEditable) {
    return (
      <EditableCourseDashboard
        initialData={programsData}
        handleCancel={setIsEditable}
      />
    );
  }
  // ----- Empty programs state -----

  // popup style
  const contentStyle = {
    padding: 0,
    background: "none",
    border: "none",
    alignSelf: "center",
    justifySelf: "center",
  };
  const overlayStyle = {
    background: "rgba(0,0,0,0.5  )",
    justifyContent: "center",
    alignItems: "center",
  };
  const arrowStyle = { color: "#000" };

  // ----- Main dashboard -----
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
          onClick={() => setIsEditable(!isEditable)}
          className="btn-primary"
        >
          {t("edit_course")}
        </button>
      </section>
      {programsData && programsData.length != 0 ? (
        <section id="courses">
          {programsData.map((program, pIndex) => {
            const programProgress = progress[program.uid] || {
              current_course: 1,
              current_module: 1,
              completed: false,
            };
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
                              lang={user?.lang || "am"}
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

      <Popup
        open={type == "for_next_course"}
        modal
        lockScroll
        arrow
        {...{ contentStyle, overlayStyle, arrowStyle }}
      >
        {(close) => (
          <div
            className="bg-green-100 text-green-800"
            style={{
              width: 300,
              height: "auto",
              minHeight: 100,
              padding: 20,
              alignSelf: "center",
              justifySelf: "center",
              borderRadius: 11,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: "bold" }}>
              {message}
              <br />
              <br />
              {next_is_final_quiz
                ? ` Continue to final quiz?`
                : `Continue to ${next_title}?`}
            </p>
            <ConfettiExplosion />
            <div
              style={{
                width: "100%",
                paddingTop: 20,
                borderRadius: 11,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 15,
              }}
            >
              <button
                onClick={close}
                style={{
                  backgroundColor: "#ccc",
                  padding: "8px 16px",
                  borderRadius: 8,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  navigate(
                    next_is_final_quiz
                      ? `/courses/${current_programId}/final_quiz/${final_quiz_id}`
                      : `/courses/${current_programId}/${next_id}`
                  );
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </Popup>
    </>
  );
}

export default Courses;
