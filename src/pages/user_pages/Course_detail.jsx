import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseData } from "@/hooks/get_course_data_test.js";
import { Skeleton } from "@mui/material";
import { useTranslation } from "@/utils/useTranslation.js";

export default function CourseModal() {
  const { t } = useTranslation();
  const { programId, courseId } = useParams();
  const { course, loading } = useCourseData(programId, courseId);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  const openModule = (programId, courseId, moduleId) => {
    navigate(`/courses/${programId}/${courseId}/${moduleId}`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 bg-black z-50 flex justify-center"
      style={{ zIndex: 99, alignItems: "flex-end" }}
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-h-[100vh] min-h-[100vh] overflow-y-auto relative"
        style={{ borderRadius: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <button onClick={handleClose} className="text-xl font-bold">
            ✕
          </button>
          {loading && <Skeleton variant="text" height={40} width="60%" />}
          {!loading && !course && (
            <h2 className="text-2xl font-semibold">{t("course_not_found")}</h2>
          )}
          {!loading && course && (
            <h2 className="text-2xl font-semibold" style={{ fontSize: "110%" }}>
              {" "}
            </h2>
          )}
        </div>
        <div className="p-4">
          {loading && (
            <div>
              <Skeleton variant="text" height={24} width="90%" />
              <Skeleton variant="text" height={24} width="85%" />
              <Skeleton variant="text" height={24} width="80%" />
              <Skeleton variant="text" height={24} width="75%" />
            </div>
          )}
          {!loading && !course && (
            <div className="text-center">{t("course_not_found")}</div>
          )}
          {!loading && course && (
            <>
              <div className="flex flex-wrap gap-4">
                {/* Left: title, description and image */}
                <div className="flex-1 min-w-[250px]">
                  <h2
                    className="text-2xl font-semibold"
                    style={{ fontSize: "110%" }}
                  >
                    {course.title}
                  </h2>

                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-auto rounded mb-4"
                    style={{ maxWidth: 300 }}
                  />
                  <p className="text-gray-700">{course.description}</p>
                  {/* Metadata */}
                  <div className="text-sm text-gray-600 space-y-1">
                    {course.metadata?.author && (
                      <p>
                        <span className="font-medium">Author:</span>{" "}
                        {course.metadata.author}
                      </p>
                    )}
                    {course.metadata?.estimated_time && (
                      <p>
                        <span className="font-medium">Estimated time:</span>{" "}
                        {course.metadata.estimated_time}
                      </p>
                    )}
                    {course.metadata?.difficulty && (
                      <p>
                        <span className="font-medium">Difficulty:</span>{" "}
                        {course.metadata.difficulty}
                      </p>
                    )}
                    {course.metadata?.release_date && (
                      <p>
                        <span className="font-medium">Release date:</span>{" "}
                        {course.metadata.release_date}
                      </p>
                    )}
                  </div>
                </div>
                {/* Right: scrollable list of modules */}
                <div className="flex-1 min-w-[250px] max-h-[400px] overflow-y-auto border border-gray-200 rounded p-2">
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module) => (
                      <div
                        key={module.module_id}
                        className="p-2 mb-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          openModule(programId, courseId, module.module_id)
                        }
                      >
                        {module.title}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">{t("no_modules_available")}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
