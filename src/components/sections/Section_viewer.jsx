import { useState } from "react";
import Quiz from "./Quiz";

export default function SectionViewer({ sections = [], finalQuiz = null }) {
  const [current, setCurrent] = useState(0);
  const [passedQuiz, setPassedQuiz] = useState(false);

  const isFinal = current === sections.length;
  const content = isFinal ? null : sections[current];

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setPassedQuiz(false);
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
          <p className="mb-4 whitespace-pre-line text-gray-800 leading-relaxed">
            {content.content?.text}
          </p>
          {content.content?.media && (
            <img
              src={content.content.media}
              alt=""
              className="rounded-xl mb-6 w-full max-h-72 object-cover"
            />
          )}

          <Quiz
            key={`quiz-${current}`} // forces re-mount on section change
            questions={content.quiz?.map((q, i) => ({ id: i, ...q })) || []}
            onPassed={() => setPassedQuiz(true)}
          />
        </>
      )}

      {isFinal && finalQuiz && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-2">{finalQuiz.title}</h3>
          <p className="mb-4 text-gray-700">{finalQuiz.description}</p>
          <Quiz
            key="final-quiz"
            questions={finalQuiz.questions.map((q, i) => ({ id: i, ...q }))}
            onPassed={() => alert("🎉 You passed the final test!")}
          />
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={handlePrev} disabled={current === 0} className="btn">
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isFinal || (!passedQuiz && !isFinal)}
          className="btn"
        >
          {isFinal ? "Completed" : "Next"}
        </button>
      </div>
    </div>
  );
}
