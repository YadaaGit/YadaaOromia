import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModuleData } from "@/hooks/get_course_data_test.js";
import SectionViewer from "@/components/sections/Section_viewer.jsx";
import { useTranslation} from "@/utils/useTranslation.js";
import { Skeleton } from "@mui/material";

export default function CourseModal() {
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const modalRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setHeaderHeight(headerRef.current.offsetHeight);
      });

      resizeObserver.observe(headerRef.current);

      // Clean up when component unmounts
      return () => resizeObserver.disconnect();
    }
  }, []);

  const { courseId, moduleId } = useParams();
  const { module, loading } = useModuleData(courseId, moduleId);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false); // trigger exit animation
  };

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 300); // match to animation duration
      return () => clearTimeout(timer);
    }
  }, [visible, navigate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-50 z-50 flex justify-center"
          style={{ zIndex: 99, alignItems: "flex-end" }}
          onClick={handleClose}
        >
          <motion.div
            key="modal"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white p-6 rounded-t-2xl w-full max-h-[100vh] min-h-[53.5vh] overflow-y-auto relative"
            style={{ alignSelf: "flex-end", borderRadius: 0 }}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div
              className={
                !loading && module
                  ? "fixed top-0 left-0 right-0 bg-white z-50 shadow-md px-4 py-3"
                  : "absolute top-0 left-0 right-0 bg-white z-50 shadow-md px-4 py-3"
              }
              ref={headerRef}
            >
              <button
                onClick={handleClose}
                className="absolute top-2 right-4 text-xl font-bold"
              >
                ✕
              </button>
              {/* Conditional content inside header */}
              {loading && <Skeleton variant="text" height={40} width="60%" />}
              {!loading && !module && (
                <h2 className="text-2xl font-semibold">{t("module_not_found")}</h2>
              )}
              {!loading && module && (
                <h2 className="text-2xl font-semibold">{module.title}</h2>
              )}
            </div>
            <div style={{ paddingTop: `${headerHeight}px` }}>
              {/* Conditional content inside modal */}
              {loading && (
                <div className="p-4">
                  <Skeleton variant="text" height={24} width="90%" />
                  <Skeleton variant="text" height={24} width="85%" />
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="75%" />
                </div>
              )}
              {!loading && !module && (
                <div className="p-4 text-center">{t("module_not_found")}</div>
              )}
              {!loading && module && (
                <>
                  <SectionViewer
                    scrollRef={modalRef}
                    sections={module.sections}
                    finalQuiz={module.final_quiz}
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
