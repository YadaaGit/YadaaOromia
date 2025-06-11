import { useEffect, useState } from 'react';

export default function Quiz({ questions = [], onPassed }) {
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [answered, setAnswered] = useState({});       // Stores selected index
  const [locked, setLocked] = useState({});           // Tracks locked questions (true = can't be changed)

  useEffect(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 2));
    setAnswered({});
    setLocked({});
  }, [questions]);

  const handleAnswer = (qid, selectedIndex) => {
    if (locked[qid]) return;

    setAnswered((prev) => ({ ...prev, [qid]: selectedIndex }));

    const question = randomQuestions.find((q) => q.id === qid);
    const isCorrect = selectedIndex === question.answer;

    if (isCorrect) {
      setLocked((prev) => ({ ...prev, [qid]: true }));
    } else {
      setLocked((prev) => ({ ...prev, [qid]: true }));
      setTimeout(() => {
        setLocked((prev) => ({ ...prev, [qid]: false }));
        setAnswered((prev) => {
          const newState = { ...prev };
          delete newState[qid]; // allow fresh attempt
          return newState;
        });
      }, 2000);
    }

    const allAnswered = randomQuestions.every((q) =>
      selectedIndex === qid ? true : answered[q.id] !== undefined
    );

    const allCorrect = randomQuestions.every((q) =>
      (qid === q.id ? selectedIndex : answered[q.id]) === q.answer
    );

    if (allAnswered && allCorrect) onPassed();
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h4 className="text-lg font-semibold mb-4">Quiz</h4>

      {randomQuestions.map((q) => {
        const selectedIndex = answered[q.id];
        const isLocked = locked[q.id];

        return (
          <div key={q.id} className="mb-6">
            <p className="font-medium mb-2">{q.question}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.answer;
                const isSelected = idx === selectedIndex;

                let bg = 'bg-white';
                if (isSelected && isCorrect) bg = 'bg-green-100 border-green-500';
                else if (isSelected && !isCorrect) bg = 'bg-red-100 border-red-500';
                else if (isLocked && !isSelected) bg = 'opacity-50';

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(q.id, idx)}
                    disabled={isLocked}
                    className={`text-left p-3 rounded border transition-all ${bg} hover:bg-blue-50 disabled:cursor-not-allowed`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedIndex === q.answer && q.explanation && (
              <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-3 rounded">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
