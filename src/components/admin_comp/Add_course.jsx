import { useState } from "react";

export default function AdminCourseDashboard() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    course_id: "",
    title: "",
    description: "",
    image: "",
    no_of_lessons: 1,
    modules: [],
  });

  const handleAddModule = () => {
    setNewCourse(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: "",
          module_id: `${prev.modules.length + 1}`,
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
      id: `sec-${modules[moduleIdx].sections.length + 1}`,
      title: "",
      content: {
        text: "",
        media: "",
      },
      quiz: [],
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
    setCourses(prev => [...prev, newCourse]);
    console.log("Course Added", newCourse);
    alert("✅ Course saved!");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 Add New Course</h2>

      <input
        className="input mb-2"
        placeholder="Course ID"
        value={newCourse.course_id}
        onChange={e => setNewCourse({ ...newCourse, course_id: e.target.value })}
      />
      <input
        className="input mb-2"
        placeholder="Title"
        value={newCourse.title}
        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
      />
      <textarea
        className="input mb-2"
        placeholder="Description"
        value={newCourse.description}
        onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
      />
      <input
        className="input mb-4"
        placeholder="Image URL"
        value={newCourse.image}
        onChange={e => setNewCourse({ ...newCourse, image: e.target.value })}
      />

      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">📦 Modules</h3>
        {newCourse.modules.map((mod, modIdx) => (
          <div key={modIdx} className="bg-gray-100 p-3 mb-3 rounded">
            <input
              className="input mb-2"
              placeholder="Module Title"
              value={mod.title}
              onChange={e => {
                const updatedModules = [...newCourse.modules];
                updatedModules[modIdx].title = e.target.value;
                setNewCourse({ ...newCourse, modules: updatedModules });
              }}
            />
            <button
              className="btn-sm mb-2"
              onClick={() => handleAddSection(modIdx)}
            >
              ➕ Add Section
            </button>

            {mod.sections.map((sec, secIdx) => (
              <div key={secIdx} className="bg-white p-2 border rounded mb-2">
                <input
                  className="input mb-1"
                  placeholder="Section Title"
                  value={sec.title}
                  onChange={e => {
                    const modules = [...newCourse.modules];
                    modules[modIdx].sections[secIdx].title = e.target.value;
                    setNewCourse({ ...newCourse, modules });
                  }}
                />
                <textarea
                  className="input mb-1"
                  placeholder="Content Text"
                  value={sec.content.text}
                  onChange={e => {
                    const modules = [...newCourse.modules];
                    modules[modIdx].sections[secIdx].content.text = e.target.value;
                    setNewCourse({ ...newCourse, modules });
                  }}
                />
                <input
                  className="input mb-1"
                  placeholder="Media URL"
                  value={sec.content.media}
                  onChange={e => {
                    const modules = [...newCourse.modules];
                    modules[modIdx].sections[secIdx].content.media = e.target.value;
                    setNewCourse({ ...newCourse, modules });
                  }}
                />
                <button
                  className="btn-sm mt-1"
                  onClick={() => handleAddQuiz(modIdx, secIdx)}
                >
                  ➕ Add Quiz
                </button>

                {sec.quiz.map((quiz, qIdx) => (
                  <div key={qIdx} className="p-2 mt-2 bg-gray-50 border rounded">
                    <input
                      className="input mb-1"
                      placeholder="Question"
                      value={quiz.question}
                      onChange={e => {
                        const modules = [...newCourse.modules];
                        modules[modIdx].sections[secIdx].quiz[qIdx].question = e.target.value;
                        setNewCourse({ ...newCourse, modules });
                      }}
                    />
                    {quiz.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        className="input mb-1 ml-2"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={e => {
                          const modules = [...newCourse.modules];
                          modules[modIdx].sections[secIdx].quiz[qIdx].options[optIdx] =
                            e.target.value;
                          setNewCourse({ ...newCourse, modules });
                        }}
                      />
                    ))}
                    <input
                      className="input mb-1"
                      placeholder="Correct Answer Index (0-3)"
                      type="number"
                      value={quiz.answer}
                      onChange={e => {
                        const modules = [...newCourse.modules];
                        modules[modIdx].sections[secIdx].quiz[qIdx].answer = parseInt(e.target.value);
                        setNewCourse({ ...newCourse, modules });
                      }}
                    />
                    <textarea
                      className="input"
                      placeholder="Explanation"
                      value={quiz.explanation}
                      onChange={e => {
                        const modules = [...newCourse.modules];
                        modules[modIdx].sections[secIdx].quiz[qIdx].explanation = e.target.value;
                        setNewCourse({ ...newCourse, modules });
                      }}
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
    </div>
  );
}
