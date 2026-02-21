import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  Loader2,
  Clock,
  RefreshCw
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QuizPage() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId, moduleId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/courses/${courseId}`);
      setCourse(response.data);
      
      const foundModule = response.data.modules.find(m => m.id === moduleId);
      if (foundModule && foundModule.quiz) {
        setModule(foundModule);
        setQuiz(foundModule.quiz);
      } else {
        toast.error("Quiz not found");
        navigate(`/course/${courseId}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load quiz");
      navigate(`/course/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API}/courses/${courseId}/quiz/${moduleId}/submit`,
        { answers }
      );
      setResult(response.data);
      setSubmitted(true);
      
      if (response.data.passed) {
        toast.success(`Congratulations! You passed with ${response.data.percentage}%!`);
      } else {
        toast.error(`You scored ${response.data.percentage}%. You need 70% to pass.`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setCurrentQuestion(0);
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  // Results view
  if (submitted && result) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center"
        >
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
            result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {result.passed ? (
              <Trophy className="w-10 h-10 text-green-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-400" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-2" data-testid="quiz-result-title">
            {result.passed ? "Congratulations!" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {result.passed 
              ? "You've successfully completed this quiz." 
              : "You didn't pass this time, but you can try again."}
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <p className="text-2xl font-bold">{result.score}/{result.total}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Percentage</p>
              <p className={`text-2xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result.percentage.toFixed(0)}%
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className={`text-2xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                {result.passed ? "Passed" : "Failed"}
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4">Question Review</h3>
            <div className="space-y-4">
              {result.feedback.map((item, index) => (
                <div 
                  key={item.question_id}
                  className={`p-4 rounded-xl border ${
                    item.is_correct 
                      ? 'bg-green-500/5 border-green-500/20' 
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.is_correct ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">Q{index + 1}: {item.question}</p>
                      {!item.is_correct && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Your answer: {quiz.questions[index].options[item.user_answer]}
                        </p>
                      )}
                      <p className="text-sm text-green-400 mb-1">
                        Correct answer: {quiz.questions[index].options[item.correct_answer]}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {!result.passed && (
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="rounded-full"
                data-testid="btn-retry-quiz"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Link to={`/course/${courseId}`}>
              <Button className="rounded-full btn-glow" data-testid="btn-back-to-course">
                Back to Course
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to={`/course/${courseId}`} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-2" data-testid="quiz-title">
          {quiz.title}
        </h1>
        <p className="text-muted-foreground mt-1">{module.title}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-muted-foreground">
            {Object.keys(answers).length} answered
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {quiz.questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(index)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
              currentQuestion === index 
                ? 'bg-primary text-white' 
                : answers[q.id] !== undefined 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
            data-testid={`question-nav-${index}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-xl font-semibold mb-6" data-testid="current-question">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, index)}
                  className={`quiz-option w-full text-left ${isSelected ? 'selected' : ''}`}
                  data-testid={`option-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={isSelected ? 'text-primary' : ''}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="rounded-full"
          data-testid="btn-prev-question"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="rounded-full btn-glow"
            data-testid="btn-next-question"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < quiz.questions.length}
            className="rounded-full btn-glow"
            data-testid="btn-submit-quiz"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
