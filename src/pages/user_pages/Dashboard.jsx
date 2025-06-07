import { useState } from "react";
import ill1 from "@/assets/images/illstration_2.jpg";
import ill2 from "@/assets/images/illstration_1.jpg";
import "@/style/Dashboard_user.css";
import "@/style/general.css";

function Courses() {

  const courses = [
    {
      course_id: 0,
      title: "Biology & The Scientific Method",
      lessons: "3 lessons",
      image: ill1,
      modules: [
        { title: "Biology_001", module_id: "1" },
        { title: "Biology_002", module_id: "2" },
        { title: "Biology_003", module_id: "3" },
      ],
    },
    {
      course_id: 1,
      title: "Earth & Climate",
      lessons: "3 lessons",
      image: ill2,
      modules: [
        { title: "Earth_001", module_id: "1" },
        { title: "Earth_002", module_id: "2" },
        { title: "Earth_003", module_id: "3" },
      ],
    },
    {
      course_id: 2,
      title: "Biology & The Scientific Method",
      lessons: "3 lessons",
      image: ill1,
      modules: [
        { title: "Biology_001", module_id: "1" },
        { title: "Biology_002", module_id: "2" },
        { title: "Biology_003", module_id: "3" },
      ],
    },
    {
      course_id: 3,
      title: "Biology & The Scientific Method",
      lessons: "3 lessons",
      image: ill2,
      modules: [
        { title: "Biology_001", module_id: "1" },
        { title: "Biology_002", module_id: "2" },
        { title: "Biology_003", module_id: "3" },
      ],
    },
  ];

   const [user, setUser] = useState({
    name: 'Abebe Kebede',
    xp: 134679,
    email: 'Abebe@example.com',
    username: 'Abebe_1',
    country: 'Ethiopia',
    joined: 'January 2023',
    Current_course: 'January 2023',
    Current_module: 'January 2023',
    Current_section: 'January 2023',
    avatar: avatar,
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
        <h2>Courses</h2>
        <div id="course_list">
          {courses.map((course, index) => (
            <div
              id="course_card"
              className={`course_card_id_${index}`}
              key={course.course_id}
            >
              <div id="course_img">
                <img src={course.image} />
              </div>
              <div id="course_info">
                <h3>{course.title}</h3>
                <span>{course.lessons}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </>
  );
}

export default Courses;
