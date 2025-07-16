import React, { useState } from "react";
// import dummyPrograms from "@/hooks/get_course_data_test.js"; // replace later with actual DB data
import "@/style/Dashboard_user.css";
import "@/style/general.css";

const EditableDashboard = ({ initialData, handleCancel }) => {
  const [programs, setPrograms] = useState(initialData);
  const [message, setMessage] = useState("");

  const handleChange = (path, value) => {
    setPrograms((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let obj = updated;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleSave = () => {
    setMessage("✅ Changes saved locally. (Backend not connected yet)");
    console.log("SAVE DATA:", programs);
  };

  const handleClose = () => {
    handleCancel(false);
  };

  return (
    <div>
      <h1 style={{ fontWeight: "bold", fontSize: 28 }}>Admin: Edit Courses</h1>

      {programs.map((program, pIndex) => (
        <div
          key={pIndex}
          style={{
            marginTop: 30,
            padding: 13,
            background: "#f9fafb",
            borderRadius: 12,
            marginBottom: 70,
          }}
        >
          <label>Program Title:</label>
          <input
            type="text"
            value={program.title}
            onChange={(e) => handleChange([pIndex, "title"], e.target.value)}
            className="input"
            style={{ border: "2px solid #a0a0a5" }}
          />

          {program.courses.map((course, cIndex) => (
            <div
              key={cIndex}
              style={{
                marginTop: 20,
                background: "#fff",
                padding: 15,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            >
              <label>Course Title:</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) =>
                  handleChange(
                    [pIndex, "courses", cIndex, "title"],
                    e.target.value
                  )
                }
                className="input"
                style={{ border: "2px solid #a0a0a5" }}
              />

              <label>Description:</label>
              <textarea
                value={course.description}
                onChange={(e) =>
                  handleChange(
                    [pIndex, "courses", cIndex, "description"],
                    e.target.value
                  )
                }
                className="textarea"
                style={{
                  width: "100%",
                  margin: "8px 0px",
                  border: "2px solid #a0a0a5",
                  padding: 5,
                  height: 60,
                  borderRadius: 7,
                }}
              />

              {course.modules.map((mod, mIndex) => (
                <div
                  key={mIndex}
                  style={{
                    marginTop: 10,
                    background: "#eef",
                    padding: 10,
                    borderRadius: 6,
                  }}
                >
                  <label>Module Title:</label>
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) =>
                      handleChange(
                        [pIndex, "courses", cIndex, "modules", mIndex, "title"],
                        e.target.value
                      )
                    }
                    className="input"
                    style={{ border: "2px solid #a0a0a5" }}
                  />

                  {mod.content.map((content, ctIndex) => (
                    <div key={ctIndex} style={{ marginTop: 8 }}>
                      <label>Content Header:</label>
                      <input
                        type="text"
                        value={content.header}
                        onChange={(e) =>
                          handleChange(
                            [
                              pIndex,
                              "courses",
                              cIndex,
                              "modules",
                              mIndex,
                              "content",
                              ctIndex,
                              "header",
                            ],
                            e.target.value
                          )
                        }
                        className="input"
                        style={{ border: "2px solid #a0a0a5" }}
                      />
                      <label>Content Text:</label>
                      <textarea
                        value={content.text}
                        onChange={(e) =>
                          handleChange(
                            [
                              pIndex,
                              "courses",
                              cIndex,
                              "modules",
                              mIndex,
                              "content",
                              ctIndex,
                              "text",
                            ],
                            e.target.value
                          )
                        }
                        className="textarea"
                        style={{
                          width: "100%",
                          margin: "8px 0px",
                          border: "2px solid #a0a0a5",
                          padding: 5,
                          height: 140,
                          borderRadius: 7,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Final Quiz Editor */}
          <div
            style={{
              marginTop: 20,
              padding: 15,
              background: "#fefce8",
              border: "1px solid #facc15",
              borderRadius: 8,
            }}
          >
            <h3>Final Quiz</h3>
            <label>Quiz Title:</label>
            <input
              type="text"
              value={program.final_quiz.quiz_title}
              onChange={(e) =>
                handleChange(
                  [pIndex, "final_quiz", "quiz_title"],
                  e.target.value
                )
              }
              className="input"
              style={{ border: "2px solid #a0a0a5" }}
            />

            <label>Description:</label>
            <textarea
              value={program.final_quiz.quiz_description}
              onChange={(e) =>
                handleChange(
                  [pIndex, "final_quiz", "quiz_description"],
                  e.target.value
                )
              }
              className="textarea"
              style={{
                width: "100%",
                margin: "8px 0px",
                border: "2px solid #a0a0a5",
                padding: 5,
                height: 60,
                borderRadius: 7,
              }}
            />

            {program.final_quiz.quiz.map((q, qIndex) => (
              <div
                key={qIndex}
                style={{
                  marginTop: 10,
                  background: "#f1f5f9",
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <label>Question:</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleChange(
                      [pIndex, "final_quiz", "quiz", qIndex, "question"],
                      e.target.value
                    )
                  }
                  className="input"
                  style={{ border: "2px solid #a0a0a5" }}
                />

                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      handleChange(
                        [
                          pIndex,
                          "final_quiz",
                          "quiz",
                          qIndex,
                          "options",
                          oIndex,
                        ],
                        e.target.value
                      )
                    }
                    className="input"
                    style={{ border: "2px solid #a0a0a5", marginTop: 4 }}
                    placeholder={`Option ${oIndex + 1}`}
                  />
                ))}

                <label>Answer Index (0–3):</label>
                <input
                  type="number"
                  value={q.answer}
                  min={0}
                  max={3}
                  onChange={(e) =>
                    handleChange(
                      [pIndex, "final_quiz", "quiz", qIndex, "answer"],
                      Number(e.target.value)
                    )
                  }
                  className="input"
                  style={{ border: "2px solid #a0a0a5" }}
                />

                <label>Explanation:</label>
                <textarea
                  value={q.explanation}
                  onChange={(e) =>
                    handleChange(
                      [pIndex, "final_quiz", "quiz", qIndex, "explanation"],
                      e.target.value
                    )
                  }
                  className="textarea"
                  style={{
                    width: "100%",
                    margin: "8px 0px",
                    border: "2px solid #a0a0a5",
                    padding: 5,
                    height: 60,
                    borderRadius: 7,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          width: "100%",
          height: "auto",
          position: "fixed",
          bottom: 65,
          left: 0,
          right: 0,
          padding: 20,
          background: "#f3f4f6",
        }}
      >
        <button onClick={handleSave} className="btn-primary">
          Save Changes
        </button>
        <button
          onClick={handleClose}
          className="btn-secondary"
          style={{ marginLeft: 13 }}
        >
          close
        </button>
      </div>

      {message && <p style={{ marginTop: 10, color: "green" }}>{message}</p>}
    </div>
  );
};

export default EditableDashboard;
