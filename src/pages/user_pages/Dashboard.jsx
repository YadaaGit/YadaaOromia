import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyPrograms from "@/hooks/get_course_data_test.js"; // dummy data
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
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

  const program_data = [...dummyPrograms];

  if (loading) return (
    <section id="courses">
      {[...Array(2)].map((_, pIndex) => ( // Show 2 skeleton programs
        <div key={pIndex} style={{ marginTop: 30 }}>
          <h2 style={{ fontWeight: "bold" }}>
            <Skeleton width={220} height={26} />
          </h2>
          {[...Array(2)].map((_, cIndex) => ( // Show 2 skeleton courses per program
            <div key={cIndex} style={{ marginTop: 20 }}>
              <h3 style={{ fontWeight: "500" }}>
                <Skeleton width={180} height={22} />
              </h3>
              <div id="course_list">
                {[...Array(2)].map((_, mIndex) => ( // 2 skeleton modules per course
                  <div
                    key={mIndex}
                    id="course_card"
                    style={{ cursor: "default" }}
                  >
                    <div id="course_img">
                      <Skeleton height={80} width={120} />
                    </div>
                    <div id="course_info">
                      <h4><Skeleton width={150} /></h4>
                      <span><Skeleton width={100} /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <section id="welcome" className="mar_b_20">
        <div className="width_100p">
          <h1 className="mar_0 width_100p" style={{ fontWeight: 600 }}>
            {t("hi")}{user.name.split(" ")[0]}
          </h1>
          <h3 className="mar_0 width_100p">
            {t("welcome_message_home")}
          </h3>
        </div>
      </section>

      <section id="courses">
        {program_data.map((program, pIndex) => (
          <div key={pIndex} style={{ marginTop: 40 }}>
            <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>
              {program.title}
            </h2>

            {program.courses.map((course, cIndex) => (
              <div key={cIndex} style={{ marginTop: 20 }}>
                <h3 style={{ fontWeight: "500", marginLeft: 10 }}>
                  {course.title}
                </h3>
                <div id="course_list">
                  {course.modules.map((module, mIndex) => (
                    <div
                      id="course_card"
                      className={`course_card_id_${mIndex}`}
                      key={mIndex}
                      onClick={() => openModule(course.course_id, module.module_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div id="course_img">
                        <img src={module.image} alt={module.title} />
                      </div>
                      <div id="course_info">
                        <h4>{module.title}</h4>
                        <span>{module.lessons}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

export default Courses;
