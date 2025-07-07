import { useNavigate } from "react-router-dom";
import dummyPrograms from "@/hooks/get_course_data_test.js"; // new dummy data
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";
import { useTranslation } from "@/utils/useTranslation.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  const openFinalCourse = (programId) => {
    navigate(`/programs/${programId}/final`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  const handleAddCourse = () => {
    navigate(`/courses_admin/add_course`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  const program_data = [...dummyPrograms];

  if (loading)
    return (
      <section id="courses">
        {[...Array(2)].map((_, pIndex) => (
          <div key={pIndex} style={{ marginTop: 30 }}>
            <h2 style={{ fontWeight: "bold" }}>
              <Skeleton width={220} height={26} />
            </h2>
            {[...Array(2)].map((_, cIndex) => (
              <div key={cIndex} style={{ marginTop: 20 }}>
                <h3 style={{ fontWeight: "500" }}>
                  <Skeleton width={180} height={22} />
                </h3>
                <div id="module_list">
                  {[...Array(2)].map((_, mIndex) => (
                    <div key={mIndex} id="module_card" style={{ cursor: "default" }}>
                      <div id="module_img">
                        <Skeleton height={80} width={120} />
                      </div>
                      <div id="module_info">
                        <h4><Skeleton width={150} /></h4>
                        <span><Skeleton width={100} /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div id="module_list" style={{ marginTop: 20 }}>
              <div id="module_card" style={{ cursor: "default", opacity: 0.6 }}>
                <div id="module_img">
                  <Skeleton height={80} width={120} />
                </div>
                <div id="module_info">
                  <h4><Skeleton width={120} /></h4>
                  <span><Skeleton width={80} /></span>
                </div>
              </div>
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
          <h1 className="mar_0 width_100p" style={{ fontWeight: 600 }}>
            {t("hi")}{user.name.split(" ")[0]}
          </h1>
          <h3 className="mar_0 width_100p">{t("welcome_message_home")}</h3>
        </div>
      </section>

      <section>
        <button onClick={handleAddCourse} className="btn-primary">
          {t("add_course")}
        </button>
      </section>

      <section id="courses">
        {program_data.map((program, pIndex) => (
          <div key={pIndex} style={{ marginTop: 40 }}>
            <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>
              {program.title}
            </h2>

                <div id="module_list">
            {program.courses.map((course, cIndex) => (
              <div key={cIndex} style={{ marginTop: 20 }}>
                <h3 style={{ fontWeight: "500", marginLeft: 10 }}>
                  {course.title}
                </h3>
                  {course.modules.map((module, mIndex) => (
                    <div
                      id="module_card"
                      className={`module_card_id_${mIndex}`}
                      key={mIndex}
                      onClick={() => openModule(course.course_id, module.module_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div id="module_img">
                        <img src={module.image} alt={module.title} />
                      </div>
                      <div id="module_info">
                        <h4>{course.title}</h4>
                        <span>{course.modules.length} {course.modules.length > 1 ? "Modules" : "Module"}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
                </div>

            {/* ✅ Add Take Final Course card at the end */}
            <div id="module_list" style={{ marginTop: 20 }}>
              <div
                id="module_card"
                className="final_course_card"
                onClick={() => openFinalCourse(program.program_id)}
                style={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}
              >
                <div id="module_img">
                  {/* use a placeholder image or icon */}
                  <img src="/assets/final_course_icon.png" alt="Final Course" />
                </div>
                <div id="module_info">
                  <h4 style={{ color: "#007bff", fontWeight: "600" }}>
                    {t("take_final_course")}
                  </h4>
                  <span>{t("complete_and_get_certificate")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Courses;
