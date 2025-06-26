import React from "react";
import { BookOpen, CheckSquare, Code, FileText } from "lucide-react";
import { NavigationProps } from "../types";

// Composant pour le menu principal
const MainMenu = ({ navigateTo }: NavigationProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold mb-4">
            Formation Excel Avancé{" "}
            <span className="text-yellow-400">BearingPoint</span>
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Découvrez les fonctionnalités avancées d'Excel pour transformer vos
            analyses de données
          </p>

          <div className="max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">
              Objectifs de la formation
            </h2>
            <p className="text-white mb-4">
              Cette formation intensive vise à transformer votre maîtrise
              d'Excel en un véritable avantage concurrentiel. À l'issue de ce
              parcours, vous serez capable de :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">✓</div>
                <p>
                  Exploiter les formules dynamiques pour automatiser vos
                  analyses complexes et réduire votre temps de traitement par 10
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">✓</div>
                <p>
                  Manipuler des millions de lignes avec fluidité grâce aux
                  nouvelles fonctions de tableaux dynamiques
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">✓</div>
                <p>
                  Créer des dashboards interactifs impressionnants sans aucune
                  connaissance en VBA ou Power Query
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">✓</div>
                <p>
                  Résoudre des cas d'usage concrets issus des missions de
                  conseil avec des approches innovantes
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">✓</div>
                <p>
                  Optimiser vos classeurs pour une maintenance facile et des
                  performances accrues
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">✓</div>
                <p>
                  Impressionner vos clients avec des techniques d'analyse
                  inaccessibles à 95% des utilisateurs d'Excel
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Apprentissage de fonctions */}
          <div
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 hover:bg-blue-900/10 transition-all duration-300 cursor-pointer border border-blue-400 hover:border-blue-300"
            onClick={() => navigateTo("functions")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500 p-3 rounded-full transition-all duration-300">
                <BookOpen size={28} />
              </div>
              <h2 className="text-2xl font-bold">Apprentissage de Fonctions</h2>
            </div>
            <p className="mb-4 text-blue-200">
              Découvrez et maîtrisez les fonctions avancées d'Excel à travers
              des exercices pratiques et interactifs.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">
                13 fonctions à découvrir
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-md">
                Commencer l'apprentissage
              </button>
            </div>
          </div>

          {/* Section 2: Bonnes pratiques */}
          <div
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 hover:bg-green-900/10 transition-all duration-300 cursor-pointer border border-green-400 hover:border-green-300"
            onClick={() => navigateTo("bestPractices")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500 p-3 rounded-full transition-all duration-300">
                <CheckSquare size={28} />
              </div>
              <h2 className="text-2xl font-bold">Bonnes Pratiques</h2>
            </div>
            <p className="mb-4 text-blue-200">
              Adoptez les bonnes pratiques pour créer des fichiers Excel
              robustes, maintenables et performants.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">
                3 catégories à découvrir
              </span>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-md">
                Explorer
              </button>
            </div>
          </div>

          {/* Section 3: Hackathon */}
          <div
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 hover:bg-purple-900/10 transition-all duration-300 cursor-pointer border border-purple-400 hover:border-purple-300"
            onClick={() => navigateTo("hackathonLanding")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500 p-3 rounded-full transition-all duration-300">
                <Code size={28} />
              </div>
              <h2 className="text-2xl font-bold">
                Hackathon "Le Dossier Perdu"
              </h2>
            </div>
            <p className="mb-4 text-blue-200">
              Relevez le défi et résolvez une enquête complexe en utilisant vos
              compétences Excel avancées.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">
                Nouvelle aventure disponible
              </span>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-md">
                Découvrir le challenge
              </button>
            </div>
          </div>

          {/* Section 4: Fiches mémo */}
          <div
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 hover:bg-yellow-900/10 transition-all duration-300 cursor-pointer border border-yellow-400 hover:border-yellow-300"
            onClick={() => navigateTo("useCases")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-500 p-3 rounded-full transition-all duration-300">
                <FileText size={28} />
              </div>
              <h2 className="text-2xl font-bold">Fiche Mémo Cas d'Usage</h2>
            </div>
            <p className="mb-4 text-blue-200">
              Consultez des fiches récapitulatives pour chaque fonction avec des
              exemples concrets d'application.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">
                Votre bible de cas d'usage Excel !
              </span>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-md">
                Consulter les fiches
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
