// Types communs pour les composants ExcelTraining

// Type pour les sections
export type SectionType =
  | "menu"
  | "functions"
  | "bestPractices"
  | "hackathon"
  | "hackathonLanding"
  | "useCases";

// Type pour les vues du hackathon
export type HackathonViewType = "landing" | "student" | "global";

// Interface pour les props de navigation
export interface NavigationProps {
  navigateTo: (section: SectionType) => void;
}

// Interface pour les props de WorkInProgress
export interface WorkInProgressSectionProps extends NavigationProps {
  title: string;
}

// Interfaces pour les états avec indexation dynamique
export interface AnswersState {
  [key: string]: string;
}

export interface ValidatedState {
  [key: string]: boolean;
}

// Interface pour les données de fonction Excel
export interface ExcelFunction {
  name: string;
  avatar: string;
  superpower: string;
  description: string;
  exercise: string;
  exercisePrompt1: string;
  exercisePrompt2: string;
  trick: string;
}

// Interface pour les données du leaderboard
export interface LeaderboardParticipant {
  name: string;
  completed: number;
  completedFunctions: number[];
  totalTime: string;
}
