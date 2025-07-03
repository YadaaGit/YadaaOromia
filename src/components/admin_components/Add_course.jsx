import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import PopUp from "../basic_ui/pop_up.jsx";

export default function AddCoursePage() {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;
  const [showCongrats, setShowCongrats] = useState(false);
  const [language, setLanguage] = useState("AM");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // all the data will be saved here as a nested object
  const [newCourse, setNewCourse] = useState({
    course_id: uuid(),
    title: "",
    description: "",
    final_quiz_id: "",
    course_index: 0,
    module_ids: [],
    metadata: {},
    modules: [],
    final_quiz: { quiz_id: uuid(), is_final: true, title: "", questions: [] },
  });

  // update nested state
  const updateCourse = (path, value) => {
    setNewCourse((prev) => {
      const newState = structuredClone(prev);
      let ref = newState;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return newState;
    });
  };

  // add module in course
  const handleAddModule = () => {
    setNewCourse((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          module_id: uuid(),
          title: "",
          imageFile: null,
          imagePreview: null,
          module_index: prev.modules.length,
          metadata: {},
          section_ids: [],
          sections: [],
        },
      ],
    }));
  };

  // add section in module
  const handleAddSection = (modIdx) => {
    setNewCourse((prev) => {
      const modules = structuredClone(prev.modules);
      modules[modIdx].sections.push({
        section_id: uuid(),
        quiz_id: "",
        title: "",
        imageFile: null,
        imagePreview: null,
        section_index: modules[modIdx].sections.length,
        contents: [],
        quiz: { quiz_id: uuid(), is_final: false, title: "", questions: [] },
      });
      return { ...prev, modules };
    });
  };

  // add content in section
  const handleAddContentBlock = (modIdx, secIdx) => {
    setNewCourse((prev) => {
      const modules = structuredClone(prev.modules);
      modules[modIdx].sections[secIdx].contents.push({ header: "", text: "" });
      return { ...prev, modules };
    });
  };

  // add question in section
  const handleAddQuestion = (modIdx, secIdx) => {
    setNewCourse((prev) => {
      const modules = structuredClone(prev.modules);
      modules[modIdx].sections[secIdx].quiz.questions.push({
        question: "",
        options: ["", "", "", ""],
        answer: 0,
        explanation: "",
      });
      return { ...prev, modules };
    });
  };

  // remove item from array
  const handleRemove = (path) => {
    setNewCourse((prev) => {
      const newState = structuredClone(prev);
      let ref = newState;
      for (let i = 0; i < path.length - 2; i++) ref = ref[path[i]];
      ref[path[path.length - 2]].splice(path[path.length - 1], 1);
      return newState;
    });
  };

  // upload image to backend
  const uploadImage = async (file, contextFor) => {
    if (!file) return null;
    const form = new FormData();
    form.append("image", file);
    form.append("for", contextFor);
    const res = await axios.post(`${api}/api/upload_image`, form);
    return res.data.image_id;
  };

  // handle save: uploads images & posts course/module/sections/quizzes
  const handleSave = async () => {
    try {
      const courseImageId = await uploadImage(imageFile, "course");
      const finalQuizRes = await axios.post(`${api}/api/quizzes`, newCourse.final_quiz);
      const finalQuizId = finalQuizRes.data.quiz_id;
      const moduleIds = [];

      for (const mod of newCourse.modules) {
        const moduleImageId = await uploadImage(mod.imageFile, "module");
        const sectionIds = [];

        for (const sec of mod.sections) {
          const sectionImageId = await uploadImage(sec.imageFile, "section");
          const quizRes = await axios.post(`${api}/api/quizzes`, sec.quiz);
          const quizId = quizRes.data.quiz_id;

          await axios.post(`${api}/api/sections`, {
            section_id: sec.section_id,
            quiz_id: quizId,
            title: sec.title,
            image: sectionImageId,
            section_index: sec.section_index,
            contents: sec.contents,
          });
          sectionIds.push(sec.section_id);
        }

        await axios.post(`${api}/api/modules`, {
          module_id: mod.module_id,
          title: mod.title,
          image: moduleImageId,
          module_index: mod.module_index,
          section_ids: sectionIds,
          metadata: mod.metadata,
        });
        moduleIds.push(mod.module_id);
      }

      await axios.post(
        `${api}/api/${language === "AM" ? "am_courses" : "or_courses"}/courses`,
        {
          course_id: newCourse.course_id,
          title: newCourse.title,
          description: newCourse.description,
          final_quiz_id: finalQuizId,
          course_index: newCourse.course_index,
          module_ids: moduleIds,
          metadata: newCourse.metadata,
          image: courseImageId,
        }
      );

      setShowCongrats(true);
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Add New Course</h2>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="AM">Amharic</option>
        <option value="OR">Oromifa</option>
      </select>
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

      <h3 className="font-semibold mt-4">🏁 Final Quiz</h3>
      <input
        className="input mb-2"
        placeholder="Final Quiz Title"
        value={newCourse.final_quiz.title}
        onChange={(e) => updateCourse(["final_quiz", "title"], e.target.value)}
      />
      <button
        className="btn-sm mb-2"
        onClick={() =>
          setNewCourse((prev) => ({
            ...prev,
            final_quiz: {
              ...prev.final_quiz,
              questions: [
                ...prev.final_quiz.questions,
                { question: "", options: ["", "", "", ""], answer: 0, explanation: "" },
              ],
            },
          }))
        }
      >
        ➕ Add Final Quiz Question
      </button>

      {(newCourse.final_quiz.questions || []).map((q, idx) => (
        <div key={idx} className="ml-2 mb-1">
          <input
            className="input mb-1"
            placeholder="Question"
            value={q.question}
            onChange={(e) => {
              const questions = [...newCourse.final_quiz.questions];
              questions[idx].question = e.target.value;
              setNewCourse({ ...newCourse, final_quiz: { ...newCourse.final_quiz, questions } });
            }}
          />
          {q.options.map((opt, optIdx) => (
            <input
              key={optIdx}
              className="input mb-1 ml-2"
              placeholder={`Option ${optIdx + 1}`}
              value={opt}
              onChange={(e) => {
                const questions = [...newCourse.final_quiz.questions];
                questions[idx].options[optIdx] = e.target.value;
                setNewCourse({ ...newCourse, final_quiz: { ...newCourse.final_quiz, questions } });
              }}
            />
          ))}
          <input
            type="number"
            className="input mb-1"
            placeholder="Correct Answer Index"
            value={q.answer}
            onChange={(e) => {
              const questions = [...newCourse.final_quiz.questions];
              questions[idx].answer = parseInt(e.target.value);
              setNewCourse({ ...newCourse, final_quiz: { ...newCourse.final_quiz, questions } });
            }}
          />
          <textarea
            className="input mb-1"
            placeholder="Explanation"
            value={q.explanation}
            onChange={(e) => {
              const questions = [...newCourse.final_quiz.questions];
              questions[idx].explanation = e.target.value;
              setNewCourse({ ...newCourse, final_quiz: { ...newCourse.final_quiz, questions } });
            }}
          />
          <button
            className="btn-xs"
            onClick={() => {
              const questions = [...newCourse.final_quiz.questions];
              questions.splice(idx, 1);
              setNewCourse({ ...newCourse, final_quiz: { ...newCourse.final_quiz, questions } });
            }}
          >
            🗑
          </button>
        </div>
      ))}

      <input
        type="file"
        accept="image/*"
        className="mb-2"
        onChange={(e) => {
          setImageFile(e.target.files[0]);
          setImagePreview(URL.createObjectURL(e.target.files[0]));
        }}
      />
      {imagePreview && <img src={imagePreview} alt="Course preview" className="mb-2 max-h-40" />}

      <button className="btn mb-3" onClick={handleAddModule}>➕ Add Module</button>

      {(newCourse.modules || []).map((mod, modIdx) => (
        <div key={mod.module_id} className="border p-2 mb-2">
          <input
            className="input mb-1"
            placeholder="Module Title"
            value={mod.title}
            onChange={(e) => updateCourse(["modules", modIdx, "title"], e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              updateCourse(["modules", modIdx, "imageFile"], e.target.files[0]);
              updateCourse(["modules", modIdx, "imagePreview"], URL.createObjectURL(e.target.files[0]));
            }}
          />
          {mod.imagePreview && <img src={mod.imagePreview} alt="Module preview" className="mb-1 max-h-32" />}

          <button className="btn-sm mb-1" onClick={() => handleAddSection(modIdx)}>➕ Add Section</button>
          <button className="btn-sm mb-1" onClick={() => handleRemove(["modules", modIdx])}>🗑 Remove Module</button>

          {(mod.sections || []).map((sec, secIdx) => (
            <div key={sec.section_id} className="border p-2 ml-4 mb-2">
              <input
                className="input mb-1"
                placeholder="Section Title"
                value={sec.title}
                onChange={(e) =>
                  updateCourse(["modules", modIdx, "sections", secIdx, "title"], e.target.value)
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  updateCourse(["modules", modIdx, "sections", secIdx, "imageFile"], e.target.files[0]);
                  updateCourse(
                    ["modules", modIdx, "sections", secIdx, "imagePreview"],
                    URL.createObjectURL(e.target.files[0])
                  );
                }}
              />
              {sec.imagePreview && <img src={sec.imagePreview} alt="Section preview" className="mb-1 max-h-28" />}

              <button className="btn-sm mb-1" onClick={() => handleAddContentBlock(modIdx, secIdx)}>➕ Add Content</button>
              <button className="btn-sm mb-1" onClick={() => handleAddQuestion(modIdx, secIdx)}>➕ Add Question</button>
              <button className="btn-xs mb-1" onClick={() => handleRemove(["modules", modIdx, "sections", secIdx])}>🗑 Remove Section</button>

              {(sec.contents || []).map((c, cIdx) => (
                <div key={cIdx} className="ml-2 mb-1">
                  <input
                    className="input mb-1"
                    placeholder="Header"
                    value={c.header}
                    onChange={(e) =>
                      updateCourse(["modules", modIdx, "sections", secIdx, "contents", cIdx, "header"], e.target.value)
                    }
                  />
                  <textarea
                    className="input mb-1"
                    placeholder="Text"
                    value={c.text}
                    onChange={(e) =>
                      updateCourse(["modules", modIdx, "sections", secIdx, "contents", cIdx, "text"], e.target.value)
                    }
                  />
                  <button
                    className="btn-xs"
                    onClick={() =>
                      handleRemove(["modules", modIdx, "sections", secIdx, "contents", cIdx])
                    }
                  >🗑</button>
                </div>
              ))}

              {(sec.quiz?.questions || []).map((q, qIdx) => (
                <div key={qIdx} className="ml-2 mb-1">
                  <input
                    className="input mb-1"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => {
                      const modules = structuredClone(newCourse.modules);
                      modules[modIdx].sections[secIdx].quiz.questions[qIdx].question = e.target.value;
                      setNewCourse({ ...newCourse, modules });
                    }}
                  />
                  {q.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      className="input mb-1 ml-2"
                      placeholder={`Option ${oIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const modules = structuredClone(newCourse.modules);
                        modules[modIdx].sections[secIdx].quiz.questions[qIdx].options[oIdx] = e.target.value;
                        setNewCourse({ ...newCourse, modules });
                      }}
                    />
                  ))}
                  <input
                    type="number"
                    className="input mb-1"
                    placeholder="Correct Answer Index"
                    value={q.answer}
                    onChange={(e) => {
                      const modules = structuredClone(newCourse.modules);
                      modules[modIdx].sections[secIdx].quiz.questions[qIdx].answer = parseInt(e.target.value);
                      setNewCourse({ ...newCourse, modules });
                    }}
                  />
                  <textarea
                    className="input mb-1"
                    placeholder="Explanation"
                    value={q.explanation}
                    onChange={(e) => {
                      const modules = structuredClone(newCourse.modules);
                      modules[modIdx].sections[secIdx].quiz.questions[qIdx].explanation = e.target.value;
                      setNewCourse({ ...newCourse, modules });
                    }}
                  />
                  <button
                    className="btn-xs"
                    onClick={() => {
                      const modules = structuredClone(newCourse.modules);
                      modules[modIdx].sections[secIdx].quiz.questions.splice(qIdx, 1);
                      setNewCourse({ ...newCourse, modules });
                    }}
                  >🗑</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button className="btn btn-primary mt-3" onClick={handleSave}>💾 Save</button>
      <PopUp
        show={showCongrats}
        onClose={() => {
          setShowCongrats(false);
          navigate("/courses_admin");
        }}
        message="Course saved successfully"
        type="success"
      />
    </div>
  );
}
