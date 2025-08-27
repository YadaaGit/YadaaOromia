import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@mui/material";
import { useProgramData } from "@/hooks/get_course_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Questions from "@/components/sections/Questions";

export default function CourseModules() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { programId } = useParams();

  const headerRef = useRef(null);
  const modalRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [visible, setVisible] = useState(true);
  const [passedQuiz, setPassedQuiz] = useState(false);

  const { program, loading } = useProgramData(programId);

  // Update header height dynamically
  useEffect(() => {
    if (!headerRef.current) return;

    const observer = new ResizeObserver(() => {
      setHeaderHeight(headerRef.current?.offsetHeight || 0);
    });

    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  // Navigate away when modal closes
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => navigate(`/courses`, { replace: true }), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, navigate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
          onClick={() => setVisible(false)}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative w-full max-w-3xl max-h-[100vh] min-h-[100vh] overflow-y-auto bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              ref={headerRef}
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white shadow-md"
            >
              <h2 className="text-xl font-bold">
                {loading
                  ? <Skeleton variant="text" height={32} width="60%" />
                  : program?.final_quiz?.quiz_title || t("No title")}
              </h2>
              <button
                onClick={() => setVisible(false)}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div
              className="px-5 pt-20 pb-5"
              style={{ paddingTop: headerHeight + 20 }}
            >
              {/* Quiz Description */}
              {!loading && program?.final_quiz?.quiz_description && (
                <h4 className="mt-6 text-xl font-bold">
                  {program.final_quiz.quiz_description}
                </h4>
              )}

              {/* Loading Skeleton */}
              {loading && (
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" height={24} width="90%" />
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="70%" />
                </div>
              )}

              {/* No Quiz */}
              {!loading && !program?.final_quiz && (
                <div className="p-4 text-center">{t("Final quiz not found")}</div>
              )}

              {/* Quiz Component */}
              {!loading && program?.final_quiz?.questions?.length <= 0 && (
                <div className="p-4 text-center">{t("No questions")}</div>
              )}
              {!loading && program?.final_quiz?.questions?.length > 0 && (
                <Questions
                  questions={program.final_quiz.questions}
                  onFinish={() => setPassedQuiz(true)}
                  pass_grade={program.metadata.final_pass_point}
                  program_title={program.title}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
