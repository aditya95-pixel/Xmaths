"use client";
import React, { useEffect, useState, useCallback} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function PerformanceGraph({ history }) {
  if (!history || history.length === 0) return null;

  const chartData = [...history].reverse();
  
  const data = {
    labels: chartData.map(res => 
      new Date(res.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: chartData.map(res => Math.round(res.accuracy)),
        fill: true,
        borderColor: '#3b82f6', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4, // Smoothing
        pointBackgroundColor: '#3b82f6',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for a cleaner look
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Accuracy: ${context.parsed.y}%`
        }
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)', // Light grid lines
        },
        ticks: {
          stepSize: 20,
          color: '#94a3b8',
        },
      },
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  return (
    <div className="mt-8 mb-10 p-6 bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/50 rounded-3xl backdrop-blur-sm shadow-sm">
      <div style={{ height: '250px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

function MCQPage() {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSelections, setUserSelections] = useState({});
  const [visibleAnswers, setVisibleAnswers] = useState({});
  const [quizState, setQuizState] = useState('idle'); // 'idle' | 'active' | 'completed'
  const [history, setHistory] = useState([]);

  const renderMath = (text) => {
    if (!text) return "";
    const parts = text.split('$');
    return parts.map((part, i) => (
      i % 2 === 1 ? <InlineMath key={i} math={part} /> : part
    ));
  };

  // Abstracted fetch to reuse it after quiz completion
  const fetchHistory = useCallback(async () => {
      try {
        // Pass the subject as a query parameter
        const subject = "Algorithms";
        const res = await fetch(`/api/results?subject=${encodeURIComponent(subject)}`);
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const mcqRes = await fetch(`/api/mcqs?subject=Algorithms`);
        const mcqData = await mcqRes.json();
        setMcqs(mcqData);
        await fetchHistory();
      } catch (error) {
        console.error("Initial fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [fetchHistory]);

  const startQuiz = () => {
    setUserSelections({});
    setVisibleAnswers({});
    setQuizState('active');
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((q) => {
      const selectedIdx = userSelections[q._id];
      if (selectedIdx !== undefined && q.options[selectedIdx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const handleFinishQuiz = async () => {
    const finalScore = calculateScore();
    const total = mcqs.length;

    try {
      // 1. Send the data FIRST
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          score: finalScore,
          totalQuestions: total,
          subject: "Algorithms"
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // 2. Refresh history so the new result is available
      await fetchHistory();
      
      // 3. ONLY THEN move to completion screen
      setQuizState('completed');
    } catch (error) {
      console.error("Critical: Failed to save result:", error);
      // Optional: Show a toast or alert here
      setQuizState('completed'); // Still move forward so user isn't stuck
    }
  };

  const handleOptionClick = (questionId, optionIndex) => {
    if (userSelections[questionId] !== undefined) return;
    setUserSelections(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const toggleAnswer = (id) => {
    setVisibleAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#171717] transition-colors duration-500 p-8 ml-0 md:ml-20">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* --- IDLE STATE: START SCREEN --- */}
        {quizState === 'idle' && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Algorithms Quiz</h1>
              <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md">
                Ready to test your knowledge on {mcqs.length} core concepts? 
                Your final score will be calculated at the end.
              </p>
              <button 
                onClick={startQuiz}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Start Quiz
              </button>
            </motion.div>

            {/* --- PREVIOUS ATTEMPTS --- */}
            {history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-12 w-full max-w-md mx-auto"
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-6 text-center">
                  Recent Performance
                </h3>
                <PerformanceGraph history={history} />
                <div className="space-y-3">
                  {history.map((res) => (
                    <div 
                      key={res._id} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                          {res.score} / {res.totalQuestions} Correct
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase">
                          {new Date(res.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-lg font-black ${res.accuracy > 70 ? 'text-emerald-500' : 'text-blue-500'}`}>
                          {Math.round(res.accuracy)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* --- ACTIVE STATE: THE QUIZ --- */}
        {quizState === 'active' && (
          <>
            <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">In Progress...</h1>
                <p className="mt-2 text-slate-500 dark:text-gray-400">
                  Answered {Object.keys(userSelections).length} of {mcqs.length}
                </p>
              </div>
              {Object.keys(userSelections).length === mcqs.length && (
                <button 
                  onClick={handleFinishQuiz}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Finish Quiz
                </button>
              )}
            </motion.header>

            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {mcqs.map((q, index) => {
                  const selectedIdx = userSelections[q._id];
                  const isAnswered = selectedIdx !== undefined;

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={q._id}
                      className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg">{q.topic}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 leading-relaxed">
                        <span className="text-slate-400 mr-2">{index + 1}.</span>
                        {renderMath(q.question)}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {q.options.map((opt, i) => {
                          const isCorrect = opt === q.answer;
                          const isSelected = selectedIdx === i;
                          let bgColor = "bg-slate-50/50 dark:bg-zinc-800/30";
                          let borderColor = "border-slate-100 dark:border-zinc-800";

                          if (isAnswered) {
                            if (isCorrect) {
                              bgColor = "bg-emerald-50 dark:bg-emerald-500/20";
                              borderColor = "border-emerald-500";
                            } else if (isSelected) {
                              bgColor = "bg-rose-50 dark:bg-rose-500/20";
                              borderColor = "border-rose-500";
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={isAnswered}
                              onClick={() => handleOptionClick(q._id, i)}
                              className={`flex items-center p-4 border rounded-2xl transition-all duration-200 text-left ${bgColor} ${borderColor} ${!isAnswered ? 'hover:border-blue-400 cursor-pointer' : 'cursor-default'}`}
                            >
                              <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs mr-4 ${isSelected ? 'bg-blue-600 text-white' : 'bg-white dark:bg-zinc-700 text-blue-600'}`}>
                                {String.fromCharCode(65 + i)}
                              </span> 
                              <div className="text-slate-700 dark:text-gray-300">{renderMath(opt)}</div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-6">
                        <button onClick={() => toggleAnswer(q._id)} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:opacity-80">
                          {visibleAnswers[q._id] ? "HIDE EXPLANATION" : "VIEW EXPLANATION"}
                        </button>
                      </div>

                      <AnimatePresence>
                        {visibleAnswers[q._id] && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-slate-600 dark:text-slate-300 text-sm italic border-l-4 border-blue-400">
                              <strong>Note:</strong> The correct answer is {renderMath(q.answer)}.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* --- COMPLETED STATE: SCORE SUMMARY --- */}
        {quizState === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-2xl"
          >
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h2>
            <p className="text-slate-500 dark:text-gray-400 mb-8">Great job on finishing the Data Structures module.</p>
            
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-6 mb-8">
              <p className="text-sm uppercase tracking-widest font-black text-slate-400 mb-1">Your Score</p>
              <div className="text-6xl font-black text-blue-600 dark:text-blue-400">
                {calculateScore()} <span className="text-2xl text-slate-400">/ {mcqs.length}</span>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">
                Accuracy: {Math.round((calculateScore() / mcqs.length) * 100)}%
              </p>
            </div>

            <button 
              onClick={() => setQuizState('idle')}
              className="px-6 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
            >
              Back to Overview
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MCQPage;