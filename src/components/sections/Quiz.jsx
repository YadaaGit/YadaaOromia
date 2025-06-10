import { useState } from 'react';

export default function Quiz({ questions = [], onPassed }) {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: parseInt(value) });
  };

  const handleSubmit = () => {
    const allCorrect = questions.every(q => answers[q.id] === q.answer);

    if (allCorrect) {
      setSubmitted(true);
      onPassed();
      setError('');
    } else {
      setError('Please answer all questions correctly to continue.');
    }
  };

  if (!questions.length) return null;

  return (
    <div className="border-t mt-4 pt-4">
      <h4 className="font-semibold mb-2">Quiz</h4>
      {questions.map(q => (
        <div key={q.id} className="mb-4">
          <p className="font-medium">{q.question}</p>
          {q.options.map((opt, idx) => (
            <label key={idx} className="block mt-1">
              <input
                type="radio"
                name={`question-${q.id}`}
                value={idx}
                disabled={submitted}
                onChange={() => handleChange(q.id, idx)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      {!submitted && (
        <button onClick={handleSubmit} className="btn mt-3">
          Submit Quiz
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
