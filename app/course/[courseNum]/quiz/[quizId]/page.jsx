"use client"

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "../../../../_components/NavBar";
import axios from "axios";

const QuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseNum, quizId } = params;
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [course, setCourse] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chapter, setChapter] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [previousAttempt, setPreviousAttempt] = useState(null);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  // Define submitQuiz using useCallback to avoid recreation on every render
  const submitQuiz = React.useCallback(async () => {
    try {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setLoading(true);
      
      // Filter out any unanswered questions
      const validAnswers = answers.filter(answer => 
        answer.questionId && answer.selectedOption !== null
      );
      
      const response = await axios.post(`/api/quizzes/${quizId}/submit`, {
        answers: validAnswers
      });
      
      // Handle case where user has exceeded max attempts
      if (!response.data.success && response.data.message && response.data.message.includes('maximum number of attempts')) {
        setAttemptsExceeded(true);
        setPreviousAttempt(response.data.existingAttempt);
        setResults({
          score: response.data.existingAttempt.score,
          totalQuestions: response.data.existingAttempt.totalQuestions,
          percentage: Math.round((response.data.existingAttempt.score / response.data.existingAttempt.totalQuestions) * 100),
          answers: response.data.existingAttempt.answers
        });
        setError(response.data.message);
        setLoading(false);
        return;
      }
      
      setResults(response.data);
      setQuizCompleted(true);
      setLoading(false);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
      setLoading(false);
    }
  }, [quizId, answers, timerRef]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        console.log('Fetching quiz data for quizId:', quizId);
        
        const response = await axios.get(`/api/quizzes/${quizId}`)
          .catch(error => {
            console.error('Axios error details:', {
              message: error.message,
              response: error.response ? {
                status: error.response.status,
                data: error.response.data
              } : 'No response',
              request: error.request ? 'Request was made but no response received' : 'No request',
              config: error.config
            });
            throw error;
          });
        
        console.log('Quiz API response:', response.data);
        
        // Make sure we have all the required data
        if (!response.data.quiz) {
          throw new Error('Quiz data is missing from the API response');
        }
        
        setQuiz(response.data.quiz);
        setQuestions(response.data.questions || []);
        setChapter(response.data.chapter);
        setCourse(response.data.course);
        
        // Check if user has a previous attempt
        if (response.data.previousAttempt) {
          console.log('Previous attempt found:', response.data.previousAttempt);
          setPreviousAttempt(response.data.previousAttempt);
          setQuizCompleted(true);
          setResults({
            score: response.data.previousAttempt.score,
            totalQuestions: response.data.previousAttempt.totalQuestions,
            percentage: Math.round((response.data.previousAttempt.score / response.data.previousAttempt.totalQuestions) * 100),
            answers: response.data.previousAttempt.answers
          });
          
          // Check if maximum attempts reached
          if (response.data.attemptsCount >= response.data.quiz.maxAttempts) {
            setAttemptsExceeded(true);
          }
        }
        
        // Initialize answers array with empty selections
        setAnswers(response.data.questions.map(() => ({ selectedOption: null })));
        
        // Set timer if quiz has time limit
        if (response.data.quiz.timeLimit > 0) {
          setTimeLeft(response.data.quiz.timeLimit * 60); // Convert minutes to seconds
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizId]);

  // Start timer when timeLeft is set
  useEffect(() => {
    if (timeLeft !== null && !quizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            submitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, quizCompleted, submitQuiz]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      questionId: questions[questionIndex]._id,
      selectedOption: optionIndex
    };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // The submitQuiz function has been moved to the top of the component using useCallback

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading && !quizCompleted) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="bg-red-100 p-4 rounded-md text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">نتائج الاختبار</h1>
            
            {attemptsExceeded && (
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 mb-4 text-center">
                لقد وصلت إلى الحد الأقصى لعدد المحاولات المسموح بها لهذا الاختبار
              </div>
            )}
            
            {previousAttempt && (
              <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-4 text-center">
                هذه نتيجة محاولتك السابقة للاختبار
              </div>
            )}
            
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-2 text-blue-600">
                {results.score} / {results.totalQuestions}
              </div>
              <div className="text-xl">
                النسبة المئوية: {results.percentage}%
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold">الإجابات الصحيحة والخاطئة:</h2>
              
              {questions.map((question, index) => {
                const answer = results.answers.find(a => a.questionId === question._id);
                return (
                  <div 
                    key={question._id} 
                    className={`p-4 rounded-lg ${
                      answer?.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="font-bold mb-2">{index + 1}. {question.question}</div>
                    
                    {question.imageUrl && (
                      <div className="mb-2">
                        <img 
                          src={question.imageUrl} 
                          alt={`صورة للسؤال ${index + 1}`} 
                          className="max-w-full h-auto rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded ${
                            option.isCorrect 
                              ? 'bg-green-100 border border-green-300' 
                              : answer?.selectedOption === optionIndex && !option.isCorrect
                                ? 'bg-red-100 border border-red-300'
                                : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {option.text}
                          {option.isCorrect && (
                            <span className="text-green-600 mr-2">
                              ✓ (الإجابة الصحيحة)
                            </span>
                          )}
                          {answer?.selectedOption === optionIndex && !option.isCorrect && (
                            <span className="text-red-600 mr-2">
                              ✗ (إجابتك)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => router.push(`/course/${courseNum}`)}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                العودة إلى الكورس
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{quiz?.title}</h1>
            
            {timeLeft !== null && (
              <div className={`text-xl font-mono ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Question */}
          <div className="mb-6">
            <div className="text-lg font-bold mb-4">
              {currentQuestion + 1}. {questions[currentQuestion]?.question}
            </div>
            
            {questions[currentQuestion]?.imageUrl && (
              <div className="mb-4">
                <img 
                  src={questions[currentQuestion].imageUrl} 
                  alt={`صورة للسؤال ${currentQuestion + 1}`} 
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
            
            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    answers[currentQuestion]?.selectedOption === index 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  {option.text}
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestion === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              السؤال السابق
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button 
                onClick={nextQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                السؤال التالي
              </button>
            ) : (
              <button 
                onClick={submitQuiz}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                إنهاء الاختبار
              </button>
            )}
          </div>
          
          {/* Question navigation */}
          <div className="mt-8">
            <div className="text-sm text-gray-500 mb-2">انتقل إلى سؤال:</div>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentQuestion === index 
                      ? 'bg-blue-500 text-white' 
                      : answers[index]?.selectedOption !== null
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Submit button */}
          <div className="mt-8 text-center">
            <button 
              onClick={submitQuiz}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
            >
              إنهاء الاختبار وإرسال الإجابات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
