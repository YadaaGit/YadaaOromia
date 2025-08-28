import { useEffect, useState } from "react";
import { useTranslation } from "@/utils/useTranslation.js";


export default function Quiz({ questions = [], onPassed }) {
  const [answered, setAnswered] = useState({});
  const [locked, setLocked] = useState({});
  const [permaLocked, setPermaLocked] = useState({});
  const [hasPassed, setHasPassed] = useState(false);
  const { t } = useTranslation();

  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [noneDisplayed, setNoneDisplayed] = useState([]);
  const [unanswered, setUnanswered] = useState([]);
  const [tempWrongExplanation, setTempWrongExplanation] = useState({});
  const [isCorrectTemp, setIsCorrectTemp] = useState({});

  // Shuffle helper
  const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

  // Initialize quiz
  useEffect(() => {
    const shuffled = shuffleArray(questions);

    setAnswered({});
    setLocked({});
    setPermaLocked({});
    setHasPassed(false);

    const initialDisplayed = shuffled.slice(0, 2);
    const initialNone = shuffled.slice(2);

    setDisplayedQuestions(initialDisplayed);
    setNoneDisplayed(initialNone);

    // Track unanswered by original index
    setUnanswered(shuffled.map((_, i) => i));
  }, [questions]);

  const handleAnswer = (slotIndex, selectedIndex) => {
    if (permaLocked[slotIndex] || locked[slotIndex]) return;

    const question = displayedQuestions[slotIndex];
    const qIndex = questions.indexOf(question);
    const isCorrect = selectedIndex === question.answer;
    setAnswered((prev) => ({ ...prev, [slotIndex]: selectedIndex }));
    setLocked((prev) => ({ ...prev, [slotIndex]: true }));

    if (isCorrect) {
      // Permanently lock the slot
      setIsCorrectTemp((prev) => ({ ...prev, [slotIndex]: true }));
      setPermaLocked((prev) => ({ ...prev, [slotIndex]: true }));
      setUnanswered((prev) => prev.filter((idx) => idx !== qIndex));
    } else {
      setTempWrongExplanation((prev) => ({ ...prev, [slotIndex]: true })); // show explanation temporarily for questions answered wrong
      setTimeout(() => {
        if (!permaLocked[slotIndex]) {
          let replacement = null;

          // If there are unused questions, pick from noneDisplayed
          if (noneDisplayed.length > 0) {
            replacement = noneDisplayed[0];
            setNoneDisplayed((prev) => prev.slice(1));
          } else {
            // If noneDisplayed empty, pick randomly from unanswered pool
            const unansweredPool = questions.filter((_, idx) =>
              unanswered.includes(idx)
            );

            if (unansweredPool.length > 0) {
              const randIndex = Math.floor(
                Math.random() * unansweredPool.length
              );
              replacement = unansweredPool[randIndex];
            }
          }

          // Replace the slot if we have a replacement
          if (replacement) {
            setDisplayedQuestions((prev) =>
              prev.map((q, i) => (i === slotIndex ? replacement : q))
            );
          }

          // Reset state for this slot so user can retry
          setAnswered((prev) => {
            const copy = { ...prev };
            delete copy[slotIndex];
            return copy;
          });
          setLocked((prev) => {
            const copy = { ...prev };
            delete copy[slotIndex];
            return copy;
          });
        }
        // Hide explanation after timeout
        setTempWrongExplanation((prev) => {
          const copy = { ...prev };
          delete copy[slotIndex];
          return copy;
        });
      }, 3000); // short feedback delay
    }
  };

  useEffect(() => {
    if (displayedQuestions.length === 0) return;

    const allAnswered = displayedQuestions.every(
      (_, i) => answered[i] !== undefined
    );
    const allCorrect = displayedQuestions.every(
      (q, i) => answered[i] === q.answer
    );

    if (allAnswered && allCorrect && !hasPassed) {
      setHasPassed(true);
      onPassed();
    }
  }, [answered, hasPassed, displayedQuestions, onPassed]);

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h4 className="text-2xl font-semibold mb-6 text-gray-800">Quiz</h4>
      {displayedQuestions.map((q, slotIndex) => {
        const selectedIndex = answered[slotIndex];
        const isLocked = locked[slotIndex] || permaLocked[slotIndex];
        return (
          <div key={slotIndex} className="mb-8">
            <p className="text-lg font-medium text-gray-800 mb-3">
              {q.question}
            </p>
            <div className="flex flex-col gap-3">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.answer;

                const isSelected = idx === selectedIndex;

                let base = "bg-white border-gray-300";
                if (isSelected && isCorrect)
                  base = "bg-green-100 border-green-500";
                else if (isSelected && !isCorrect)
                  base = "bg-red-100 border-red-500";
                else if (isLocked && !isSelected)
                  base = "bg-gray-50 text-gray-400";

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(slotIndex, idx)}
                    disabled={isLocked}
                    className={`p-3 text-left rounded-xl border text-gray-700 transition-all duration-200 hover:bg-blue-50 focus:outline-none disabled:cursor-not-allowed ${base}`}
                    style={
                      !isSelected || !isCorrect
                        ? { backgroundColor: "#f6f3f4" }
                        : { backgroundColor: "#f6f3f478" }
                    }
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {(permaLocked[slotIndex] || tempWrongExplanation[slotIndex]) && (
              <div
                className="mt-4 bg-gray-100 text-sm text-gray-700 p-4 rounded-xl border border-gray-200"
                style={
                  !isCorrectTemp[slotIndex]
                    ? { backgroundColor: "#ffa4c2ff" }
                    : { backgroundColor: "#76ff6a78" }
                }
              >
                <strong className="block mb-1 text-gray-800">
                  Correct Answer:
                </strong>
                {[t("A"), t("B"), t("C"), t("D")][q.answer]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
