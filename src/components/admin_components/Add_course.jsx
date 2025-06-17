import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PopUp from "../basic_ui/pop_up.jsx";

export default function AdminCourseDashboard() {
  const navigate = useNavigate();

  const [showCongrats, setShowCongrats] = useState(false);

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    course_id: "",
    title: "",
    description: "",
    image: "",
    no_of_lessons: 1,
    modules: [],
  });

  const updateCourse = (path, value) => {
    const newState = { ...newCourse };
    let ref = newState;
    for (let i = 0; i < path.length - 1; i++) {
      ref = ref[path[i]];
    }
    ref[path[path.length - 1]] = value;
    setNewCourse(newState);
  };

  const handleAddModule = () => {
    setNewCourse((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: "",
          module_id: uuid(),
          sections: [],
          final_quiz: {
            title: "",
            description: "",
            questions: [],
          },
          metadata: {
            estimated_time: "",
            level: "",
            author: "",
            release_date: "",
          },
        },
      ],
    }));
  };

  const handleAddSection = (moduleIdx) => {
    const modules = [...newCourse.modules];
    modules[moduleIdx].sections.push({
      id: uuid(),
      title: "",
      content: [],
      quiz: [],
    });
    setNewCourse({ ...newCourse, modules });
  };

  const handleAddContentBlock = (moduleIdx, sectionIdx) => {
    const modules = [...newCourse.modules];
    modules[moduleIdx].sections[sectionIdx].content.push({
      media: "",
      header: "",
      text: "",
    });
    setNewCourse({ ...newCourse, modules });
  };

  const handleAddQuiz = (moduleIdx, sectionIdx) => {
    const modules = [...newCourse.modules];
    modules[moduleIdx].sections[sectionIdx].quiz.push({
      question: "",
      options: ["", "", "", ""],
      answer: 0,
      explanation: "",
    });
    setNewCourse({ ...newCourse, modules });
  };

  const handleSaveCourse = () => {
    setCourses((prev) => [...prev, newCourse]);
    console.log("Course Added", newCourse);
    setShowCongrats(true)
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <input
        className="input mb-2"
        placeholder="Course ID"
        value={newCourse.course_id}
        onChange={(e) => updateCourse(["course_id"], e.target.value)}
      />
      <input
        className="input mb-2"
        placeholder="Title"
        value={newCourse.title}
        onChange={(e) => updateCourse(["title"], e.target.value)}
      />
      <textarea
        className="input mb-2"
        placeholder="Description"
        value={newCourse.description}
        onChange={(e) => updateCourse(["description"], e.target.value)}
      />
      <input
        className="input mb-4"
        placeholder="Image URL"
        value={newCourse.image}
        onChange={(e) => updateCourse(["image"], e.target.value)}
      />

      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">📦 Modules</h3>
        {newCourse.modules.map((mod, modIdx) => (
          <div key={mod.module_id} className="bg-gray-100 p-3 mb-3 rounded">
            <input
              className="input mb-2"
              placeholder="Module Title"
              value={mod.title}
              onChange={(e) =>
                updateCourse(["modules", modIdx, "title"], e.target.value)
              }
            />

            <h4 className="text-md font-semibold mt-2">📊 Metadata</h4>
            {Object.keys(mod.metadata).map((key) => (
              <input
                key={key}
                className="input mb-1"
                placeholder={key.replace("_", " ").toUpperCase()}
                value={mod.metadata[key]}
                onChange={(e) =>
                  updateCourse(
                    ["modules", modIdx, "metadata", key],
                    e.target.value
                  )
                }
              />
            ))}

            <h4 className="text-md font-semibold mt-2">📝 Final Quiz</h4>
            <input
              className="input mb-1"
              placeholder="Final Quiz Title"
              value={mod.final_quiz.title}
              onChange={(e) =>
                updateCourse(
                  ["modules", modIdx, "final_quiz", "title"],
                  e.target.value
                )
              }
            />
            <textarea
              className="input mb-2"
              placeholder="Final Quiz Description"
              value={mod.final_quiz.description}
              onChange={(e) =>
                updateCourse(
                  ["modules", modIdx, "final_quiz", "description"],
                  e.target.value
                )
              }
            />

            <button
              className="btn-sm mb-2"
              onClick={() => handleAddSection(modIdx)}
            >
              ➕ Add Section
            </button>

            {mod.sections.map((sec, secIdx) => (
              <div key={sec.id} className="bg-white p-2 border rounded mb-2">
                <input
                  className="input mb-1"
                  placeholder="Section Title"
                  value={sec.title}
                  onChange={(e) =>
                    updateCourse(
                      ["modules", modIdx, "sections", secIdx, "title"],
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn-sm mb-2"
                  onClick={() => handleAddContentBlock(modIdx, secIdx)}
                >
                  ➕ Add Content Block
                </button>

                {sec.content.map((block, blockIdx) => (
                  <div key={blockIdx} className="ml-4 mb-2">
                    <input
                      className="input mb-1"
                      placeholder="Media URL"
                      value={block.media}
                      onChange={(e) =>
                        updateCourse(
                          [
                            "modules",
                            modIdx,
                            "sections",
                            secIdx,
                            "content",
                            blockIdx,
                            "media",
                          ],
                          e.target.value
                        )
                      }
                    />
                    <input
                      className="input mb-1"
                      placeholder="Header (optional)"
                      value={block.header || ""}
                      onChange={(e) =>
                        updateCourse(
                          [
                            "modules",
                            modIdx,
                            "sections",
                            secIdx,
                            "content",
                            blockIdx,
                            "header",
                          ],
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      className="input"
                      placeholder="Text"
                      value={block.text}
                      onChange={(e) =>
                        updateCourse(
                          [
                            "modules",
                            modIdx,
                            "sections",
                            secIdx,
                            "content",
                            blockIdx,
                            "text",
                          ],
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}

                <button
                  className="btn-sm mt-1"
                  onClick={() => handleAddQuiz(modIdx, secIdx)}
                >
                  ➕ Add Quiz
                </button>

                {sec.quiz.map((quiz, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-2 mt-2 bg-gray-50 border rounded"
                  >
                    <input
                      className="input mb-1"
                      placeholder="Question"
                      value={quiz.question}
                      onChange={(e) =>
                        updateCourse(
                          [
                            "modules",
                            modIdx,
                            "sections",
                            secIdx,
                            "quiz",
                            qIdx,
                            "question",
                          ],
                          e.target.value
                        )
                      }
                    />
                    {quiz.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        className="input mb-1 ml-2"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const modules = [...newCourse.modules];
                          modules[modIdx].sections[secIdx].quiz[qIdx].options[
                            optIdx
                          ] = e.target.value;
                          setNewCourse({ ...newCourse, modules });
                        }}
                      />
                    ))}
                    <input
                      className="input mb-1"
                      placeholder="Correct Answer Index (0-3)"
                      type="number"
                      value={quiz.answer}
                      onChange={(e) =>
                        updateCourse(
                          [
                            "modules",
                            modIdx,
                            "sections",
                            secIdx,
                            "quiz",
                            qIdx,
                            "answer",
                          ],
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <textarea
                      className="input"
                      placeholder="Explanation"
                      value={quiz.explanation}
                      onChange={(e) =>
                        updateCourse(
                          [
                            "modules",
                            modIdx,
                            "sections",
                            secIdx,
                            "quiz",
                            qIdx,
                            "explanation",
                          ],
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <button className="btn mt-2" onClick={handleAddModule}>
          ➕ Add Module
        </button>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSaveCourse}>
        💾 Save Course
      </button>
      <PopUp
        show={showCongrats}
        onClose={() => {
          setShowCongrats(false);
          navigate("/courses_admin");
        }}
        message="Course saved succesfully"
        type="success"
      />
    </div>
  );
}
