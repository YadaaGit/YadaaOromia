import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Questions({
  questions = [],
  onFinish,
  program_title,
  pass_grade,
}) {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleSelect = (qIndex, selectedIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: selectedIndex }));
  };

  const handleSubmit = () => {
    const total = questions.length;
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0
    );
    const score = Math.round((correct / total) * 100);

    onFinish(score);

    navigate(`/courses`, {
      state: {
        type: "passed_final_quiz",
        score: score,
        pass_grade: pass_grade,
        program_title: program_title,
      },
    });
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h4 className="text-2xl font-semibold mb-6 text-gray-800">Questions</h4>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-8">
          <p className="text-lg font-medium text-gray-800 mb-3">{q.question}</p>
          <div className="flex flex-col gap-3">
            {q.options.map((opt, idx) => {
              const isSelected = answers[qIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(qIndex, idx)}
                  className={`p-3 text-left rounded-xl border text-gray-700 transition-all duration-200 hover:bg-blue-50 focus:outline-none ${
                    isSelected
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                  style={
                    !isSelected
                      ? { backgroundColor: "#f6f3f4" }
                      : {
                          backgroundColor: "#4f4f4f78",
                          border: "2px solid #313131ff",
                        }
                  }
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-6 mb-6 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition btn-primary"
        style={{
          width: "50%",
          border: "2px solid #313131ff",
          color: "white",
          fontWeight: "bolder",
        }}
      >
        Finish Quiz
      </button>
    </div>
  );
}
