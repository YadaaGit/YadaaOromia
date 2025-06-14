import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dummyCourses from "@/hooks/get_course_data_test.js";
import "@/style/Dashboard_user.css";
import "@/style/general.css";

function Courses() {
  const navigate = useNavigate();
  const openModule = (courseId) => {
    navigate(`/courses/${courseId}`, {
      state: {
        background: { pathname: location.pathname, search: location.search },
      },
    });
  };

  const course_data = [...dummyCourses];

  const [user, setUser] = useState({
    name: "Abebe Kebede",
    xp: 134679,
    email: "Abebe@example.com",
    username: "Abebe_1",
    country: "Ethiopia",
    joined: "January 2023",
    Current_course: "January 2023",
    Current_module: "January 2023",
    Current_section: "January 2023",
    avatar: "avatar",
    role: "user",
  });

  return (
    <>
      <section id="welcome" className="mar_b_20">
        <div className="width_100p">
          <h1 className="mar_0 width_100p ">Hi, {user.name.split(" ")[0]}</h1>
          <h3 className="mar_0 width_100p ">
            Ready to learn something new today?
          </h3>
        </div>
      </section>
      <section id="courses">
        {course_data.map((course, index) => (
          <div key={index} style={{marginTop: 40}}>
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
                    openModule(module.module_id);
                    console.log(module.module_id);
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
