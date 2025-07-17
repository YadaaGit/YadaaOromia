import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProgramData } from "@/hooks/get_course_data_test.js";
import { useTranslation } from "@/utils/useTranslation.js";
import { Skeleton } from "@mui/material";
import Quiz from "@/components/sections/Quiz";

export default function CourseModules() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const modalRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [visible, setVisible] = useState(true);
  const { programId } = useParams();
  const { program, loading } = useProgramData(programId);
  const [passedQuiz, setPassedQuiz] = useState(false);

  useEffect(() => {
    if (headerRef.current) {
      const observer = new ResizeObserver(() => {
        if (headerRef.current) {
          setHeaderHeight(headerRef.current.offsetHeight);
        }
      });
      observer.observe(headerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(
        () => navigate(`/courses`, { replace: true }),
        300
      );
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
          className="fixed inset-0 bg-opacity-50 z-50 flex justify-center"
          style={{ alignItems: "flex-end" }}
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white w-full max-w-3xl max-h-[100vh] min-h-[50vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            {/* Header */}
            <div
              ref={headerRef}
              className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-50"
            >
              <button
                onClick={() => setVisible(false)}
                className="absolute top-2 right-4 text-xl font-bold"
              >
                ✕
              </button>
              {loading && <Skeleton variant="text" height={32} width="60%" />}
              {!loading && program && (
                <h2 className="text-xl font-bold">{program.final_quiz.quiz_title}</h2>
              )}
            </div>

            {/* Content */}
            <div style={{ paddingTop: `${headerHeight}px`, padding: 20 }}>
              {loading && (
                <div className="p-4">
                  <Skeleton variant="text" height={24} width="90%" />
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="70%" />
                </div>
              )}
              {!loading && (!program || !program.final_quiz) && (
                <div className="p-4 text-center">Final quiz not found</div>
              )}
              {!loading && program && (
                <Quiz questions={program.final_quiz.quiz} onPassed={() => setPassedQuiz(true)} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
