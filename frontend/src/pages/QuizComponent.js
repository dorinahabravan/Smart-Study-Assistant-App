import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip
} from "@mui/material";
import { Alert } from "@mui/material";

const QuizComponent = ({ topicId, onQuizCompleted, quizCompleted }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [finalScore, setFinalScore] = useState(null);

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
const pulseStyle = {
  animation: 'pulse 1.5s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.6,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
};

const handleQuizCompleted = (scorePercent) => {
  const token = localStorage.getItem("token");
  localStorage.setItem("needsProfileRefresh", "true");


  fetch("http://127.0.0.1:8000/api/user-progress/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topic_id: topicId,
      quiz_score: scorePercent, // ✅ use percent, not raw count
      completed: true,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Saved:", data);
      setFinalScore(scorePercent); // ✅ store for display
      onQuizCompleted();           // ✅ notify parent after storing
    });
};





  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/quizzes/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
          setCurrent(0); // Reset index when topic changes
          setSelected("");
          setAttempts(0);
setFinalScore(null);

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
  //if (quizCompleted) return <Typography>✅ Quiz completed!</Typography>;
 
  

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
      const final = correct ? score + 1 : score;
      const percent = Math.round((final / questions.length) * 100);
      const passed = final === questions.length;
      const isFirstAttempt = attempts === 0;
      const isFinalAttempt = attempts === 2;

      if (passed && isFirstAttempt) {
        // 🎯 All correct on first try → save 100%
        setFinalScore(100);
        handleQuizCompleted(100);
      } else if (!passed && !isFinalAttempt) {
        // ❌ Not passed → retry allowed
        setAttempts(prev => prev + 1);
        setQuizFailed(true);
        setResetting(true);
        resetQuiz();
      } else {
        // 🛑 Max attempts reached → save last attempt score
        setFinalScore(percent);
        handleQuizCompleted(percent);
      }
    }
  }, 1500);
};





  

  // Optional: Console log for debugging
  console.log("📋 Current question object:", q);

  return (
    <Box sx={{ mt: 3 }}>
      {/* Show attempt counter only during quiz */}
{!quizCompleted && (
  <Alert
    severity={attempts === 2 ? "error" : "warning"}
    sx={{
      mb: 2,
      fontWeight: "bold",
      ...(attempts === 2 ? pulseStyle : {}), // ✅ apply pulse only on last attempt
    }}
  >
     Attempt {attempts + 1} of 3
  </Alert>
)}
    {!quizCompleted && (
  <>
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
        </>
)}
      <Box sx={{ mt: 2 }}>
  <Chip
    label={quizCompleted ? "✅ Quiz Passed" : "🚧 In Progress"}
    color={quizCompleted ? "success" : "warning"}
  />
</Box>
{quizCompleted && finalScore !== null && (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" sx={{ color: "green", mb: 1 }}>
      ✅ Quiz completed!
    </Typography>
    <Typography variant="h6">
      🎯 Your Score: {finalScore}%
    </Typography>
    </Box>
)}

    </Box>

  );
};

export default QuizComponent;
