import React, { useState } from "react";
import { SectionType } from "./types";
import MainMenu from "./MainMenu/MainMenu";
import ExcelSpeedDating from "./SpeedDating/ExcelSpeedDating";
import BestPracticesSection from "./BestPractices/BestPracticesSection";
import UseCasesSection from "./UseCases/UseCasesSection";
import WorkInProgressSection from "./WorkInProgress/WorkInProgressSection";
import HackathonContainer from "./Hackathon/HackathonContainer";

// Composant principal qui gère la navigation entre les sections
const ExcelTraining: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<SectionType>("menu");

  const navigateTo = (section: SectionType) => {
    setCurrentSection(section);
  };

  // Rendu conditionnel basé sur la section courante
  switch (currentSection) {
    case "menu":
      return <MainMenu navigateTo={navigateTo} />;
    case "functions":
      return <ExcelSpeedDating navigateTo={navigateTo} />;
    case "bestPractices":
      return <BestPracticesSection navigateTo={navigateTo} />;
    case "hackathon":
      return (
        <WorkInProgressSection
          title="Hackathon: Le Dossier Perdu"
          navigateTo={navigateTo}
        />
      );
    case "hackathonLanding":
      return <HackathonContainer navigateTo={navigateTo} />;
    case "useCases":
      return <UseCasesSection navigateTo={navigateTo} />;
    default:
      return <MainMenu navigateTo={navigateTo} />; // Fallback
  }
};

export default ExcelTraining;
