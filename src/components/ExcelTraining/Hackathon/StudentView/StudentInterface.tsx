import React, { useState, useEffect } from "react";
import {
  Clock,
  ArrowLeft,
  AlertCircle,
  FileText,
  Code,
  Lock,
  Users,
  Award,
  Download,
} from "lucide-react";
import { NavigationProps } from "../../types";
import { useHackathon } from "../context/HackathonContext";
import { registerStudent } from "../services/hackathonService";
import { hackathonLevels } from "../services/hackathonService";
import WaitingScreen from "./WaitingScreen";
import StudentExercise from "./StudentExercise";
import DownloadFilesOverlay from "./DownloadFilesOverlay";

interface StudentInterfaceProps extends NavigationProps {
  goBackToLanding: () => void;
}

// Mapper les icônes aux niveaux
const getLevelIcon = (levelId: number) => {
  switch (levelId) {
    case 0:
      return FileText;
    case 1:
      return Lock;
    case 2:
      return Code;
    case 3:
      return FileText;
    case 4:
      return FileText;
    case 5:
      return Code;
    case 6:
      return Award;
    default:
      return FileText;
  }
};

const StudentInterface = ({ goBackToLanding }: StudentInterfaceProps) => {
  // Utiliser le contexte Hackathon
  const {
    state,
    setNotification,
    setSessionId,
    setRegisteredStudent,
    checkSessionValidity,
  } = useHackathon();

  const {
    teams,
    timeLeft,
    notification,
    sessionId,
    registeredStudent,
    sessionActive,
    isSessionStarted,
    seconds,
  } = state;

  // État pour l'interface étudiant
  const [studentName, setStudentName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [localSessionId, setLocalSessionId] = useState("");
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [showDownloadOverlay, setShowDownloadOverlay] = useState(false);

  // Vérifier si on est dans les 5 dernières minutes
  useEffect(() => {
    setIsUrgent(timeLeft <= 5);
  }, [timeLeft]);

  // Écouter les événements de fin de session
  useEffect(() => {
    const handleSessionEnd = (event: CustomEvent) => {
      if (event.detail && event.detail.sessionId === sessionId) {
        setIsSessionEnded(true);
        setNotification("La session a été terminée", "error");
        setTimeout(() => {
          goBackToLanding();
        }, 3000);
      }
    };

    window.addEventListener(
      "hackathon_session_ended",
      handleSessionEnd as EventListener
    );

    return () => {
      window.removeEventListener(
        "hackathon_session_ended",
        handleSessionEnd as EventListener
      );
    };
  }, [sessionId, setNotification, goBackToLanding]);

  // Vérifier la validité de la session à l'entrée dans l'interface étudiant
  useEffect(() => {
    const validateSession = async () => {
      if (sessionId && registeredStudent) {
        const isValid = await checkSessionValidity();

        if (isValid) {
          setIsRegistered(true);
          setSelectedTeamId(registeredStudent.teamId);
          setStudentName(registeredStudent.name);
        } else {
          // La session n'est plus valide, retourner à l'écran d'inscription
          setIsRegistered(false);
          setRegisteredStudent(null);
        }
      } else {
        setIsRegistered(!!registeredStudent);

        if (registeredStudent) {
          setSelectedTeamId(registeredStudent.teamId);
          setStudentName(registeredStudent.name);
        }
      }
    };

    validateSession();
  }, [
    sessionId,
    registeredStudent,
    checkSessionValidity,
    setRegisteredStudent,
  ]);

  // Calculer la progression globale
  const getTeamData = () => {
    if (!selectedTeamId) return null;
    return teams.find((team) => team.id === selectedTeamId);
  };

  const teamData = getTeamData();

  // Formatter le temps restant avec les secondes
  const formatTime = (minutes: number, secs: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Gérer l'enregistrement d'un étudiant
  const handleRegisterStudent = async () => {
    if (!studentName || !selectedTeamId || !sessionId) return;

    try {
      const student = await registerStudent(
        studentName,
        selectedTeamId,
        sessionId
      );
      setRegisteredStudent(student);
      setIsRegistered(true);
      setNotification(
        `Bienvenue ${studentName} ! Vous avez rejoint ${
          teams.find((t) => t.id === selectedTeamId)?.name
        }`,
        "success"
      );
    } catch (error) {
      console.error("Error registering student:", error);
      setNotification("Erreur lors de l'enregistrement", "error");
    }
  };

  // Joindre une session existante
  const joinSession = () => {
    if (localSessionId) {
      setSessionId(localSessionId);
    }
  };

  // Si la session est terminée, rediriger vers la landing page
  if (isSessionEnded || !sessionActive) {
    return (
      <div className="bg-gray-900 min-h-screen text-white p-6 flex items-center justify-center">
        <div className="bg-red-900/50 max-w-md p-8 rounded-xl text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-4">Session terminée</h2>
          <p className="mb-6">
            Cette session a été terminée par l'administrateur.
          </p>
          <button
            onClick={goBackToLanding}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Retourner à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Afficher l'écran d'enregistrement si l'utilisateur n'est pas enregistré
  if (!isRegistered) {
    return (
      <div className="bg-gray-900 min-h-screen text-white p-6">
        <button
          onClick={goBackToLanding}
          className="mb-8 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-md absolute top-4 left-4 z-20"
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </button>

        <div className="fixed inset-0 bg-grid opacity-20 z-0"></div>

        <div className="max-w-md mx-auto mt-20 bg-gray-800 rounded-xl p-8 shadow-lg relative z-10">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Rejoindre un Hackathon
          </h1>

          {!sessionId ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  ID de session
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localSessionId}
                    onChange={(e) => setLocalSessionId(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Entrez l'ID de session..."
                  />
                  <button
                    onClick={joinSession}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Rejoindre
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Demandez l'ID de session à votre formateur
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Votre nom
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Entrez votre nom..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Choisissez votre équipe
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`
                        p-3 rounded-lg text-left flex items-center gap-3 transition-all
                        ${
                          selectedTeamId === team.id
                            ? "bg-indigo-700 border-2 border-indigo-500"
                            : "bg-gray-700 hover:bg-gray-600"
                        }
                      `}
                    >
                      <div className="bg-indigo-800 p-2 rounded-full">
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-gray-300">
                          {team.studentIds
                            ? `${team.studentIds.length} participants`
                            : "0 participants"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRegisterStudent}
                disabled={!studentName || !selectedTeamId}
                className={`
                  w-full py-3 rounded-lg font-bold text-center
                  ${
                    !studentName || !selectedTeamId
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                `}
              >
                Rejoindre l'équipe
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Afficher la page d'attente si l'utilisateur est enregistré mais que la session n'a pas commencé
  if (isRegistered && !isSessionStarted) {
    return (
      <WaitingScreen
        teamName={teamData?.name || ""}
        studentName={studentName}
        goBackToLanding={goBackToLanding}
      />
    );
  }

  // Interface principale une fois l'étudiant enregistré et la session démarrée
  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      {/* Bouton de retour */}
      <button
        onClick={goBackToLanding}
        className="mb-8 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-md absolute top-4 left-4 z-20"
      >
        <ArrowLeft size={20} />
        Retour à l'accueil
      </button>

      {/* Fond avec effet grille */}
      <div className="fixed inset-0 bg-grid opacity-20 z-0"></div>

      {/* En-tête et chronomètre */}
      <div className="text-center mb-6 relative z-10 pt-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Escape Excel: Le Dossier Perdu 2.0
        </h1>
        <h2 className="text-xl text-gray-300 mb-4">
          Interface Étudiant - {studentName} - {teamData?.name}
        </h2>

        <div className="flex items-center justify-center mt-4 mb-2">
          <div
            className={`
              flex items-center bg-gray-800 rounded-lg px-4 py-2 border shadow-lg
              ${
                isUrgent
                  ? "border-red-500 animate-pulse shadow-red-500/30"
                  : isSessionStarted
                  ? "border-green-500 shadow-green-500/30"
                  : "border-cyan-500"
              }
            `}
          >
            <Clock
              className={`mr-2 ${
                isUrgent
                  ? "text-red-500"
                  : isSessionStarted
                  ? "text-green-500"
                  : "text-cyan-400"
              }`}
            />
            <span
              className={`text-2xl font-mono ${
                isUrgent
                  ? "text-red-500"
                  : isSessionStarted
                  ? "text-green-500"
                  : "text-cyan-400"
              }`}
            >
              {formatTime(timeLeft, seconds)}
            </span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2 border border-purple-500 shadow-lg">
            <span className="text-xl font-medium text-purple-400">
              Score: {teamData?.score || 0}
            </span>
          </div>

          {/* Ajout du bouton de téléchargement */}
          <button
            onClick={() => setShowDownloadOverlay(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
          >
            <Download size={18} />
            Ressources
          </button>
        </div>
      </div>

      {/* Contenu principal du niveau actuel */}
      {teamData && (
        <StudentExercise
          teamData={teamData}
          getLevelIcon={getLevelIcon}
          hackathonLevels={hackathonLevels}
        />
      )}

      {/* Notification */}
      {notification.visible && (
        <div
          className={`
            fixed bottom-6 right-6 max-w-md p-4 rounded-lg shadow-lg z-50
            ${
              notification.type === "success"
                ? "bg-green-800 border-l-4 border-green-500"
                : notification.type === "hint"
                ? "bg-yellow-800 border-l-4 border-yellow-500"
                : "bg-red-800 border-l-4 border-red-500"
            }
          `}
        >
          {notification.message}
        </div>
      )}

      {/* Overlay de téléchargement de fichiers */}
      {showDownloadOverlay && (
        <DownloadFilesOverlay onClose={() => setShowDownloadOverlay(false)} />
      )}

      {/* CSS pour l'effet de grille en arrière-plan */}
      <style>
        {`
        .bg-grid {
          background-image: 
            linear-gradient(to right, rgba(25, 25, 35, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(25, 25, 35, 0.8) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        `}
      </style>
    </div>
  );
};

export default StudentInterface;
