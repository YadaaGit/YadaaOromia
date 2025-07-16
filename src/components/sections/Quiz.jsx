import { useEffect, useState } from "react";

export default function Quiz({ questions = [], onPassed }) {
  const [answered, setAnswered] = useState({});
  const [locked, setLocked] = useState({});
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    setAnswered({});
    setLocked({});
    setHasPassed(false);
  }, [questions]);

  const handleAnswer = (qid, selectedIndex) => {
    if (locked[qid]) return;

    setAnswered((prev) => ({ ...prev, [qid]: selectedIndex }));

    const question = questions.find((q) => q.id === qid);
    const isCorrect = selectedIndex === question.answer;

    setLocked((prev) => ({ ...prev, [qid]: true }));

    if (!isCorrect) {
      setTimeout(() => {
        setLocked((prev) => ({ ...prev, [qid]: false }));
        setAnswered((prev) => {
          const newState = { ...prev };
          delete newState[qid];
          return newState;
        });
      }, 2000);
    }
  };

  useEffect(() => {
    const allAnswered = questions.every((q) => answered[q.id] !== undefined);
    const allCorrect = questions.every((q) => answered[q.id] === q.answer);

    if (allAnswered && allCorrect && !hasPassed) {
      setHasPassed(true);
      onPassed();
    }
  }, [answered, hasPassed, questions, onPassed]);

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h4 className="text-2xl font-semibold mb-6 text-gray-800">Quiz</h4>
      {questions.map((q) => {
        const selectedIndex = answered[q.id];
        const isLocked = locked[q.id];

        return (
          <div key={q.id} className="mb-8">
            {/* Question */}
            <p className="text-lg font-medium text-gray-800 mb-3">{q.question}</p>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.answer;
                const isSelected = idx === selectedIndex;

                let base = "bg-white border-gray-300";
                if (isSelected && isCorrect) base = "bg-green-100 border-green-500";
                else if (isSelected && !isCorrect) base = "bg-red-100 border-red-500";
                else if (isLocked && !isSelected) base = "bg-gray-50 text-gray-400";

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(q.id, idx)}
                    disabled={isLocked}
                    className={`p-3 text-left rounded-xl border text-gray-700 transition-all duration-200 hover:bg-blue-50 focus:outline-none disabled:cursor-not-allowed ${base}`}
                    style={!isSelected || !isCorrect ? {backgroundColor: '#f6f3f4'}: {backgroundColor: '#f6f3f478'}}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {selectedIndex === q.answer && q.explanation && (
              <div className="mt-4 bg-gray-100 text-sm text-gray-700 p-4 rounded-xl border border-gray-200">
                <strong className="block mb-1 text-gray-800">Explanation:</strong>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
