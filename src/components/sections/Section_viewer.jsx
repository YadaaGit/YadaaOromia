import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "./Quiz";
import PopUp from "../basic_ui/pop_up.jsx";

export default function SectionViewer({ module, finalQuiz = null, scrollRef }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0); // 0=content, 1=final quiz
  const [passedQuiz, setPassedQuiz] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const isFinal = current === 1;

  // Shuffle questions
  const sectionQuestions = useMemo(
    () =>
      [...(module?.questions || [])]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((q, i) => ({ id: i, ...q })),
    [module]
  );

  const finalQuizQuestions = useMemo(
    () =>
      [...(finalQuiz?.questions || [])]
        .sort(() => 0.5 - Math.random())
        .map((q, i) => ({ id: i, ...q })),
    [finalQuiz]
  );

  const handleQuizPassed = () => {
    setPassedQuiz(true)
    
  };

  // Scroll to top on change
  useEffect(() => {
    scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const handleNext = () => {
    if (isFinal) setShowCongrats(true);
    else {
      setCurrent((prev) => prev + 1);
      setPassedQuiz(false);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
    setPassedQuiz(true); // assume passed on revisit
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {!isFinal && (
        <>
          <h3 className="text-2xl font-bold mb-3">{module.title}</h3>
          {module.content.map((c, idx) => (
            <div key={idx}>
              <h4 className="font-bold">{c.header}</h4>
              <p className="mb-4 text-logo-800 leading-relaxed whitespace-pre-line">
                {c.text}
              </p>
              {c.media && (
                <img
                  src={c.media}
                  alt=""
                  className="rounded-xl mb-6 w-full max-h-72 object-cover"
                />
              )}
            </div>
          ))}
          <Quiz
            questions={sectionQuestions}
            onPassed={() => handleQuizPassed()}
          />
        </>
      )}

      {isFinal && finalQuiz && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-2">{finalQuiz.title}</h3>
          <p className="mb-4 text-gray-700">{finalQuiz.description}</p>
          <Quiz
            questions={finalQuizQuestions}
            onPassed={() => setPassedQuiz(true)}
          />
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className={current === 0 ? "btn btn_disabled" : "btn"}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!passedQuiz}
          className={
            isFinal
              ? !passedQuiz
                ? "btn-primary btn_disabled"
                : "btn-primary"
              : !passedQuiz
              ? "btn btn_disabled"
              : "btn"
          }
        >
          {isFinal ? "Completed" : "Next"}
        </button>
      </div>

      <PopUp
        show={showCongrats}
        onClose={() => {
          setShowCongrats(false);
          navigate(`/program/${programId}/final-quiz`);
        }}
        message="🎉 You completed all modules! Time for the final quiz!"
        type="success"
      />
    </div>
  );
}
