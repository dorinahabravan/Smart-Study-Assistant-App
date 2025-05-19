import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const QuizComponent = ({ topicId, onQuizCompleted, quizCompleted }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
const [isCorrect, setIsCorrect] = useState(false);
const resetQuiz = () => {
  setTimeout(() => {
    setCurrent(0);
    setSelected("");
    setScore(0);
    setShowFeedback(false);
    setResetting(false); // allows quiz to start again
  }, 2000); // wait 2 seconds before reset
};

const [quizFailed, setQuizFailed] = useState(false);
const [resetting, setResetting] = useState(false);




  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/quizzes/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
          setCurrent(0); // Reset index when topic changes
          setSelected("");
          setScore(0);
        } else {
          console.error("❌ Unexpected quiz format:", data);
        }
      })
      .catch((err) => console.error("❌ Error fetching quiz:", err));
  }, [topicId]);

  useEffect(() => {
    if (!resetting) {
      const timer = setTimeout(() => setQuizFailed(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [resetting]);
  
  // Don't render if no questions or already completed
  if (!questions.length) return <Typography>No quiz available.</Typography>;
  if (quizCompleted) return <Typography>✅ Quiz completed!</Typography>;

  const q = questions[current];

  const handleNext = () => {
    const correct = selected === q.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);
  
    if (correct) {
      setScore(prev => prev + 1);
    }
  
    setTimeout(() => {
      const isLast = current + 1 === questions.length;
  
      if (!isLast) {
        setCurrent(prev => prev + 1);
        setSelected("");
        setShowFeedback(false);
      } else {
        if (correct && score + 1 === questions.length) {
          // All correct
          onQuizCompleted();
        } else {
          // ❌ Show fail message and reset
          setQuizFailed(true);
          setResetting(true);
          resetQuiz();
        }
      }
    }, 1500);
  };
  
  
  
  

  // Optional: Console log for debugging
  console.log("📋 Current question object:", q);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1">
        Question {current + 1} of {questions.length}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {q.question}
      </Typography>

      <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)} sx={{ mt: 1 }}>
  <FormControlLabel value="a" control={<Radio />} label={q.options.a} />
  <FormControlLabel value="b" control={<Radio />} label={q.options.b} />
  <FormControlLabel value="c" control={<Radio />} label={q.options.c} />
  <FormControlLabel value="d" control={<Radio />} label={q.options.d} />
</RadioGroup>

{quizFailed && (
  <Typography color="error" sx={{ mt: 2 }}>
    ❌ You must answer all questions correctly. Try again!
  </Typography>
)}


{showFeedback && (
  <Typography
    variant="subtitle2"
    color={isCorrect ? "green" : "red"}
    sx={{ mt: 1 }}
  >
    {isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
  </Typography>
)}



      <Button
        variant="contained"
        onClick={handleNext}
        disabled={!selected}
        sx={{ mt: 2 }}
      >
        {current + 1 === questions.length ? "Finish Quiz" : "Next"}
      </Button>
      
    </Box>

  );
};

export default QuizComponent;
