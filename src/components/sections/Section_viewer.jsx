import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "./Quiz";
import { handleUpdateProgress } from "@/utils/progress_tracking.js";
import { useAllPrograms } from "@/hooks/get_courses.js";
import useUserData from "@/hooks/get_user_data.js";
import RemoteImage from "@/components/basic_ui/remoteImgDisplay.jsx";
import { useProgramData } from "@/hooks/get_course_data.js";
import { useCourseData } from "@/hooks/get_course_data.js";
import { useTranslation } from "@/utils/useTranslation.js";


export default function SectionViewer({
  modules,
  scrollRef,
  currentModuleId,
  programId,
  courseId,
}) {
  const { programsData, loading, error } = useAllPrograms();
  const navigate = useNavigate();
  const initialIndex = modules.findIndex((m) => m.uid === currentModuleId);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const { t } = useTranslation();
  const [error_int, setError_int] = useState("");
  const [loading_int, setLoading_int] = useState(false);
  const [passedQuiz, setPassedQuiz] = useState(false);
  const currentModule = modules[currentIndex];
  const { user } = useUserData();

  const { program, loading: loading_this_program } = useProgramData(programId);
  const { course, loading: loading_this_course } = useCourseData(
    programId,
    courseId
  );

  useEffect(() => {
    scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      navigate(`/courses/${programId}/${courseId}/${nextModule.uid}`);
      setCurrentIndex((prev) => prev + 1);
      setPassedQuiz(false);
    } else if (currentIndex === modules.length - 1) {
      navigate(`/courses`, {
        state: {
          type: "for_next_course",
          message: t("congra_for_finishing"),
          current_programId: programId,
          next_is_final_quiz: program.courses[course.course_index + 1]
            ? false
            : true,
          next_title: program.courses[course.course_index + 1]?.title || null,
          next_id: program.courses[course.course_index + 1]?.uid || null,
          final_quiz_id: program.final_quiz_id || null,
        },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevModule = modules[currentIndex - 1];
      navigate(`/courses/${programId}/${courseId}/${prevModule.uid}`);
      setCurrentIndex((prev) => prev - 1);
      setPassedQuiz(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4" style={{ padding: "20px" }}>
      {currentModule && (
        <>
          {currentModule.content.map((c, idx) => (
            <div key={idx}>
              {c.header && (
                <h4
                  className="font-bold"
                  style={{ fontSize: "x-large", marginBottom: "7px" }}
                >
                  {c.header}
                </h4>
              )}
              {c.text && (
                <p className="mb-4 text-logo-800 leading-relaxed whitespace-pre-line">
                  {c.text}
                </p>
              )}
              {c.media && (
                <RemoteImage
                  uid={c.media}
                  lang={user?.lang || "am"}
                  className="rounded-xl mb-6 w-full max-h-72 object-fill"
                  alt=""
                  style={{ alignSelf: "center", justifySelf: "center" }}
                />
              )}
              {c.breaker && (
                <div
                  style={{
                    height: 4,
                    width: "100%",
                    color: "#734a1c",
                    borderWidth: 2,
                    borderRadius: 20,
                    margin: "7px 0px 20px 0px",
                  }}
                ></div>
              )}
            </div>
          ))}
          <Quiz
            questions={currentModule?.quiz}
            onPassed={async () => {
              setPassedQuiz(true);
              await handleUpdateProgress({
                programId,
                setError: setError_int,
                setLoading: setLoading_int,
                programsData,
              });
            }}
          />
        </>
      )}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={currentIndex === 0 ? "btn btn_disabled" : "btn"}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!passedQuiz}
          className={!passedQuiz ? "btn btn_disabled" : "btn"}
        >
          {currentIndex === modules.length - 1
            ? program?.courses[course?.course_index + 1]
              ? ("Next course")
              : ("Final Quiz")
            : ("Next")}
        </button>
      </div>
    </div>
  );
}
