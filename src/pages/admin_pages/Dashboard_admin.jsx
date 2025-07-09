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

  const openModule = (programId, courseId) => {
    navigate(`/courses/${programId}/${courseId}`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };
  const openFinalQuiz = (programId) => {
    navigate(`/courses/${programId}/final_quiz`, {
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
                <div id="course_list">
                  {[...Array(2)].map((_, cIndex) => (
                    <div
                      key={cIndex}
                      id="course_card"
                      style={{ cursor: "default" }}
                    >
                      <div id="course_img">
                        <Skeleton height={80} width={120} />
                      </div>
                      <div id="course_info">
                        <h4>
                          <Skeleton width={150} />
                        </h4>
                        <span>
                          <Skeleton width={100} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div id="course_list" style={{ marginTop: 20 }}>
              <div id="course_card" style={{ cursor: "default", opacity: 0.6 }}>
                <div id="course_img">
                  <Skeleton height={80} width={120} />
                </div>
                <div id="course_info">
                  <h4>
                    <Skeleton width={120} />
                  </h4>
                  <span>
                    <Skeleton width={80} />
                  </span>
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
            {t("hi")}
            {user.name.split(" ")[0]}
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

            <div id="course_list">
              {program.courses.map((course, cIndex) => (
                <div
                  id="course_card"
                  className={`course_card_id_${cIndex}`}
                  key={cIndex}
                  onClick={() =>
                    openModule(program.program_id, course.course_id)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div id="course_img">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div id="course_info">
                    <h4>{course.title}</h4>
                  </div>
                </div>
              ))}
              <div
                id="course_card"
                className={`quiz_card_id_${pIndex}`}
                onClick={() => openFinalQuiz(program.program_id)}
                style={{ cursor: "pointer" }}
              >
                <div id="course_img">
                  <img src={program.final_quiz.image} alt="Final Course" />
                </div>
                <div id="course_info">
                  <h4 style={{ fontWeight: "600" }}>{t("take_final_quiz")}</h4>
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
