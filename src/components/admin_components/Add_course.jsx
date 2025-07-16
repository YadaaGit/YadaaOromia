import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import PopUp from "../basic_ui/pop_up.jsx";

// AddProgramPage: lets admin add a program with multiple courses
export default function AddProgramPage() {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  const [showCongrats, setShowCongrats] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [programTitle, setProgramTitle] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [programFinalQuiz, setProgramFinalQuiz] = useState({
    quiz_title: "",
    quiz_description: "",
    quiz: [],
    metadata: { difficulty: "", pass_grade_percentage: "" },
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [moduleImagePreviews, setModuleImagePreviews] = useState({});

  // Difficulty options
  const difficultyOptions = [
    { value: "", label: "Select Difficulty" },
    { value: "easy", label: "Easy" },
    { value: "midium", label: "Midium" },
    { value: "hard", label: "Hard" },
  ];

  // Image uploader with language-specific endpoint
  const uploadImage = async (file, purpose) => {
    if (!file) return null;
    const form = new FormData();
    form.append("image", file);
    form.append("for", purpose);
    const langPrefix = `${language}_courses`;
    const res = await axios.post(`${api}/api/${langPrefix}/images`, form);
    return res.data.image_id;
  };

  // Add a new empty course to the program
  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        course_id: uuid(),
        title: "",
        description: "",
        image: null,
        modules: [],
        metadata: {
          difficulty: "",
          estimated_time: "",
          author: "",
          release_date: "",
        },
        final_quiz: {
          quiz_title: "",
          quiz_description: "",
          isFinal: true,
          quiz: [],
          metadata: {
            difficulty: "",
            pass_grade_percentage: "",
          },
        },
      },
    ]);
  };

  // Update a course field
  const updateCourse = (courseIdx, path, value) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      let ref = newCourses[courseIdx];
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return newCourses;
    });
  };

  // Add module to a course
  const handleAddModule = (courseIdx) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses[courseIdx].modules.push({
        module_id: uuid(),
        title: "",
        content: [],
        quiz: [],
        metadata: {
          estimated_time: "",
          level: "",
          release_date: "",
        },
      });
      return newCourses;
    });
  };

  // Add content block to a module
  const handleAddContentBlock = (courseIdx, modIdx) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses[courseIdx].modules[modIdx].content.push({ header: "", text: "", media: "" });
      return newCourses;
    });
  };

  // Add quiz question to a module
  const handleAddModuleQuestion = (courseIdx, modIdx) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses[courseIdx].modules[modIdx].quiz.push({
        question: "",
        options: ["", "", "", ""],
        answer: 0,
        explanation: "",
      });
      return newCourses;
    });
  };

  // Add question to final quiz
  const handleAddFinalQuizQuestion = (courseIdx) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses[courseIdx].final_quiz.quiz.push({
        question: "",
        options: ["", "", "", ""],
        answer: 0,
        explanation: "",
      });
      return newCourses;
    });
  };

  // Remove item from array
  const handleRemove = (courseIdx, path) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      let ref = newCourses[courseIdx];
      for (let i = 0; i < path.length - 2; i++) ref = ref[path[i]];
      ref[path[path.length - 2]].splice(path[path.length - 1], 1);
      return newCourses;
    });
  };

  // Remove a course
  const handleRemoveCourse = (courseIdx) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses.splice(courseIdx, 1);
      return newCourses;
    });
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[courseIdx];
      return newPreviews;
    });
  };

  // Image input handler for course
  const handleCourseImageChange = (courseIdx, file) => {
    updateCourse(courseIdx, ["image"], file);
    setImagePreviews((prev) => ({
      ...prev,
      [courseIdx]: file ? URL.createObjectURL(file) : null,
    }));
  };

  // Image input handler for module
  const handleModuleImageChange = (courseIdx, modIdx, file) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses[courseIdx].modules[modIdx].image = file;
      return newCourses;
    });
    setModuleImagePreviews((prev) => ({
      ...prev,
      [`${courseIdx}_${modIdx}`]: file ? URL.createObjectURL(file) : null,
    }));
  };

  // Image input handler for content block
  const handleContentImageChange = (courseIdx, modIdx, cIdx, file) => {
    setCourses((prev) => {
      const newCourses = structuredClone(prev);
      newCourses[courseIdx].modules[modIdx].content[cIdx].media = file;
      return newCourses;
    });
    setModuleImagePreviews((prev) => ({
      ...prev,
      [`${courseIdx}_${modIdx}_${cIdx}`]: file ? URL.createObjectURL(file) : null,
    }));
  };

  // Helper to format today's date as "Jan 01, 2025"
  function getTodayFormatted() {
    const today = new Date();
    const month = today.toLocaleString("en-US", { month: "short" });
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  // --- Full save logic conforming to DB schemas ---
  const handleSave = async () => {
    try {
      const langPrefix = `${language}_courses`;
      const program_id = uuid();

      const courses_ids = {};

      // Save each course (with nested modules)
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const course_id = course.course_id || uuid();
        const courseImageId = await uploadImage(course.image, "course");

        const module_ids = {};
        for (let j = 0; j < course.modules.length; j++) {
          const mod = course.modules[j];
          const module_id = mod.module_id || uuid();

          // Upload module image if exists
          if (mod.image) {
            mod.image = await uploadImage(mod.image, "module");
          }

          // Filter content blocks: skip if all fields are empty
          const filteredContent = (mod.content || []).filter(
            (c) => c.header !== "" || c.text !== "" || c.media !== ""
          );

          // Save module
          await axios.post(`${api}/api/${langPrefix}/modules`, {
            module_id,
            title: mod.title,
            module_index: j,
            content: filteredContent,
            quiz: mod.quiz,
            metadata: {
              ...mod.metadata,
              release_date: getTodayFormatted(), // Always save today's date
            },
          });

          module_ids[module_id] = module_id;
        }

        // Save course
        await axios.post(`${api}/api/${langPrefix}/courses`, {
          course_id,
          title: course.title,
          description: course.description,
          course_index: i,
          module_ids,
          metadata: {
            ...course.metadata,
            no_of_modules: course.modules.length,
            no_of_lessons: course.modules.reduce(
              (sum, m) => sum + (m.content?.length || 0),
              0
            ),
            release_date: getTodayFormatted(), // Always save today's date
          },
        });

        courses_ids[course_id] = course_id;
      }

      // Save final quiz
      const final_quiz_id = uuid();
      await axios.post(`${api}/api/${langPrefix}/final_quiz`, {
        quiz_id: final_quiz_id,
        quiz_title: programFinalQuiz.quiz_title,
        quiz_description: programFinalQuiz.quiz_description,
        is_final: true,
        title: programTitle,
        questions: programFinalQuiz.quiz,
        metadata: {
          ...programFinalQuiz.metadata,
          question_num: programFinalQuiz.quiz.length,
          release_date: getTodayFormatted(), // Always save today's date
        },
      });

      // Save program
      await axios.post(`${api}/api/${language}_programs/programs`, {
        program_id,
        title: programTitle,
        description: programDescription,
        final_quiz_id,
        program_index: 0,
        courses_ids,
        metadata: {
          course_num: courses.length,
          difficulty: "",
          final_pass_point: programFinalQuiz.metadata?.pass_grade_percentage || 0,
          estimated_time: "",
          author: "",
          release_date: getTodayFormatted(), // Always save today's date
        },
      });

      setShowCongrats(true);
    } catch (err) {
      console.error("Error saving program:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-logo-800">Add New Program</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-3 py-2 text-logo-800 font-semibold w-full sm:w-auto"
        >
          <option value="EN">English</option>
          <option value="AM">Amharic</option>
          <option value="OR">Affan Oromo</option>
        </select>
        <input
          className="input border rounded px-3 py-2 w-full sm:w-auto"
          placeholder="Program Title"
          value={programTitle}
          onChange={(e) => setProgramTitle(e.target.value)}
        />
        <textarea
          className="input border rounded px-3 py-2 w-full sm:w-auto"
          placeholder="Program Description"
          value={programDescription}
          onChange={(e) => setProgramDescription(e.target.value)}
        />
      </div>

      <button
        className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-indigo-600 transition mb-6 w-full sm:w-auto"
        onClick={handleAddCourse}
      >
        ➕ Add Course
      </button>
      {courses.map((course, courseIdx) => (
        <div key={course.course_id} className="border p-4 mb-6 rounded-xl bg-white shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h3 className="font-semibold text-lg text-logo-800">Course {courseIdx + 1}</h3>
            <button
              className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold shadow hover:bg-red-200 transition w-full sm:w-auto"
              onClick={() => handleRemoveCourse(courseIdx)}
            >
              🗑 remove
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <input
              className="input border rounded px-3 py-2 w-full sm:w-auto"
              placeholder="Course Title"
              value={course.title}
              onChange={(e) => updateCourse(courseIdx, ["title"], e.target.value)}
            />
            <textarea
              className="input border rounded px-3 py-2 w-full sm:w-auto"
              placeholder="Course Description"
              value={course.description}
              onChange={(e) => updateCourse(courseIdx, ["description"], e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold mb-1">Course Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <button
                className="bg-indigo-100 text-logo-600 px-3 py-1 rounded shadow hover:bg-indigo-200 transition w-full sm:w-auto"
                onClick={() => document.getElementById(`course-img-${courseIdx}`).click()}
                type="button"
              >
                Choose File
              </button>
              <input
                id={`course-img-${courseIdx}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleCourseImageChange(courseIdx, e.target.files[0])}
              />
              {imagePreviews[courseIdx] && (
                <img
                  src={imagePreviews[courseIdx]}
                  alt="Course preview"
                  className="mt-2 mb-2 max-h-32 rounded shadow"
                  style={{ maxWidth: "100%" }}
                />
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <select
              className="input border rounded px-3 py-2"
              value={course.metadata.difficulty}
              onChange={(e) => updateCourse(courseIdx, ["metadata", "difficulty"], e.target.value)}
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              className="input border rounded px-3 py-2"
              type="number"
              placeholder="Estimated Time"
              value={course.metadata.estimated_time}
              onChange={(e) => updateCourse(courseIdx, ["metadata", "estimated_time"], e.target.value)}
            />
            <input
              className="input border rounded px-3 py-2"
              placeholder="Author"
              value={course.metadata.author}
              onChange={(e) => updateCourse(courseIdx, ["metadata", "author"], e.target.value)}
            />
          </div>

          {/* Final Quiz */}
          <div className="mb-2">
            <h4 className="font-semibold mt-2 text-logo-800">🏁 Final Quiz</h4>
            <input
              className="input border rounded px-3 py-2 mb-1 w-full"
              placeholder="Final Quiz Title"
              value={course.final_quiz.quiz_title}
              onChange={(e) => updateCourse(courseIdx, ["final_quiz", "quiz_title"], e.target.value)}
            />
            <textarea
              className="input border rounded px-3 py-2 mb-1 w-full"
              placeholder="Final Quiz Description"
              value={course.final_quiz.quiz_description}
              onChange={(e) => updateCourse(courseIdx, ["final_quiz", "quiz_description"], e.target.value)}
            />

            {/* Final Quiz Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <select
                className="input border rounded px-3 py-2"
                value={course.final_quiz.metadata?.difficulty ?? ""}
                onChange={(e) =>
                  updateCourse(courseIdx, ["final_quiz", "metadata", "difficulty"], e.target.value)
                }
              >
                {difficultyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                className="input border rounded px-3 py-2"
                type="number"
                placeholder="Pass Grade (%)"
                value={course.final_quiz.metadata?.pass_grade_percentage ?? ""}
                onChange={(e) =>
                  updateCourse(courseIdx, ["final_quiz", "metadata", "pass_grade_percentage"], parseInt(e.target.value) || 0)
                }
              />
            </div>

            <button
              className="bg-indigo-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-indigo-600 transition mb-2 w-full sm:w-auto"
              onClick={() => handleAddFinalQuizQuestion(courseIdx)}
            >
              ➕ Add Final Quiz Question
            </button>
            {(course.final_quiz.quiz || []).map((q, idx) => (
              <div key={idx} className="ml-2 mb-1 border rounded p-2 bg-gray-50">
                <input
                  className="input border rounded px-3 py-2 mb-1 w-full"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => {
                    const quiz = [...course.final_quiz.quiz];
                    quiz[idx].question = e.target.value;
                    updateCourse(courseIdx, ["final_quiz", "quiz"], quiz);
                  }}
                />
                {q.options.map((opt, optIdx) => (
                  <input
                    key={optIdx}
                    className="input border rounded px-3 py-2 mb-1 ml-2 w-full"
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const quiz = [...course.final_quiz.quiz];
                      quiz[idx].options[optIdx] = e.target.value;
                      updateCourse(courseIdx, ["final_quiz", "quiz"], quiz);
                    }}
                    type="text"
                  />
                ))}
                <select
                  className="input border rounded px-3 py-2 mb-1 w-full"
                  value={q.answer}
                  onChange={(e) => {
                    const quiz = [...course.final_quiz.quiz];
                    quiz[idx].answer = parseInt(e.target.value);
                    updateCourse(courseIdx, ["final_quiz", "quiz"], quiz);
                  }}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
                <textarea
                  className="input border rounded px-3 py-2 mb-1 w-full"
                  placeholder="Explanation"
                  value={q.explanation}
                  onChange={(e) => {
                    const quiz = [...course.final_quiz.quiz];
                    quiz[idx].explanation = e.target.value;
                    updateCourse(courseIdx, ["final_quiz", "quiz"], quiz);
                  }}
                />
                <button
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold shadow hover:bg-red-200 transition w-full sm:w-auto"
                  onClick={() => {
                    const quiz = [...course.final_quiz.quiz];
                    quiz.splice(idx, 1);
                    updateCourse(courseIdx, ["final_quiz", "quiz"], quiz);
                  }}
                >
                  🗑 remove
                </button>
              </div>
            ))}
          </div>

          {/* Modules */}
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-indigo-600 transition mb-2 w-full sm:w-auto"
            onClick={() => handleAddModule(courseIdx)}
          >
            ➕ Add Module
          </button>
          {(course.modules || []).map((mod, modIdx) => (
            <div key={mod.module_id} className="border p-2 mb-2 rounded bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  className="input border rounded px-3 py-2 w-full"
                  placeholder="Module Title"
                  value={mod.title}
                  onChange={(e) => updateCourse(courseIdx, ["modules", modIdx, "title"], e.target.value)}
                />
              </div>
              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-indigo-600 transition mb-1 w-full sm:w-auto"
                onClick={() => handleAddContentBlock(courseIdx, modIdx)}
              >
                ➕ Add Content
              </button>
              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-indigo-600 transition mb-1 w-full sm:w-auto"
                onClick={() => handleAddModuleQuestion(courseIdx, modIdx)}
              >
                ➕ Add Quiz Question
              </button>
              <button
                className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold shadow hover:bg-red-200 transition mb-1 w-full sm:w-auto"
                onClick={() => handleRemove(courseIdx, ["modules", modIdx])}
              >
                🗑 remove
              </button>

              {/* Module Content */}
              {(mod.content || []).map((c, cIdx) => (
                <div key={cIdx} className="ml-2 mb-1">
                  <input
                    className="input border rounded px-3 py-2 mb-1 w-full"
                    placeholder="Header"
                    value={c.header}
                    onChange={(e) =>
                      updateCourse(courseIdx, ["modules", modIdx, "content", cIdx, "header"], e.target.value)
                    }
                  />
                  <textarea
                    className="input border rounded px-3 py-2 mb-1 w-full"
                    placeholder="Text"
                    value={c.text}
                    onChange={(e) =>
                      updateCourse(courseIdx, ["modules", modIdx, "content", cIdx, "text"], e.target.value)
                    }
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-1">
                    <button
                      className="bg-indigo-100 text-logo-600 px-3 py-1 rounded shadow hover:bg-indigo-200 transition w-full sm:w-auto"
                      onClick={() =>
                        document.getElementById(`content-img-${courseIdx}-${modIdx}-${cIdx}`).click()
                      }
                      type="button"
                    >
                      Choose File
                    </button>
                    <input
                      id={`content-img-${courseIdx}-${modIdx}-${cIdx}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleContentImageChange(courseIdx, modIdx, cIdx, e.target.files[0])}
                    />
                    {moduleImagePreviews[`${courseIdx}_${modIdx}_${cIdx}`] && (
                      <img
                        src={moduleImagePreviews[`${courseIdx}_${modIdx}_${cIdx}`]}
                        alt="Content preview"
                        className="max-h-16 rounded shadow"
                        style={{ maxWidth: "100%" }}
                      />
                    )}
                  </div>
                  <button
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold shadow hover:bg-red-200 transition w-full sm:w-auto"
                    onClick={() => handleRemove(courseIdx, ["modules", modIdx, "content", cIdx])}
                  >
                    🗑 remove
                  </button>
                </div>
              ))}

              {/* Module Quiz */}
              {(mod.quiz || []).map((q, qIdx) => (
                <div key={qIdx} className="ml-2 mb-1 border rounded p-2 bg-white">
                  <input
                    className="input border rounded px-3 py-2 mb-1 w-full"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => {
                      const quiz = [...mod.quiz];
                      quiz[qIdx].question = e.target.value;
                      const modules = [...courses[courseIdx].modules];
                      modules[modIdx].quiz = quiz;
                      updateCourse(courseIdx, ["modules"], modules);
                    }}
                  />
                  {q.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      className="input border rounded px-3 py-2 mb-1 ml-2 w-full"
                      placeholder={`Option ${oIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const quiz = [...mod.quiz];
                        quiz[qIdx].options[oIdx] = e.target.value;
                        const modules = [...courses[courseIdx].modules];
                        modules[modIdx].quiz = quiz;
                        updateCourse(courseIdx, ["modules"], modules);
                      }}
                      type="text"
                    />
                  ))}
                  <select
                    className="input border rounded px-3 py-2 mb-1 w-full"
                    value={q.answer}
                    onChange={(e) => {
                      const quiz = [...mod.quiz];
                      quiz[qIdx].answer = parseInt(e.target.value);
                      const modules = [...courses[courseIdx].modules];
                      modules[modIdx].quiz = quiz;
                      updateCourse(courseIdx, ["modules"], modules);
                    }}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                  <textarea
                    className="input border rounded px-3 py-2 mb-1 w-full"
                    placeholder="Explanation"
                    value={q.explanation}
                    onChange={(e) => {
                      const quiz = [...mod.quiz];
                      quiz[qIdx].explanation = e.target.value;
                      const modules = [...courses[courseIdx].modules];
                      modules[modIdx].quiz = quiz;
                      updateCourse(courseIdx, ["modules"], modules);
                    }}
                  />
                  <button
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold shadow hover:bg-red-200 transition w-full sm:w-auto"
                    onClick={() => {
                      const quiz = [...mod.quiz];
                      quiz.splice(qIdx, 1);
                      const modules = [...courses[courseIdx].modules];
                      modules[modIdx].quiz = quiz;
                      updateCourse(courseIdx, ["modules"], modules);
                    }}
                  >
                    🗑 remove
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button
        className="bg-green-500 text-logo-800 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-600 transition mt-6 w-full sm:w-auto"
        onClick={handleSave}
      >
        💾 Save Program
      </button>

      <PopUp
        show={showCongrats}
        onClose={() => {
          setShowCongrats(false);
          navigate("/programs_admin");
        }}
        message="Program saved successfully"
        type="success"
      />
    </div>
  );
}
