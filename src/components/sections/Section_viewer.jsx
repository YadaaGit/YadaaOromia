import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "./Quiz";
import PopUp from "../basic_ui/pop_up.jsx";

export default function SectionViewer({
  sections = [],
  finalQuiz = null,
  scrollRef,
}) {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [passedQuiz, setPassedQuiz] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const isFinal = current === sections.length;
  const content = isFinal ? null : sections[current];

  // ✅ Memoize shuffled quiz questions per section
  const sectionQuestions = useMemo(() => {
    if (!content?.quiz) return [];
    return [...content.quiz]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((q, i) => ({ id: i, ...q }));
  }, [current]);

  const finalQuizQuestions = useMemo(() => {
    if (!finalQuiz?.questions) return [];
    return [...finalQuiz.questions]
      .sort(() => 0.5 - Math.random())
      .map((q, i) => ({ id: i, ...q }));
  }, [finalQuiz]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [current]);

  const handleNext = () => {
    if (isFinal) {
      setShowCongrats(true);
    } else {
      setCurrent((prev) => prev + 1);
      setPassedQuiz(false);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
    setPassedQuiz(true); // assume already passed if revisiting
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {!isFinal && content && (
        <>
          <h3 className="text-2xl font-bold mb-3">{content.title}</h3>
          {content.content.map((contents, index) => (
            <div key={index}>
              <h4 style={{ fontWeight: 900 }}>{contents.header}</h4>
              <p className="mb-4 whitespace-pre-line text-gray-800 leading-relaxed">
                {contents?.text}
              </p>
              {contents?.media && (
                <img
                  src={contents.media}
                  alt=""
                  className="rounded-xl mb-6 w-full max-h-72 object-cover"
                />
              )}
            </div>
          ))}

          <Quiz
            questions={sectionQuestions}
            onPassed={() => setPassedQuiz(true)}
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
          navigate("/courses");
        }}
        message="🎉 You passed the final test!"
        type="success"
      />
    </div>
  );
}
