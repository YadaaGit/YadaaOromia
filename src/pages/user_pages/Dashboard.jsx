import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyCourses from "@/hooks/get_course_data_test.js";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation} from "@/hooks/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Courses() {
  const { user, loading, error } = useUserData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openModule = (courseId, moduleId) => {
    navigate(`/courses/${courseId}/${moduleId}`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  const course_data = [...dummyCourses];

  if (loading) return (
  <section id="courses">
    {[...Array(3)].map((_, index) => ( // Show 3 skeleton cards
      <div key={index} style={{ marginTop: 40 }}>
        <div>
          <h2 style={{ fontWeight: "bold" }}>
            <Skeleton width={200} height={24} />
          </h2>
        </div>
        <div id="module_list">
          {[...Array(2)].map((_, idx) => ( // Show 2 skeleton modules per course
            <div
              key={idx}
              id="module_card"
              style={{ cursor: "default" }}
            >
              <div id="module_img">
                <Skeleton height={80} width={120} />
              </div>
              <div id="module_info">
                <h3><Skeleton width={150} /></h3>
                <span><Skeleton width={100} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </section>
);

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
