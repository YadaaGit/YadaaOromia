import { useParams, useNavigate } from 'react-router-dom';
import { useCourseData } from '@/hooks/get_course_data_test.js';
import SectionViewer from '@/components/sections/Section_viewer.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CourseModal() {
  const { courseId } = useParams();
  const { course, loading } = useCourseData(courseId);
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
          style={{ zIndex: 99, alignItems: 'flex-end' }}
          onClick={handleClose}
        >
          <motion.div
            key="modal"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="bg-white p-6 rounded-t-2xl w-full max-w-3xl max-h-[93.5vh] min-h-[53.5vh] overflow-y-auto relative"
            style={{ alignSelf: 'flex-end' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-4 text-xl font-bold"
            >
              ✕
            </button>

            {/* Conditional content inside modal */}
            {loading && <div className="p-4 text-center">Loading...</div>}
            {!loading && !course && (
              <div className="p-4 text-center">Course not found</div>
            )}
            {!loading && course && (
              <>
                <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
                <SectionViewer sections={course.sections} />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
