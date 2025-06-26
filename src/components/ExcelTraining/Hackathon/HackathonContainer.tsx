import React, { useState, useEffect } from "react";
import { NavigationProps, HackathonViewType } from "../types";
import HackathonLanding from "./HackathonLanding";
import WorkInProgressSection from "../WorkInProgress/WorkInProgressSection";
import ScoreboardApp from "./Scoreboard/ScoreboardApp";
import StudentInterface from "./StudentView/StudentInterface";
import { HackathonProvider } from "./context/HackathonContext";

const HackathonContainer = ({ navigateTo }: NavigationProps) => {
  const [currentView, setCurrentView] = useState<HackathonViewType>("landing");

  // Simplification: pas d'état de chargement pour éviter les rendus excessifs
  // Fonction pour définir la vue courante du hackathon
  const setHackathonView = (view: string) => {
    if (view === "student" || view === "global") {
      // Simplement changer de vue, le chargement sera géré par les composants enfants
      setCurrentView(view as HackathonViewType);
    } else {
      setCurrentView("landing");
    }
  };

  // Fonction pour revenir à la landing page
  const goBackToLanding = () => {
    setCurrentView("landing");
  };

  // Écouter les événements de fin de session pour revenir à la landing page
  useEffect(() => {
    const handleSessionEnd = () => {
      // Revenir à la landing page si on n'y est pas déjà
      if (currentView !== "landing") {
        setCurrentView("landing");
      }
    };

    window.addEventListener("hackathon_session_ended", handleSessionEnd);

    return () => {
      window.removeEventListener("hackathon_session_ended", handleSessionEnd);
    };
  }, [currentView]);

  // Contenu à afficher selon la vue actuelle
  const renderContent = () => {
    if (currentView === "landing") {
      return (
        <HackathonLanding
          navigateTo={navigateTo}
          setHackathonView={setHackathonView}
        />
      );
    } else if (currentView === "student") {
      return (
        <StudentInterface
          navigateTo={navigateTo}
          goBackToLanding={goBackToLanding}
        />
      );
    } else if (currentView === "global") {
      return (
        <ScoreboardApp
          navigateTo={navigateTo}
          goBackToLanding={goBackToLanding}
        />
      );
    }

    // Fallback vers la landing page
    return (
      <HackathonLanding
        navigateTo={navigateTo}
        setHackathonView={setHackathonView}
      />
    );
  };

  // Encapsuler tout le contenu dans le provider pour partager l'état
  return <HackathonProvider>{renderContent()}</HackathonProvider>;
};

export default HackathonContainer;
