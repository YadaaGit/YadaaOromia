import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModuleData } from "@/hooks/get_course_data_test.js";
import SectionViewer from "@/components/sections/Section_viewer.jsx";
import { useTranslation } from "@/utils/useTranslation.js";
import { Skeleton } from "@mui/material";

export default function CourseModal() {
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const modalRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { programId, courseId, moduleId } = useParams();
  const { module, loading } = useModuleData(programId, courseId, moduleId);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  // Track header height dynamically
  useEffect(() => {
    if (headerRef.current) {
      const observer = new ResizeObserver(() => {
        setHeaderHeight(headerRef.current.offsetHeight);
      });
      observer.observe(headerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Close modal with animation
  const handleClose = () => setVisible(false);
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => navigate(-1), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, navigate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-50 z-50 flex justify-center"
          style={{ alignItems: "flex-end" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white w-full max-w-3xl max-h-[100vh] min-h-[50vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            {/* Header */}
            <div ref={headerRef} className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-50">
              <button onClick={handleClose} className="absolute top-2 right-4 text-xl font-bold">✕</button>
              {loading && <Skeleton variant="text" height={32} width="60%" />}
              {!loading && !module && <h2 className="text-xl font-semibold">{t("module_not_found")}</h2>}
              {!loading && module && <h2 className="text-xl font-semibold">{module.title}</h2>}
            </div>

            {/* Content area */}
            <div style={{ paddingTop: `${headerHeight}px` }}>
              {loading && (
                <div className="p-4">
                  <Skeleton variant="text" height={24} width="90%" />
                  <Skeleton variant="text" height={24} width="80%" />
                  <Skeleton variant="text" height={24} width="70%" />
                </div>
              )}
              {!loading && !module && <div className="p-4 text-center">{t("module_not_found")}</div>}
              {!loading && module && (
                <SectionViewer module={module} scrollRef={modalRef} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
