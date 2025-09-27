import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import styles from "./EditableDashboard.module.css"; // Import the CSS module
import useUserData from "@/hooks/get_user_data.js";
import RemoteImage from "@/components/basic_ui/remoteImgDisplay.jsx";
import DeleteConfirmation from "../../components/admin_components/DeleteConfirmation";
import DeleteItemButton from "../../components/admin_components/DeleteItemButton";

const EditableDashboard = ({ initialData = [], handleCancel }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { user } = useUserData();
  const [programs, setPrograms] = useState(initialData || []);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState({
    uid: null,
    tab: "content",
  });
  const [expandedPrograms, setExpandedPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const api = import.meta.env.VITE_API_URL;
  const [editingQuizFor, setEditingQuizFor] = useState(null);

  const toggleProgramExpansion = (programUid) => {
    setExpandedPrograms((prev) =>
      prev.includes(programUid)
        ? prev.filter((id) => id !== programUid)
        : [...prev, programUid]
    );
  };

  const updatePrograms = (updater) =>
    setPrograms((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev || []));
      updater(cloned);
      return cloned;
    });

  const setProgramTitle = (programUid, title) => {
    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (p) p.title = title;
    });
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;

    const { type, ids } = deleteTarget;

    if (type === "Program") await handleDeleteProgram(ids.programUid);
    if (type === "Course")
      await handleDeleteCourse(ids.programUid, ids.courseUid);
    if (type === "Module")
      await handleDeleteModule(ids.programUid, ids.courseUid, ids.moduleUid);

    setDeleteTarget(null);
  };

  const setCourseField = (programUid, courseUid, field, value) => {
    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (!p) return;
      const c = (p.courses || []).find((cc) => cc.uid === courseUid);
      if (!c) return;
      c[field] = value;
    });
  };

  const setModuleField = (programUid, courseUid, moduleUid, field, value) => {
    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (!p) return;
      const c = (p.courses || []).find((cc) => cc.uid === courseUid);
      if (!c) return;
      const m = (c.modules || []).find((mm) => mm.uid === moduleUid);
      if (!m) return;
      m[field] = value;
    });
  };

  const setFinalQuizMeta = (programUid, changes) => {
    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (!p) return;
      p.final_quiz = p.final_quiz || {};
      if (typeof changes.quiz_title !== "undefined")
        p.final_quiz.quiz_title = changes.quiz_title;
      if (typeof changes.quiz_description !== "undefined")
        p.final_quiz.quiz_description = changes.quiz_description;
      if (typeof changes.metadata !== "undefined")
        p.final_quiz.metadata = changes.metadata;
      if (!Array.isArray(p.final_quiz.quiz))
        p.final_quiz.quiz = p.final_quiz.quiz || p.final_quiz.questions || [];
    });
  };

  const replaceImage = async (oldImageId, file) => {
    if (!file) return null;
    try {
      const form = new FormData();
      form.append("image", file);
      const uploadRes = await axios.post(
        `${api}/api/${user?.lang.toLowerCase()}/images`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const newImage = uploadRes.data;

      if (oldImageId) {
        // State update for replacement is handled by the calling component
        // which now has the newImage.id. We just need to delete the old one.
        try {
          await axios.delete(
            `${api}/api/${user?.lang.toLowerCase()}/images/${oldImageId}`
          );
        } catch (e) {
          console.warn(
            "Failed to delete old image during replacement",
            oldImageId,
            e?.message || e
          );
        }
      }
      console.log("✅ Upload response:", newImage);
      return newImage;
    } catch (err) {
      console.error("Error replacing image", err);
      throw err;
    }
  };

  const handleRemoveImage = async (imageId, onSuccessCallback) => {
    if (!imageId) return;
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this image? This cannot be undone."
      )
    ) {
      return;
    }
    try {
      await axios.delete(
        `${api}/api/${user?.lang.toLowerCase()}/images/${imageId}`
      );
      onSuccessCallback(); // Update state to remove image from UI
    } catch (err) {
      console.error("Failed to delete image", imageId, err);
      alert("Error: Could not delete the image from the server.");
    }
  };

  const handleDeleteProgram = async (programUid) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userInput = prompt(
      `Type the following code to confirm deletion (this is permanent): ${code}`
    );
    if (userInput !== code) return alert("Code mismatch. Deletion cancelled.");

    updatePrograms((list) => {
      const idx = list.findIndex((p) => p.uid === programUid);
      if (idx !== -1) list.splice(idx, 1);
    });
    alert("Program deleted permanently.");
  };

  const handleDeleteCourse = async (programUid, courseUid) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userInput = prompt(
      `Type the following code to confirm deletion (this is permanent): ${code}`
    );
    if (userInput !== code) return alert("Code mismatch. Deletion cancelled.");

    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (!p || !p.courses) return;
      const idx = p.courses.findIndex((c) => c.uid === courseUid);
      if (idx !== -1) p.courses.splice(idx, 1);
    });
    alert("Course deleted permanently.");
  };

  const handleDeleteModule = async (programUid, courseUid, moduleUid) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userInput = prompt(
      `Type the following code to confirm deletion (this is permanent): ${code}`
    );
    if (userInput !== code) return alert("Code mismatch. Deletion cancelled.");

    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      const c = p?.courses?.find((cc) => cc.uid === courseUid);
      if (!c || !c.modules) return;
      const idx = c.modules.findIndex((m) => m.uid === moduleUid);
      if (idx !== -1) c.modules.splice(idx, 1);
    });
    alert("Module deleted permanently.");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    try {
      const langPrefix = user?.lang;
      for (const program of programs) {
        await axios.put(`${api}/api/${langPrefix}/programs/${program.uid}`, {
          title: program.title,
          final_quiz_title: program.final_quiz?.quiz_title,
          courses: (program.courses || []).map((c) => c.title),
          metadata: program.metadata || {},
        });

        for (const course of program.courses || []) {
          await axios.put(`${api}/api/${langPrefix}/courses/${course.uid}`, {
            title: course.title,
            description: course.description,
            cover_img: course.cover_img || null,
            modules: (course.modules || []).map((m) => m.title),
            metadata: course.metadata || {},
          });

          for (const mod of course.modules || []) {
            await axios.put(`${api}/api/${langPrefix}/modules/${mod.uid}`, {
              title: mod.title,
              content: (mod.content || []).map((c) => ({
                ...c,
                media: c.media || null,
              })),
              quiz: mod.quiz || [],
              metadata: mod.metadata || {},
            });
          }
        }

        if (program.final_quiz) {
          const quizPayload = {
            quiz_title: program.final_quiz.quiz_title,
            quiz_description: program.final_quiz.quiz_description,
            questions: Array.isArray(program.final_quiz.quiz)
              ? program.final_quiz.quiz
              : program.final_quiz.questions || [],
            metadata: program.final_quiz.metadata || {},
          };
          await axios.put(
            `${api}/api/${langPrefix}/final_quiz/${program.final_quiz.uid}`,
            quizPayload
          );
        }
      }
      setSuccess("✅ Changes saved successfully!");
    } catch (err) {
      setError("❌ Error saving changes. Please check console for details.");
      console.error(
        "Error saving program:",
        err?.response?.data || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  const programList = useMemo(() => programs || [], [programs]);

  const renderProgramDetails = (programUid) => {
    const program = programList.find((x) => x.uid === programUid);
    if (!program)
      return <div className={styles.placeholder}>Program not found</div>;

    const isExpanded = expandedPrograms.includes(program.uid);

    return (
      <div className={styles.buttonGroup}>
        <div className={styles.programHeader}>
          <h2 className={styles.sectionHeader}>
            {program.title}
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => toggleProgramExpansion(program.uid)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
            <DeleteItemButton
              uid={program.uid}
              type="Program"
              lang={user?.lang || "en"}
              onClick={() =>
                setDeleteTarget({
                  type: "Program",
                  ids: { programUid: program.uid },
                })
              }
            />
          </h2>
        </div>
        {isExpanded && (
          <div className={styles.detailsGrid}>
            <div>
              <h3 className={styles.sectionHeader}>Courses</h3>
              <div className={styles.courseGrid}>
                {(program.courses || []).map((c) => (
                  <CourseCard
                    key={c.uid}
                    programUid={program.uid}
                    course={c}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    replaceImage={replaceImage}
                    handleRemoveImage={handleRemoveImage}
                    setCourseField={setCourseField}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className={styles.sectionHeader}>Final Quiz</h3>
              <div className={styles.card}>
                <div className={styles.inputGroup}>
                  <label
                    className={styles.label}
                    htmlFor={`quiz-title-${program.uid}`}
                  >
                    Title
                  </label>
                  <input
                    id={`quiz-title-${program.uid}`}
                    className={styles.input}
                    value={program.final_quiz?.quiz_title || ""}
                    onChange={(e) =>
                      setFinalQuizMeta(program.uid, {
                        quiz_title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={`${styles.inputGroup} mt-4`}>
                  <label
                    className={styles.label}
                    htmlFor={`quiz-desc-${program.uid}`}
                  >
                    Description
                  </label>
                  <textarea
                    id={`quiz-desc-${program.uid}`}
                    className={styles.textarea}
                    value={program.final_quiz?.quiz_description || ""}
                    onChange={(e) =>
                      setFinalQuizMeta(program.uid, {
                        quiz_description: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary} mt-4 w-full`}
                  onClick={() =>
                    setEditingQuizFor(
                      editingQuizFor === program.uid ? null : program.uid
                    )
                  }
                >
                  {editingQuizFor === program.uid
                    ? "Close Quiz Editor"
                    : "Edit Quiz Questions"}
                </button>
              </div>
              {editingQuizFor === program.uid && (
                <FinalQuizEditor
                  program={program}
                  onChange={(updatedQuiz) => {
                    updatePrograms((list) => {
                      const p = list.find((x) => x.uid === program.uid);
                      if (p) {
                        p.final_quiz = p.final_quiz || {};
                        p.final_quiz.quiz = updatedQuiz;
                      }
                    });
                  }}
                />
              )}
            </div>
          </div>
        )}
        {isExpanded &&
          selectedCourse &&
          renderCourseDetails(programUid, selectedCourse)}
      </div>
    );
  };

  const renderCourseDetails = (programUid, courseUid) => {
    const program = programList.find((x) => x.uid === programUid);
    const course = (program?.courses || []).find((c) => c.uid === courseUid);
    if (!course) return null;
    return (
      <div className={"mt-6 col-span-full"}>
        <h3 className={styles.sectionHeader}>Modules for {course.title}</h3>
        <div className={styles.moduleList}>
          {(course.modules || []).map((m) => (
            <div
              key={m.uid}
              className={`${styles.moduleItemCard} ${
                selectedModule.uid === m.uid ? styles.moduleItemSelected : ""
              }`}
            >
              <div
                className={`${styles.moduleItemHeader} ${styles.buttonGroup}`}
              >
                <input
                  value={m.title}
                  onChange={(e) =>
                    setModuleField(
                      programUid,
                      courseUid,
                      m.uid,
                      "title",
                      e.target.value
                    )
                  }
                  className={styles.input}
                />
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() =>
                    setSelectedModule((prev) => ({
                      ...prev,
                      uid: prev.uid === m.uid ? null : m.uid,
                    }))
                  }
                >
                  {selectedModule.uid === m.uid ? "Close" : "Edit"}
                </button>
                <DeleteItemButton
                  uid={m.uid}
                  lang={user?.lang || "en"}
                  type="Module"
                  onClick={() =>
                    setDeleteTarget({
                      type: "Module",
                      ids: { programUid, courseUid, moduleUid: m.uid },
                    })
                  }
                />
              </div>
              {selectedModule.uid === m.uid && (
                <>
                  <div className={styles.moduleEditorTabs}>
                    <button
                      className={`${styles.tabButton} ${
                        selectedModule.tab === "content"
                          ? styles.tabButtonActive
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedModule((prev) => ({
                          ...prev,
                          tab: "content",
                        }))
                      }
                    >
                      Content
                    </button>
                    <button
                      className={`${styles.tabButton} ${
                        selectedModule.tab === "quiz"
                          ? styles.tabButtonActive
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedModule((prev) => ({ ...prev, tab: "quiz" }))
                      }
                    >
                      Quiz
                    </button>
                  </div>
                  <div className={styles.moduleContentEditor}>
                    {selectedModule.tab === "content" &&
                      renderModuleContents(programUid, courseUid, m.uid)}
                    {selectedModule.tab === "quiz" && (
                      <ModuleQuizEditor
                        module={m}
                        programUid={programUid}
                        courseUid={courseUid}
                        setModuleField={setModuleField}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderModuleContents = (programUid, courseUid, moduleUid) => {
    const program = programList.find((x) => x.uid === programUid);
    const course = (program?.courses || []).find((c) => c.uid === courseUid);
    const mod = (course?.modules || []).find((mm) => mm.uid === moduleUid);
    if (!mod) return null;
    return (
      <div>
        {(mod.content || []).map((ct, idx) => (
          <div key={idx} className={styles.contentBlock}>
            <div className={styles.inputGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Header</label>
                <input
                  value={ct.header || ""}
                  onChange={(e) =>
                    setModuleField(
                      programUid,
                      courseUid,
                      moduleUid,
                      "content",
                      (mod.content || []).map((c, i) =>
                        i === idx ? { ...c, header: e.target.value } : c
                      )
                    )
                  }
                  className={styles.input}
                />
              </div>
              <div className={`${styles.inputGroup} mt-4`}>
                <label className={styles.label}>Text</label>
                <textarea
                  value={ct.text || ""}
                  onChange={(e) =>
                    setModuleField(
                      programUid,
                      courseUid,
                      moduleUid,
                      "content",
                      (mod.content || []).map((c, i) =>
                        i === idx ? { ...c, text: e.target.value } : c
                      )
                    )
                  }
                  className={styles.textarea}
                />
              </div>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id={`breaker-${moduleUid}-${idx}`}
                  checked={!!ct.breaker}
                  onChange={(e) =>
                    setModuleField(
                      programUid,
                      courseUid,
                      moduleUid,
                      "content",
                      (mod.content || []).map((c, i) =>
                        i === idx ? { ...c, breaker: e.target.checked } : c
                      )
                    )
                  }
                />
                <label
                  htmlFor={`breaker-${moduleUid}-${idx}`}
                  className={styles.label}
                >
                  Is a page breaker?
                </label>
              </div>
            </div>
            <div className={"w-full md:w-64 flex-shrink-0"}>
              <label className={styles.label}>Media</label>
              <ImageEditor
                currentId={ct.media}
                onReplace={async (file) => {
                  try {
                    const newImage = await replaceImage(ct.media, file);
                    setModuleField(
                      programUid,
                      courseUid,
                      moduleUid,
                      "content",
                      (mod.content || []).map((c, i) =>
                        i === idx
                          ? {
                              ...c,
                              media: newImage?.uid || null,
                            }
                          : c
                      )
                    );
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onRemove={() =>
                  handleRemoveImage(ct.media, () => {
                    setModuleField(
                      programUid,
                      courseUid,
                      moduleUid,
                      "content",
                      (mod.content || []).map((c, i) =>
                        i === idx ? { ...c, media: null } : c
                      )
                    );
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.header}>Admin: Edit Programs & Courses</h1>
      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarHeader}>Programs</h2>
          <div className={styles.programList}>
            {programList.map((p) => (
              <div
                key={p.uid}
                className={`${styles.programItem} ${
                  selectedProgram === p.uid ? styles.programItemSelected : ""
                }`}
                onClick={() => {
                  setSelectedProgram(p.uid);
                  if (!expandedPrograms.includes(p.uid)) {
                    toggleProgramExpansion(p.uid);
                  }
                  setSelectedCourse(null);
                  setSelectedModule({ uid: null, tab: "content" });
                }}
              >
                <input
                  value={p.title}
                  onChange={(e) => setProgramTitle(p.uid, e.target.value)}
                  className={styles.input}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </aside>
        <main className={styles.contentArea}>
          {selectedProgram ? (
            renderProgramDetails(selectedProgram)
          ) : (
            <div className={styles.placeholder}>
              <p>Select a program from the left panel to begin editing.</p>
            </div>
          )}
        </main>
      </div>
      <footer className={styles.floatingFooter}>
        <button
          onClick={handleSave}
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save All Changes"}
        </button>
        <button
          onClick={() => handleCancel(false)}
          className={`${styles.btn} ${styles.btnSecondary}`}
          disabled={loading}
        >
          Close
        </button>
        <div className={styles.statusMessage}>
          {loading && <span>Saving...</span>}
          {error && <span className={styles.error}>{error}</span>}
          {success && <span className={styles.success}>{success}</span>}
        </div>
      </footer>
      {deleteTarget && (
        <DeleteConfirmation
          type={deleteTarget.type}
          onConfirm={onConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

// ====== Helper component for rendering a course card ======
function CourseCard({
  programUid,
  course,
  selectedCourse,
  setSelectedCourse,
  replaceImage,
  handleRemoveImage,
  setCourseField,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.courseCardHeader}>
        <div className={styles.buttonGroup}>
          <input
            value={course.title}
            onChange={(e) =>
              setCourseField(programUid, course.uid, "title", e.target.value)
            }
            className={styles.input}
          />
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() =>
              setSelectedCourse(
                selectedCourse === course.uid ? null : course.uid
              )
            }
          >
            {selectedCourse === course.uid ? "Collapse" : "Expand"}
          </button>
          <DeleteItemButton
            uid={course.uid}
            lang={"en"}
            type="Course"
            onClick={() =>
              setDeleteTarget({
                type: "Course",
                ids: { programUid, courseUid: course.uid },
              })
            }
          />
        </div>
      </div>
      {selectedCourse === course.uid && (
        <>
          <div className={`${styles.inputGroup} mt-4`}>
            <label className={styles.label}>Description</label>
            <textarea
              value={course.description || ""}
              onChange={(e) =>
                setCourseField(
                  programUid,
                  course.uid,
                  "description",
                  e.target.value
                )
              }
              className={styles.textarea}
            />
          </div>
          <div className={`${styles.inputGroup} mt-4`}>
            <label className={styles.label}>Cover Image</label>
            <ImageEditor
              currentId={course.cover_img}
              onReplace={async (file) => {
                try {
                  const newImage = await replaceImage(course.cover_img, file);
                  const newId = newImage?.uid || null;
                  setCourseField(programUid, course.uid, "cover_img", newId);
                } catch (e) {
                  console.error(e);
                }
              }}
              onRemove={() =>
                handleRemoveImage(course.cover_img, () => {
                  setCourseField(programUid, course.uid, "cover_img", null);
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

// ====== Helper component for image editing and preview ======
function ImageEditor({ currentId, onReplace, onRemove }) {
  const { user } = useUserData();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      onReplace(selectedFile);
    }
    e.target.value = null; // Reset file input
  };
  return (
    <div className={styles.imageEditor}>
      <div className={styles.imagePreviewContainer}>
        {currentId ? (
          <RemoteImage
            key={currentId}
            uid={currentId}
            lang={user?.lang}
            alt="Current media"
            className={styles.imagePreview}
          />
        ) : (
          <span>No media</span>
        )}
      </div>
      <div className={styles.imageActions}>
        <label
          className={`${styles.btn} ${styles.btnSecondary}`}
          style={{ cursor: "pointer" }}
        >
          Replace
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {currentId && (
          <button
            onClick={onRemove}
            className={`${styles.btn} ${styles.btnDangerOutline}`}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ====== Base Quiz Editor for reusability ======
function QuizEditorBase({ quizData, onQuizChange, title }) {
  const [localQuiz, setLocalQuiz] = useState(
    JSON.parse(JSON.stringify(quizData || []))
  );

  useEffect(() => {
    setLocalQuiz(JSON.parse(JSON.stringify(quizData || [])));
  }, [quizData]);

  const updateQuestion = (idx, field, value) => {
    setLocalQuiz((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const addQuestion = () =>
    setLocalQuiz((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], answer: 0, explanation: "" },
    ]);

  const removeQuestion = (idx) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setLocalQuiz((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div>
      <div className={styles.quizHeader}>
        <h4 className={styles.sectionHeader} style={{ marginBottom: 0 }}>
          {title}
        </h4>
        <div className={"flex gap-2"}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => onQuizChange(localQuiz)}
          >
            Apply Changes
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>
      </div>
      <div className={styles.quizEditorQuestions}>
        {localQuiz.map((q, qi) => (
          <div key={qi} className={styles.quizQuestionCard}>
            <div className={styles.quizQuestionHeader}>
              <div className={`${styles.inputGroup} flex-grow`}>
                <label className={styles.label}>{`Question ${qi + 1}`}</label>
                <input
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qi, "question", e.target.value)
                  }
                  className={styles.input}
                  placeholder="Question text"
                />
              </div>
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => removeQuestion(qi)}
              >
                Remove
              </button>
            </div>
            <div className={styles.quizOptions}>
              <label className={styles.label}>Options & Correct Answer</label>
              {(q.options || ["", "", "", ""]).map((opt, oi) => (
                <div key={oi} className={styles.quizOptionItem}>
                  <input
                    value={opt}
                    onChange={(e) =>
                      updateQuestion(
                        qi,
                        "options",
                        (q.options || []).map((o, i) =>
                          i === oi ? e.target.value : o
                        )
                      )
                    }
                    className={styles.input}
                    placeholder={`Option ${oi + 1}`}
                  />
                  <input
                    type="radio"
                    name={`answer-${qi}`}
                    checked={Number(q.answer) === oi}
                    onChange={() => updateQuestion(qi, "answer", oi)}
                  />
                </div>
              ))}
            </div>
            <div className={`${styles.inputGroup} mt-4`}>
              <label className={styles.label}>Explanation</label>
              <textarea
                value={q.explanation}
                onChange={(e) =>
                  updateQuestion(qi, "explanation", e.target.value)
                }
                className={styles.textarea}
                placeholder="Explanation for the correct answer"
              />
            </div>
          </div>
        ))}
        {localQuiz.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No questions yet. Click "Add Question" to start.
          </p>
        )}
      </div>
    </div>
  );
}

// ====== Quiz Editor for Final Program Quiz ======
function FinalQuizEditor({ program, onChange }) {
  const quiz =
    (program.final_quiz &&
      (program.final_quiz.quiz || program.final_quiz.questions)) ||
    [];
  return (
    <div className={styles.quizEditorContainer}>
      <QuizEditorBase
        quizData={quiz}
        onQuizChange={onChange}
        title="Final Quiz Questions"
      />
    </div>
  );
}

// ====== Quiz Editor for individual Modules ======
function ModuleQuizEditor({ module, programUid, courseUid, setModuleField }) {
  const handleQuizChange = (updatedQuiz) => {
    setModuleField(programUid, courseUid, module.uid, "quiz", updatedQuiz);
  };
  return (
    <QuizEditorBase
      quizData={module.quiz}
      onQuizChange={handleQuizChange}
      title="Module Quiz Questions"
    />
  );
}

export default EditableDashboard;
