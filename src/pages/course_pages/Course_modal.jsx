import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCourseData, useModuleData } from "@/hooks/get_course_data.js";
import SectionViewer from "@/components/sections/Section_viewer.jsx";
import { useTranslation } from "@/utils/useTranslation.js";
import { Skeleton } from "@mui/material";

export default function CourseModules() {
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const modalRef = useRef(null);
  const { programId, courseId, moduleId } = useParams();
  const { course, loading } = useCourseData(programId, courseId);
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [visible, setVisible] = useState(true);

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
        () => navigate(`/courses/${programId}/${courseId}`, { replace: true }),
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
          className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-end"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="bg-white w-full max-w-4xl max-h-screen min-h-[60vh] overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            {/* Header */}
            <div
              ref={headerRef}
              className="sticky top-0 z-40 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center"
            >
              <h2 className="text-xl font-semibold text-logo-800">
                {loading ? (
                  <Skeleton variant="text" height={28} width="60%" />
                ) : (
                  course?.modules.find((m) => m.uid === moduleId)?.title || "Loading..."
                )}
              </h2>
              <button
                onClick={() => setVisible(false)}
                className="text-2xl text-gray-500 hover:text-red-500 font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              {loading ? (
                <div className="space-y-3 mt-4">
                  <Skeleton variant="text" height={24} width="90%" />
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="70%" />
                </div>
              ) : (
                course && (
                  <SectionViewer
                    modules={course.modules}
                    scrollRef={modalRef}
                    currentModuleId={moduleId}
                    programId={programId}
                    courseId={courseId}
                  />
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
