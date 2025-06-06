import { useState } from "react";
import "@/style/Dashboard_user.css";
import "@/style/general.css";

function Profile() {
  const user = {
    name: "Abebe Kebede",
    age: "23",
    currentCourse: "1",
    currentModule: "1",
    currentSection: "3",
  };

  return (
    <>
      <section id="welcome" className="mar_b_20">
        <div className="width_100p">
          <h1 className="mar_0 width_100p ">profile, {user.name.split(" ")[0]}</h1>
          <h3 className="mar_0 width_100p ">
            your profile
          </h3>
        </div>
      </section>
    </>
  );
}

export default Profile;
