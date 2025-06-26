import React, { useState, useEffect } from "react";
import { Home, Award, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { NavigationProps, AnswersState, ValidatedState } from "../types";
import { excelFunctions, leaderboardData } from "./excelFunctionsData";
import { formatGlobalTime } from "./utils";
import Timer from "./Timer";
import FunctionCard from "./FunctionCard";
import Passport from "./Passport";
import Leaderboard from "./Leaderboard";

const ExcelSpeedDating = ({ navigateTo }: NavigationProps) => {
  const [currentFunctionIndex, setCurrentFunctionIndex] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro, video, exercise, trick, complete
  const [timeLeft, setTimeLeft] = useState(60); // seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedFunctions, setCompletedFunctions] = useState<number[]>([]);
  const [showPassport, setShowPassport] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [answers, setAnswers] = useState<AnswersState>({
    answer1: "",
    answer2: "",
  });
  const [validated, setValidated] = useState<ValidatedState>({
    answer1: false,
    answer2: false,
  });
  const [userName, setUserName] = useState("Vous");
  const [globalTimer, setGlobalTimer] = useState(0); // secondes
  const [globalTimerRunning, setGlobalTimerRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Timer effect pour le timer de phase
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false);
      if (phase === "video") {
        setPhase("exercise");
        setTimeLeft(180); // 3 minutes for exercise
      } else if (
        phase === "exercise" &&
        validated.answer1 &&
        validated.answer2
      ) {
        setPhase("trick");
        setTimeLeft(60); // 1 minute for trick
      } else if (phase === "trick") {
        completeFunction();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    timerRunning,
    timeLeft,
    phase,
    currentFunctionIndex,
    completedFunctions,
    validated,
  ]);

  // Timer global qui compte le temps total
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (globalTimerRunning) {
      interval = setInterval(() => {
        setGlobalTimer((time) => time + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [globalTimerRunning]);

  // Vérifier si les deux réponses sont validées
  useEffect(() => {
    if (validated.answer1 && validated.answer2 && phase === "exercise") {
      setPhase("trick");
      setTimeLeft(60);
      setTimerRunning(true);
    }
  }, [validated, phase]);

  const startSession = () => {
    setPhase("video");
    setTimeLeft(60);
    setTimerRunning(true);

    // Démarrer le timer global au premier démarrage
    if (!sessionStarted) {
      setGlobalTimerRunning(true);
      setSessionStarted(true);
    }
  };

  const skipVideo = () => {
    setPhase("exercise");
    setTimeLeft(180);
    setTimerRunning(true);

    // Démarrer le timer global au premier skip
    if (!sessionStarted) {
      setGlobalTimerRunning(true);
      setSessionStarted(true);
    }
  };

  const resetTimer = () => {
    if (phase === "video") {
      setTimeLeft(60);
    } else if (phase === "exercise") {
      setTimeLeft(180);
    } else if (phase === "trick") {
      setTimeLeft(60);
    }
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const completeFunction = () => {
    // Marquer la fonction comme complétée si elle ne l'est pas déjà
    if (!completedFunctions.includes(currentFunctionIndex)) {
      setCompletedFunctions((prev) => [...prev, currentFunctionIndex]);
    }

    // Passer à la phase "complete"
    setPhase("complete");
    setTimerRunning(false);
  };

  const nextFunction = () => {
    if (currentFunctionIndex < excelFunctions.length - 1) {
      setCurrentFunctionIndex(currentFunctionIndex + 1);
      setPhase("intro");
      setTimerRunning(false);
      setAnswers({ answer1: "", answer2: "" });
      setValidated({ answer1: false, answer2: false });
    }
  };

  const prevFunction = () => {
    if (currentFunctionIndex > 0) {
      setCurrentFunctionIndex(currentFunctionIndex - 1);
      setPhase("intro");
      setTimerRunning(false);
      setAnswers({ answer1: "", answer2: "" });
      setValidated({ answer1: false, answer2: false });
    }
  };

  const togglePassport = () => {
    setShowPassport(!showPassport);
    if (showLeaderboard) setShowLeaderboard(false);
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
    if (showPassport) setShowPassport(false);
  };

  const handleAnswerChange = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
  };

  const validateAnswer = (field: string) => {
    // Dans cette V1, "BearingPoint" est la réponse correcte pour tous les champs
    if (answers[field] === "BearingPoint") {
      setValidated({ ...validated, [field]: true });
    }
  };

  const currentFunction = excelFunctions[currentFunctionIndex];
  const progressPercentage =
    (completedFunctions.length / excelFunctions.length) * 100;

  // Données utilisateur pour le leaderboard
  const userLeaderboardData = [
    ...leaderboardData,
    {
      name: userName,
      completed: completedFunctions.length,
      completedFunctions: completedFunctions,
      totalTime: sessionStarted ? formatGlobalTime(globalTimer) : "Non démarré",
    },
  ];

  // Render leaderboard overlay
  if (showLeaderboard) {
    return (
      <Leaderboard
        leaderboardData={userLeaderboardData}
        functions={excelFunctions}
        userName={userName}
        toggleLeaderboard={toggleLeaderboard}
      />
    );
  }

  // Render passport overlay
  if (showPassport) {
    return (
      <Passport
        functions={excelFunctions}
        completedFunctions={completedFunctions}
        togglePassport={togglePassport}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="fixed top-4 right-4 z-10">
          <div className="bg-indigo-700 rounded-full px-4 py-2 flex items-center gap-2">
            <Clock size={20} />
            <span className="font-mono font-bold">
              {sessionStarted ? formatGlobalTime(globalTimer) : "00:00"}
            </span>
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo("menu")}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-md"
            >
              <Home size={20} />
              Menu
            </button>

            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              Excel Avancé <span className="text-yellow-400">Speed Dating</span>
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleLeaderboard}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-md"
            >
              <Award size={20} />
              Leaderboard
            </button>

            <button
              onClick={togglePassport}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-md"
            >
              <Award size={20} />
              Passeport
            </button>

            <div className="bg-blue-800 rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium">
                {completedFunctions.length}/{excelFunctions.length} Fonctions
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden">
          {/* Function Navigation */}
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <button
              onClick={prevFunction}
              disabled={currentFunctionIndex === 0}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                currentFunctionIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              <ChevronLeft size={20} />
              Précédent
            </button>

            <div className="flex items-center gap-2">
              {excelFunctions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentFunctionIndex
                      ? "bg-blue-600"
                      : completedFunctions.includes(index)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            <button
              onClick={nextFunction}
              disabled={currentFunctionIndex === excelFunctions.length - 1}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                currentFunctionIndex === excelFunctions.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Suivant
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Function Content */}
          <div className="p-6">
            {/* Function Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="text-6xl">{currentFunction.avatar}</div>
                <div>
                  <h2 className="text-3xl font-bold">{currentFunction.name}</h2>
                  <p className="text-xl text-blue-600 font-medium">
                    {currentFunction.superpower}
                  </p>
                </div>
              </div>

              {/* Timer */}
              <Timer
                timeLeft={timeLeft}
                timerRunning={timerRunning}
                toggleTimer={toggleTimer}
                resetTimer={resetTimer}
              />
            </div>

            {/* Phase Content */}
            <FunctionCard
              currentFunction={currentFunction}
              phase={phase}
              answers={answers}
              validated={validated}
              handleAnswerChange={handleAnswerChange}
              validateAnswer={validateAnswer}
              startSession={startSession}
              skipVideo={skipVideo}
              nextFunction={nextFunction}
              completeFunction={completeFunction}
              functionsLength={excelFunctions.length}
              currentFunctionIndex={currentFunctionIndex}
              togglePassport={togglePassport}
            />

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(() => {
                    if (phase === "intro") return "0%";
                    if (phase === "video") return "25%";
                    if (phase === "exercise") return "50%";
                    if (phase === "trick") return "75%";
                    if (phase === "complete") return "100%";
                    return "0%";
                  })()}`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelSpeedDating;
