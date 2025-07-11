import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCourseData } from "@/hooks/get_course_data_test.js";
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
              {!loading && course && (
                <h2 className="text-xl font-bold">{course.title}</h2>
              )}
            </div>

            {/* Content */}
            <div style={{ paddingTop: `${headerHeight}px` }}>
              {loading && (
                <div className="p-4">
                  <Skeleton variant="text" height={24} width="90%" />
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="70%" />
                </div>
              )}
              {!loading && course && (
                <SectionViewer
                  modules={course.modules}
                  scrollRef={modalRef}
                  currentModuleId={moduleId}
                  programId={programId}
                  courseId={courseId}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
