import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyCourses from "@/hooks/get_course_data_test.js";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/hooks/useTranslation.js";

function Courses() {
  const { t } = useTranslation();
  const { user, loading, error } = useUserData();
  const navigate = useNavigate();
  const openModule = (courseId, moduleId) => {
    navigate(`/courses/${courseId}/${moduleId}`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  const course_data = [...dummyCourses];

  const handleAddCourse = () => {
    navigate(`/courses_admin/add_course`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };
  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <section id="welcome" className="mar_b_20">
        <div className="width_100p">
          <h1 className="mar_0 width_100p " style={{fontWeight: 600}}>{t("hi")}{user.name.split(" ")[0]}</h1>
          <h3 className="mar_0 width_100p ">
            {t("welcome_message_home")}
          </h3>
        </div>
      </section>
      <section>
        <button onClick={handleAddCourse} className="btn-primary">
          {t("add_course")}
        </button>
      </section>
      <section id="courses">
        {course_data.map((course, index) => (
          <div key={index} style={{ marginTop: 40 }}>
            <div
              style={
                {
                  // borderTop: "2px solid #a8a8a8",
                  // borderBottom: "2px solid #a8a8a8",
                  // padding: 10,
                }
              }
            >
              <h2 style={{ fontWeight: "bold" }}>{course.title}</h2>
            </div>
            <div id="module_list">
              {course.modules.map((module, index) => (
                <div
                  id="module_card"
                  className={`module_card_id_${index}`}
                  key={index}
                  onClick={() => {
                    openModule(course.course_id, module.module_id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div id="module_img">
                    <img src={module.image} />
                  </div>
                  <div id="module_info">
                    <h3>{module.title}</h3>
                    <span>{module.lessons}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Courses;
