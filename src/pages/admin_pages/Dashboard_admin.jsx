import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useTelegramInitData } from "@/hooks/get_tg_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import { useAllPrograms } from "@/hooks/get_courses.js";
import { LockClosedIcon as Lock } from "@heroicons/react/24/outline";
import useUserData from "@/hooks/get_user_data.js";
import Popup from "reactjs-popup";
import Skeleton from "react-loading-skeleton";
import EditableCourseDashboard from "./EditCourseDashboard.jsx";
import RemoteImage from "@/components/basic_ui/remoteImgDisplay.jsx";
import quiz_ill from "@/assets/images/quiz_ill.jpg";
import ConfettiExplosion from "react-confetti-explosion";
import "react-loading-skeleton/dist/skeleton.css";
import "@/style/Dashboard_user.css";
import "reactjs-popup/dist/index.css";
import "@/style/general.css";

function Courses() {
  const { user, loading: userLoading, error: userError } = useUserData();
  const { t } = useTranslation();
  const { initDataState } = useTelegramInitData();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const {
    type,
    message,
    current_programId,
    next_is_final_quiz,
    next_title,
    next_id,
    final_quiz_id,
    score,
    program_title,
    correct,
    total,
  } = state;

  const pass_grade = 59; // could also come from backend per program
  const [isEditable, setIsEditable] = useState(false);

  const progress = user?.course_progress || {};
  const {
    programsData,
    loading: programsLoading,
    error: programsError,
  } = useAllPrograms();

  const openModule = (programId, courseId, isLocked) => {
    if (isLocked) {
      toast.error(t("unlock_prev_courses"));
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
      toast.error(t("unlock_final_quiz"));
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

  const api = import.meta.env.VITE_API_URL;
  async function handleIssueCertificate({ userName, courseTitle, score }) {
    if (!userName || !courseTitle || !score) {
      console.error("❌ Missing required fields for certificate");
      return;
    }

    const certId = `cert-${Date.now()}`;
    const apiUrl = `${api}/api/certificates`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          courseTitle,
          score,
          certId,
        }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Issue failed");

      const chatId = initDataState?.user.id;
      const fileUrl = `${api}/api/certificates/${certId}/image`; // public URL to certificate

      // Send document via Telegram bot

      const sendRes = await fetch(`${api}/api/send-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          fileUrl: fileUrl, // must be URL, not local path
          caption: "🎓 Here is your certificate!",
        }),
      });

      const data = await sendRes.json();
      toast.success(t("certificate_sent"));

      return json;
    } catch (err) {
      console.error("❌ Certificate issue/send failed:", err);
      toast.error(t("certificate_failed"));
    }
  }

  useEffect(() => {
    console.log(
      user?.name,
      type === "passed_final_quiz",
      score,
      score >= pass_grade,
      program_title
    );
    if (
      initDataState?.user &&
      user?.name &&
      type === "passed_final_quiz" &&
      score &&
      score >= pass_grade &&
      program_title
    ) {
      console.log("✅ All conditions met, issuing certificate...");
      handleIssueCertificate({
        userName: user.name,
        courseTitle: program_title,
        score: score,
      });
    }
  }, [user, type, score, pass_grade, program_title]);

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
                  className="course_card"
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
    const errMessage =
      userError?.message ||
      programsError?.message ||
      String(userError || programsError);
    return <p className="text-red-500">{errMessage}</p>;
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
                        className="course_card"
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
                      className="course_card"
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

      {type && current_programId && next_id && (
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
                background: "#e9fff1 !important",
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
                  ? ` ${t("continue_to_final_quiz")}`
                  : `${t("continue_to")} ${next_title}?`}
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
                  {t("cancel")}
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
                  {t("continue")}
                </button>
              </div>
            </div>
          )}
        </Popup>
      )}

      {type && score && (
        <Popup
          open={type == "passed_final_quiz" && score >= pass_grade}
          // open={true}
          modal
          lockScroll
          arrow
          {...{ contentStyle, overlayStyle, arrowStyle }}
        >
          {(close) => (
            <div
              className="bg-green-100 text-green-800"
              style={{
                width: "80vw",
                background: "#e7faee !important",
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
              <ConfettiExplosion duration={5000} />

              <p style={{ fontWeight: "bold", fontSize: 20 }}>
                {t("congratulations")}
              </p>
              <br />
              <p>
                {t("completed_with_score_1")} -{" "}
                <span style={{ fontSize: 18, fontWeight: "bold" }}>
                  {program_title}
                </span>
                - {t("completed_with_score_2")}{" "}
                <span style={{ fontSize: 18, fontWeight: "bold" }}>
                  {score}%.
                </span>{" "}
                {t("certificate_soon")}
              </p>

              <ConfettiExplosion />
              <ConfettiExplosion />
              <div
                style={{
                  width: "100%",
                  paddingTop: 20,
                  borderRadius: 11,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 15,
                }}
              >
                <button onClick={close}>{t("continue")}</button>
              </div>
            </div>
          )}
        </Popup>
      )}

      {type && score && (
        <Popup
          open={type == "passed_final_quiz" && score < pass_grade}
          // open={true}
          modal
          lockScroll
          arrow
          {...{ contentStyle, overlayStyle, arrowStyle }}
        >
          {(close) => (
            <div
              className="bg-red-100 text-red-800"
              style={{
                width: "80vw",
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
              <p style={{ fontWeight: "bold", fontSize: 20 }}>{t("sorry")}</p>
              <p>{t("you_did_not_pass")}</p>
              <p style={{ fontSize: 12 }}>
                `{t("you_scored")}: {score}% ({correct}/{total}),{" "}
                {t("at_least_to_pass")}`
              </p>

              <div
                style={{
                  width: "100%",
                  paddingTop: 7,
                  borderRadius: 11,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 15,
                }}
              >
                <button onClick={close}>{t("retake")}</button>
              </div>
            </div>
          )}
        </Popup>
      )}
    </>
  );
}

export default Courses;
