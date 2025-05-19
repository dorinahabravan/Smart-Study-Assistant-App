import { useEffect, useState } from "react";
import axios from "axios";

const SubtopicDetailsPage = ({ topicId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`https://smart-study-assistant-app.onrender.com/quizzes/${topicId}`)
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err));
  }, [topicId]);

  const handleOptionChange = (qid, answer) => {
    setAnswers(prev => ({ ...prev, [qid]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isCorrect = (quiz) =>
    answers[quiz.id] && answers[quiz.id] === quiz.correct_answer;

  return (
    <div>
      <h3>Quiz</h3>
      {quizzes.map((quiz) => (
        <div key={quiz.id}>
          <p>{quiz.question}</p>
          {['a', 'b', 'c', 'd'].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={quiz.id}
                value={opt}
                onChange={() => handleOptionChange(quiz.id, opt)}
                disabled={submitted}
              />
              {quiz[`option_${opt}`]}
            </label>
          ))}
          {submitted && (
            <p style={{ color: isCorrect(quiz) ? "green" : "red" }}>
              {isCorrect(quiz) ? "✅ Correct" : `❌ Correct answer: ${quiz.correct_answer}`}
            </p>
          )}
          <hr />
        </div>
      ))}
      {!submitted && quizzes.length > 0 && (
        <button onClick={handleSubmit}>Submit Quiz</button>
      )}
      {submitted && quizzes.every(q => answers[q.id]) && (
        <button onClick={() => alert("Marked as Completed!")}>Mark as Completed</button>
      )}
    </div>
  );
};

export default SubtopicDetailsPage;
