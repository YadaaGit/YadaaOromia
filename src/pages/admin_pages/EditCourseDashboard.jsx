import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "@/style/Dashboard_user.css";
import "@/style/general.css";
import useUserData from "@/hooks/get_user_data.js";

// Hierarchical editor: programs -> courses -> modules -> contents
// Props:
// - initialData: array of programs (each with courses, modules...)
// - handleCancel: callback when closing
// - language: language code (EN/AM/OR etc.)
const EditableDashboard = ({ initialData = [], handleCancel, language }) => {
  const [programs, setPrograms] = useState(initialData || []);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const api = import.meta.env.VITE_API_URL;
  const { user } = useUserData();

  const [editingQuizFor, setEditingQuizFor] = useState(null);

  // Always use the logged-in user's language. If not available yet, default to 'en'.
  // (Do NOT use the component `language` prop here — user.lang has priority.)
  const effectiveLang = useMemo(
    () => (user?.lang + "").toLowerCase(),
    [user?.lang]
  );

  // shallow helper to update nested state immutably
  const updatePrograms = (updater) =>
    setPrograms((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev || []));
      updater(cloned);
      return cloned;
    });

  // When changing titles/descriptions ensure we don't clobber unrelated data
  const setProgramTitle = (programUid, title) => {
    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (p) p.title = title;
    });
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

  // Final quiz title/description edits must not erase existing questions.
  const setFinalQuizMeta = (programUid, changes) => {
    updatePrograms((list) => {
      const p = list.find((x) => x.uid === programUid);
      if (!p) return;
      p.final_quiz = p.final_quiz || {};
      // only apply provided fields, preserve questions array if present
      if (typeof changes.quiz_title !== "undefined")
        p.final_quiz.quiz_title = changes.quiz_title;
      if (typeof changes.quiz_description !== "undefined")
        p.final_quiz.quiz_description = changes.quiz_description;
      if (typeof changes.metadata !== "undefined")
        p.final_quiz.metadata = changes.metadata;
      if (!Array.isArray(p.final_quiz.quiz))
        p.final_quiz.quiz = p.final_quiz.quiz || p.final_quiz.questions || [];
      // normalize to .quiz for sending later
    });
  };

  // Image replace flow: delete old image, upload new image, and update any references in programs
  const replaceImage = async (oldImageId, file) => {
    if (!file) return null;
    try {
      // 1) upload new image
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await axios.post(`${api}/api/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImage = uploadRes.data; // assume { id, url }

      // 2) update any references from oldImageId -> newImage.id in local state
      if (oldImageId) {
        updatePrograms((list) => {
          const walk = (obj) => {
            if (!obj || typeof obj !== "object") return;
            for (const k of Object.keys(obj)) {
              const v = obj[k];
              if (v === oldImageId) obj[k] = newImage.id;
              else if (Array.isArray(v)) v.forEach((it) => walk(it));
              else if (typeof v === "object") walk(v);
            }
          };
          walk(list);
        });

        // 3) delete old image from server
        try {
          await axios.delete(`${api}/api/images/${oldImageId}`);
        } catch (e) {
          // non-fatal: log and continue
          console.warn(
            "Failed to delete old image",
            oldImageId,
            e?.message || e
          );
        }
      }

      return newImage;
    } catch (err) {
      console.error("Error replacing image", err);
      throw err;
    }
  };

  // Fetch image preview URL directly from DB view endpoint (non-destructive)
  const fetchImageUrl = async (imageId) => {
    if (!imageId) return null;
    try {
      const res = await axios.get(`${api}/api/images/${imageId}/view`);
      return res.data?.url || null;
    } catch (e) {
      console.warn("Failed to fetch image preview", imageId, e?.message || e);
      return null;
    }
  };

  // Save only modified records. We'll iterate over programs and PUT each program/course/module/final_quiz.
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const langPrefix = effectiveLang;
      for (const program of programs) {
        // save program metadata — do not send uids in the body, send human-friendly titles instead
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
            modules: (course.modules || []).map((m) => m.title),
            metadata: course.metadata || {},
          });

          for (const mod of course.modules || []) {
            await axios.put(`${api}/api/${langPrefix}/modules/${mod.uid}`, {
              title: mod.title,
              content: mod.content || [],
              quiz: mod.quiz || [],
              metadata: mod.metadata || {},
            });
          }
        }

        // final quiz: preserve existing questions if we didn't change them
        if (program.final_quiz) {
          const quizPayload = {
            quiz_title: program.final_quiz.quiz_title,
            quiz_description: program.final_quiz.quiz_description,
            questions: Array.isArray(program.final_quiz.quiz)
              ? program.final_quiz.quiz
              : program.final_quiz.questions || [],
            metadata: program.final_quiz.metadata || {},
          };
          await axios.put(`${api}/api/${langPrefix}/final_quiz/${program.final_quiz.uid}`, quizPayload);
        }
      }

      setSuccess("✅ Changes saved successfully!");
    } catch (err) {
      setError("❌ Error saving changes.");
      console.error(
        "Error saving program:",
        err?.response?.data || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  const programList = useMemo(() => programs || [], [programs]);

  // UI rendering helpers
  const renderPrograms = () => (
    <div style={{ display: "flex", gap: 12 }}>
      <div
        style={{ width: 260, borderRight: "1px solid #ddd", paddingRight: 12 }}
      >
        <h3>Programs</h3>
        {programList.map((p) => (
          <div
            key={p.uid}
            style={{
              padding: 8,
              cursor: "pointer",
              background: selectedProgram === p.uid ? "#eef" : "transparent",
            }}
            onClick={() => {
              setSelectedProgram(p.uid);
              setSelectedCourse(null);
              setSelectedModule(null);
            }}
          >
            <input
              value={p.title}
              onChange={(e) => setProgramTitle(p.uid, e.target.value)}
              className="input"
              style={{ width: "100%", border: "1px solid #ccc" }}
            />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, paddingLeft: 12 }}>
        {selectedProgram ? (
          renderProgramDetails(selectedProgram)
        ) : (
          <div>Select a program to edit its courses and final quiz.</div>
        )}
      </div>
    </div>
  );

  const renderProgramDetails = (programUid) => {
    const program = (programs || []).find((x) => x.uid === programUid);
    if (!program) return <div>Program not found</div>;
    return (
      <div style={{ marginBottom: 80 }}>
        <h3 style={{ marginTop: 0 }}>{program.title}</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h4>Courses</h4>
            {(program.courses || []).map((c) => (
              <div
                key={c.uid}
                style={{
                  padding: 8,
                  border: "1px solid #eee",
                  marginBottom: 8,
                  background: selectedCourse === c.uid ? "#f8fafc" : "#fff",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedCourse(c.uid);
                      setSelectedModule(null);
                    }}
                  >
                    {selectedCourse === c.uid ? "Editing" : "Edit"}
                  </button>
                  <input
                    value={c.title}
                    onChange={(e) =>
                      setCourseField(programUid, c.uid, "title", e.target.value)
                    }
                    className="input"
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ marginTop: 8 }}>
                  <label>Cover Image:</label>
                  <ImageEditor
                    currentId={c.cover_image}
                    onReplace={async (file) => {
                      try {
                        const newImage = await replaceImage(
                          c.cover_image,
                          file
                        );
                        // set the new id on the course
                        setCourseField(
                          programUid,
                          c.uid,
                          "cover_image",
                          newImage?.id ||
                            newImage?._id ||
                            newImage?.url ||
                            newImage
                        );
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <h4>Final Quiz</h4>
            <div style={{ padding: 8, border: "1px solid #eee", background: "#fff" }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label>Title</label>
                  <input className='input' value={program.final_quiz?.quiz_title || ''} onChange={(e) => setFinalQuizMeta(program.uid, { quiz_title: e.target.value })} />
                  <label style={{ marginTop: 8 }}>Description</label>
                  <textarea className='textarea' value={program.final_quiz?.quiz_description || ''} onChange={(e) => setFinalQuizMeta(program.uid, { quiz_description: e.target.value })} />
                </div>
                <div>
                  <button className='btn-primary' onClick={() => setEditingQuizFor(program.uid)}>{editingQuizFor === program.uid ? 'Close Quiz Editor' : 'Edit Quiz'}</button>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <small>Use the quiz editor to modify questions. Questions are preserved unless removed.</small>
              </div>
            </div>
            {editingQuizFor === program.uid && (
              <div style={{ marginTop: 12 }}>
                <QuizEditor program={program} onChange={(updatedQuiz) => {
                  updatePrograms((list) => {
                    const p = list.find((x) => x.uid === program.uid);
                    if (!p) return; p.final_quiz = p.final_quiz || {}; p.final_quiz.quiz = updatedQuiz;
                  });
                }} fetcher={fetchImageUrl} />
              </div>
            )}
          </div>
        </div>

        {selectedCourse && renderCourseDetails(programUid, selectedCourse)}
      </div>
    );
  };

  const renderCourseDetails = (programUid, courseUid) => {
    const program = (programs || []).find((x) => x.uid === programUid);
    const course = (program?.courses || []).find((c) => c.uid === courseUid);
    if (!course) return <div>Course not found</div>;
    return (
      <div style={{ marginTop: 12 }}>
        <h4>Modules for {course.title}</h4>
        {(course.modules || []).map((m) => (
          <div
            key={m.uid}
            style={{
              padding: 8,
              border: "1px solid #eee",
              marginBottom: 8,
              background: selectedModule === m.uid ? "#f7f7ff" : "#fff",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className="btn-secondary"
                onClick={() => setSelectedModule(m.uid)}
              >
                {selectedModule === m.uid ? "Editing" : "Edit"}
              </button>
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
                className="input"
                style={{ flex: 1 }}
              />
            </div>
            {selectedModule === m.uid &&
              renderModuleContents(programUid, courseUid, m.uid)}
          </div>
        ))}
      </div>
    );
  };

  const renderModuleContents = (programUid, courseUid, moduleUid) => {
    const program = (programs || []).find((x) => x.uid === programUid);
    const course = (program?.courses || []).find((c) => c.uid === courseUid);
    const mod = (course?.modules || []).find((mm) => mm.uid === moduleUid);
    if (!mod) return <div>Module not found</div>;
    return (
      <div style={{ marginTop: 8, padding: 8 }}>
        {(mod.content || []).map((ct, idx) => (
          <div key={idx} style={{ border: '1px dashed #ddd', padding: 8, marginBottom: 8, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label>Header</label>
              <input value={ct.header} onChange={(e) => setModuleField(programUid, courseUid, moduleUid, 'content', (mod.content || []).map((cct, i) => i===idx?{...cct, header: e.target.value}:cct))} className='input' />
              <label style={{ marginTop: 6 }}>Text</label>
              <textarea value={ct.text} onChange={(e) => setModuleField(programUid, courseUid, moduleUid, 'content', (mod.content || []).map((cct, i) => i===idx?{...cct, text: e.target.value}:cct))} className='textarea' />

              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ marginRight: 6 }}>Breaker</label>
                <input type='checkbox' checked={!!ct.breaker} onChange={(e) => setModuleField(programUid, courseUid, moduleUid, 'content', (mod.content || []).map((cct, i) => i===idx?{...cct, breaker: e.target.checked}:cct))} />
              </div>
            </div>

            <div style={{ width: 220 }}>
              <label>Media</label>
              <ImagePreview id={ct.media} fetcher={fetchImageUrl} width={200} height={120} />
              <div style={{ marginTop: 6 }}>
                <input type='file' accept='image/*,video/*' onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const newImage = await replaceImage(ct.media, file);
                    setModuleField(programUid, courseUid, moduleUid, 'content', (mod.content || []).map((cct, i) => i===idx?{...cct, media: newImage?.id || newImage?._id || newImage?.url || newImage}:cct));
                  } catch (err) { console.error(err); }
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleClose = () => handleCancel(false);

  return (
    <div>
      <h1 style={{ fontWeight: "bold", fontSize: 28 }}>Admin: Edit Courses</h1>
      {renderPrograms()}

      <div
        style={{
          position: "fixed",
          bottom: 65,
          left: 0,
          right: 0,
          padding: 20,
          background: "#f3f4f6",
        }}
      >
        <button onClick={handleSave} className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleClose}
          className="btn-secondary"
          style={{ marginLeft: 12 }}
          disabled={loading}
        >
          Close
        </button>
      </div>

      {loading && <div className="text-gray-600">Saving...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </div>
  );
};

export default EditableDashboard;

// Small inline ImageEditor component so the file remains self-contained
function ImageEditor({ currentId, onReplace }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    let cancelled = false;
    if (!currentId) { setPreview(null); return; }
    fetchImageUrl(currentId).then((u) => { if (!cancelled) setPreview(u); }).catch(() => { if (!cancelled) setPreview(null); });
    return () => { cancelled = true; };
  }, [currentId]);

  return (
    <div>
      <div style={{ marginBottom: 6 }}>
        {preview ? <img src={preview} alt='preview' style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} /> : <div style={{ width: 120, height: 80, background: '#fafafa', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No image</div>}
      </div>
      <input type='file' accept='image/*' onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className='btn-primary' onClick={async () => {
        if (!file) return; try { await onReplace(file); setFile(null); } catch (e) { alert('Image upload failed'); }
      }} style={{ marginLeft: 8 }}>Replace</button>
    </div>
  );
}

// Inline ImagePreview: fetches preview URL from backend and shows thumbnail
function ImagePreview({ id, fetcher, width = 120, height = 80 }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let cancelled = false;
    if (!id) { setUrl(null); return; }
    fetcher(id).then((u) => { if (!cancelled) setUrl(u); }).catch(() => { if (!cancelled) setUrl(null); });
    return () => { cancelled = true; };
  }, [id, fetcher]);

  if (!id) return <div style={{ width, height, background: '#fafafa', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No media</div>;
  return (
    <div style={{ width, height, border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {url ? <img src={url} alt='preview' style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: 12 }}>Preview unavailable</div>}
    </div>
  );
}

// Quick QuizEditor: edit program.final_quiz.quiz array in-place (questions with options, answer, explanation)
function QuizEditor({ program, onChange, fetcher }) {
  const quiz = (program.final_quiz && (program.final_quiz.quiz || program.final_quiz.questions)) || [];
  const [local, setLocal] = useState(JSON.parse(JSON.stringify(quiz)));

  useEffect(() => { setLocal(JSON.parse(JSON.stringify(quiz || []))); }, [program.uid]);

  const setQuestion = (idx, field, value) => {
    setLocal((prev) => prev.map((q, i) => i===idx ? ({ ...q, [field]: value }) : q));
  };

  const addQuestion = () => setLocal((prev) => [...prev, { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }]);
  const removeQuestion = (idx) => setLocal((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div style={{ border: '1px solid #ddd', padding: 8, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>Quiz Editor</h4>
        <div>
          <button className='btn-secondary' onClick={() => onChange(local)}>Save Quiz</button>
          <button className='btn-secondary' style={{ marginLeft: 8 }} onClick={() => setLocal(JSON.parse(JSON.stringify(quiz || [])))}>Reset</button>
          <button className='btn-primary' style={{ marginLeft: 8 }} onClick={addQuestion}>Add Question</button>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        {local.map((q, qi) => (
          <div key={qi} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={q.question} onChange={(e) => setQuestion(qi, 'question', e.target.value)} className='input' placeholder='Question text' style={{ flex: 1 }} />
              <button className='btn-secondary' onClick={() => removeQuestion(qi)}>Remove</button>
            </div>
            <div style={{ marginTop: 8 }}>
              { (q.options || []).map((opt, oi) => (
                <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <input value={opt} onChange={(e) => setQuestion(qi, 'options', (q.options || []).map((o, i) => i===oi?e.target.value:o))} className='input' style={{ flex: 1 }} />
                  <div>Ans</div>
                  <input type='number' min={0} max={(q.options||[]).length-1} value={q.answer} onChange={(e) => setQuestion(qi, 'answer', Number(e.target.value))} style={{ width: 60 }} />
                </div>
              )) }
            </div>
            <div>
              <label>Explanation</label>
              <textarea value={q.explanation} onChange={(e) => setQuestion(qi, 'explanation', e.target.value)} className='textarea' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
