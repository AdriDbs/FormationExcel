import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Users,
  FileText,
  Award,
  Calendar,
  Power,
  AlertTriangle,
} from "lucide-react";
import { NavigationProps } from "../types";
import SessionSelector from "./SessionSelector";
import { useHackathon } from "./context/HackathonContext";
import {
  hackathonLevels,
  fetchInitialState,
} from "./services/hackathonService";

interface HackathonLandingProps extends NavigationProps {
  setHackathonView: (view: string) => void;
}

const HackathonLanding = ({
  navigateTo,
  setHackathonView,
}: HackathonLandingProps) => {
  const { state, endCurrentSession, setNotification } = useHackathon();
  const { sessionId, sessionActive } = state;
  const [showSessionSelector, setShowSessionSelector] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Calculer la durée totale du hackathon
  const totalDuration = hackathonLevels.reduce(
    (sum, level) => sum + level.timeAllocation,
    0
  );

  // Formater la durée totale en heures et minutes
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    return `${hours > 0 ? `${hours}h` : ""}${
      minutes > 0 ? `${minutes}min` : ""
    }`;
  };

  // NOUVEAU: S'assurer que les données sont à jour lorsqu'on arrive sur cette page
  useEffect(() => {
    const refreshData = async () => {
      if (sessionId) {
        try {
          await fetchInitialState();
        } catch (error) {
          console.error("Error refreshing data on landing page:", error);
        }
      }
    };

    refreshData();
  }, [sessionId]);

  // Gérer la fin d'une session
  const handleEndSession = async () => {
    if (!sessionId) return;

    if (
      window.confirm(
        "Êtes-vous sûr de vouloir terminer cette session ? Cette action est irréversible."
      )
    ) {
      setIsEndingSession(true);
      try {
        const result = await endCurrentSession();
        if (result) {
          setNotification("Session terminée avec succès", "success");
        } else {
          setNotification(
            "Erreur lors de la terminaison de la session",
            "error"
          );
        }
      } catch (error) {
        setNotification("Erreur lors de la terminaison de la session", "error");
      } finally {
        setIsEndingSession(false);
      }
    }
  };

  // Naviguer vers une vue avec un délai pour s'assurer que les données sont bien chargées
  const handleNavigate = (view: string) => {
    // Petite délai pour s'assurer que le contexte est bien mis à jour
    setTimeout(() => {
      setHackathonView(view);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigateTo("menu")}
          className="mb-8 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-md"
        >
          <ArrowLeft size={20} />
          Retour au menu
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Hackathon Excel:{" "}
            <span className="text-yellow-400">Le Dossier Perdu 2.0</span>
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Bienvenue dans notre défi Excel. Utilisez vos compétences avancées
            pour résoudre l'énigme du dossier perdu et découvrez les secrets
            qu'il contient !
          </p>

          {sessionId && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="bg-purple-800 inline-block px-4 py-2 rounded-lg flex items-center gap-2">
                <span
                  className={sessionActive ? "text-green-400" : "text-red-400"}
                >
                  ●
                </span>
                Session {sessionActive ? "active" : "terminée"}:{" "}
                <span className="font-mono">
                  {sessionId.substring(0, 10)}...
                </span>
              </div>

              {sessionActive && (
                <button
                  onClick={handleEndSession}
                  disabled={isEndingSession}
                  className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  {isEndingSession ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">◌</span>
                      Terminaison...
                    </span>
                  ) : (
                    <>
                      <Power size={16} />
                      Terminer la session
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {showSessionSelector ? (
          <SessionSelector
            goBackToLanding={() => setShowSessionSelector(false)}
          />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* Carte d'information sur le hackathon */}
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">🔍</div>
                  <h2 className="text-xl font-bold">Le Dossier Perdu</h2>
                </div>
                <p className="text-purple-200 mb-4">
                  Un client important, la société Nexus, attend une présentation
                  cruciale demain matin. Votre collègue senior a dû partir en
                  urgence et a sécurisé tous ses fichiers avec un système
                  d'énigmes basé sur Excel.
                </p>
                <div className="flex items-center gap-3 text-yellow-300 mt-4">
                  <Calendar size={20} />
                  <span>Durée totale: {formatTotalDuration()}</span>
                </div>
              </div>

              {/* Carte présentant les niveaux */}
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">📊</div>
                  <h2 className="text-xl font-bold">Structure du défi</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
                    <p>
                      Phase 1: Data Cleaning (
                      {hackathonLevels[0].timeAllocation}min)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    <p>
                      Phase 2: Data Analysis (
                      {hackathonLevels
                        .slice(1, 6)
                        .reduce((sum, level) => sum + level.timeAllocation, 0)}
                      min)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
                    <p>
                      Phase 3: Data Visualization (
                      {hackathonLevels[6].timeAllocation}min)
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-purple-300">
                  {hackathonLevels.length} niveaux au total à compléter
                </div>
              </div>

              {/* Carte des points et récompenses */}
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">🏆</div>
                  <h2 className="text-xl font-bold">Système de points</h2>
                </div>
                <ul className="space-y-2 text-purple-200">
                  <li className="flex justify-between">
                    <span>Data Cleaning</span>
                    <span className="text-yellow-300">
                      {hackathonLevels[0].pointsValue} pts
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Niveaux d'analyse</span>
                    <span className="text-yellow-300">200 pts/niveau</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tableau de bord final</span>
                    <span className="text-yellow-300">
                      {hackathonLevels[6].pointsValue} pts
                    </span>
                  </li>
                  <li className="flex justify-between text-red-300">
                    <span>Utilisation d'indice</span>
                    <span>-25 pts</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-8">
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-6">🔍</div>
                <h2 className="text-2xl font-bold mb-4">
                  Choisissez votre interface
                </h2>

                <p className="text-center text-purple-200 mb-8 max-w-2xl">
                  Vous pouvez choisir entre l'interface étudiant qui vous
                  guidera étape par étape, ou l'interface globale qui sert
                  d'affichage lors du Hackathon.
                </p>

                {!sessionId ? (
                  <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4 mb-6 max-w-md">
                    <div className="flex items-center gap-2 text-yellow-300 mb-2">
                      <AlertTriangle size={20} />
                      <h3 className="font-bold">Aucune session active</h3>
                    </div>
                    <p className="text-yellow-200 text-sm">
                      Vous devez créer ou rejoindre une session de hackathon
                      pour accéder aux interfaces. Utilisez le bouton "Gérer les
                      sessions" ci-dessous.
                    </p>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                  <button
                    onClick={() => handleNavigate("student")}
                    disabled={!sessionActive}
                    className={`rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg flex items-center gap-4 ${
                      sessionActive
                        ? "bg-indigo-700 hover:bg-indigo-800 hover:translate-y-[-5px]"
                        : "bg-indigo-900/50 cursor-not-allowed opacity-70"
                    }`}
                  >
                    <div className="bg-indigo-600 p-3 rounded-full">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Interface Étudiant
                      </h3>
                      <p className="text-indigo-200">
                        Accédez à un parcours guidé avec des indices et des
                        étapes progressives
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate("global")}
                    disabled={!sessionActive}
                    className={`rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg flex items-center gap-4 ${
                      sessionActive
                        ? "bg-purple-700 hover:bg-purple-800 hover:translate-y-[-5px]"
                        : "bg-purple-900/50 cursor-not-allowed opacity-70"
                    }`}
                  >
                    <div className="bg-purple-600 p-3 rounded-full">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Interface Globale
                      </h3>
                      <p className="text-purple-200">
                        Affichage en salle du Hackathon et suivi des équipes
                      </p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setShowSessionSelector(true)}
                  className="mt-8 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 hover:shadow-md"
                >
                  Gérer les sessions
                </button>

                <div className="mt-12 text-sm text-purple-300 max-w-lg text-center">
                  <p>
                    Ce hackathon est conçu pour tester et améliorer vos
                    compétences Excel avancées dans un contexte proche des
                    missions réelles chez BearingPoint.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackathonLanding;
