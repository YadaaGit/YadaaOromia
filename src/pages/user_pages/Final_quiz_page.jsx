import { useParams, useNavigate } from "react-router-dom";
import { useProgramData } from "@/hooks/get_course_data_test.js";
import Quiz from "@/components/sections/Quiz.jsx";
import { useState } from "react";

export default function FinalQuizPage() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { program, loading } = useProgramData(programId);
  const [passed, setPassed] = useState(false);

  if (loading) return <div className="p-4 text-center">Loading final quiz...</div>;
  if (!program || !program.final_quiz) return <div className="p-4 text-center">Final quiz not found</div>;

  const handlePassed = () => {
    setPassed(true);
    // you can also update Firestore streak, lastActiveAt etc. here if you want
    setTimeout(() => navigate("/courses"), 2000); // redirect after 2 sec
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{program.final_quiz.quiz_title}</h2>
      <p className="mb-4 text-gray-700">{program.final_quiz.quiz_description}</p>

      <Quiz questions={program.final_quiz.questions} onPassed={handlePassed} />

      {passed && (
        <div className="mt-6 text-green-600 font-semibold text-center">
          🎉 You passed the final quiz! Redirecting...
        </div>
      )}
    </div>
  );
}
