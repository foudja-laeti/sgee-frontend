import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Play, Clock, Award, BarChart3, CheckCircle,
  XCircle, Trophy, Target, Brain, Zap, AlertCircle, Lock,
  ChevronLeft, ChevronRight, Flag
} from 'lucide-react';

// Base de données des questions
const questionsDatabase = {
  math_facile: [
    {
      id: 1,
      question: "Résoudre l'équation : 2x + 5 = 13",
      options: ["x = 4", "x = 8", "x = 3", "x = 9"],
      correct: 0,
      explication: "2x = 13 - 5 = 8, donc x = 4"
    },
    {
      id: 2,
      question: "Calculer : √16 + √9",
      options: ["5", "7", "9", "25"],
      correct: 1,
      explication: "√16 = 4 et √9 = 3, donc 4 + 3 = 7"
    },
    {
      id: 3,
      question: "Quelle est la dérivée de f(x) = x² ?",
      options: ["2x", "x", "2x²", "x²/2"],
      correct: 0,
      explication: "La dérivée de x² est 2x"
    },
    {
      id: 4,
      question: "Résoudre : 3(x - 2) = 9",
      options: ["x = 5", "x = 3", "x = 7", "x = 1"],
      correct: 0,
      explication: "x - 2 = 3, donc x = 5"
    },
    {
      id: 5,
      question: "Calculer : 15% de 200",
      options: ["30", "25", "35", "20"],
      correct: 0,
      explication: "15% × 200 = 0.15 × 200 = 30"
    }
  ]
};

const TestsBlancs = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const tests = [
    {
      id: 1,
      titre: "Test Blanc #1 - Mathématiques",
      matiere: "Mathématiques",
      niveau: "Facile",
      duree: 300, // en secondes (5 minutes pour démo)
      questions: questionsDatabase.math_facile,
      score_minimal: 60,
      disponible: true,
      color: "blue",
      description: "Évaluation complète du programme de mathématiques avec focus sur l'algèbre et l'analyse"
    },
    {
      id: 2,
      titre: "Test Blanc #2 - Physique",
      matiere: "Physique",
      niveau: "Moyen",
      duree: 1800,
      questions: [],
      score_minimal: 50,
      disponible: false,
      color: "green",
      description: "Mécanique, électricité et optique - Questions type concours (Bientôt disponible)"
    },
    {
      id: 3,
      titre: "Test Blanc #3 - Culture Générale",
      matiere: "Culture Générale",
      niveau: "Moyen",
      duree: 3600,
      questions: [],
      score_minimal: 55,
      disponible: false,
      color: "purple",
      description: "Français, anglais et culture générale - Format QCM (Bientôt disponible)"
    }
  ];

  const niveauColors = {
    Facile: "bg-green-100 text-green-700 border-green-300",
    Moyen: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Difficile: "bg-red-100 text-red-700 border-red-300"
  };

  const statistiquesUtilisateur = {
    tests_completes: 0,
    score_moyen: 0,
    temps_moyen: "N/A",
    meilleur_score: 0,
    matiere_forte: "N/A",
    matiere_faible: "N/A"
  };

  // Chronomètre
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testFinished) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testStarted && !testFinished) {
      handleFinishTest();
    }
  }, [timeLeft, testStarted, testFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (test) => {
    if (!test.disponible) {
      alert('Ce test sera disponible prochainement.');
      return;
    }
    if (test.questions.length === 0) {
      alert('Ce test n\'a pas encore de questions. Essayez le Test #1 - Mathématiques.');
      return;
    }
    setSelectedTest(test);
    setTestStarted(true);
    setTimeLeft(test.duree);
    setCurrentQuestion(0);
    setAnswers({});
    setTestFinished(false);
    setShowResults(false);
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir terminer le test ? Vous ne pourrez plus modifier vos réponses.')) {
      return;
    }
    setTestFinished(true);
    setShowResults(true);
  };

  const handleQuitTest = () => {
    if (!testFinished) {
      if (!window.confirm('Êtes-vous sûr de vouloir quitter ce test ? Votre progression ne sera pas sauvegardée.')) {
        return;
      }
    }
    setSelectedTest(null);
    setTestStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTestFinished(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedTest.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return {
      correct,
      total: selectedTest.questions.length,
      percentage: Math.round((correct / selectedTest.questions.length) * 100)
    };
  };

  // Vue des résultats
  if (showResults && selectedTest) {
    const score = calculateScore();
    const passed = score.percentage >= selectedTest.score_minimal;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Résultats */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className={`inline-flex p-4 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
                {passed ? (
                  <Trophy className="w-16 h-16 text-green-600" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'Félicitations !' : 'Test terminé'}
              </h1>
              <p className="text-gray-600">
                {passed 
                  ? 'Vous avez réussi le test avec succès !'
                  : 'Continuez vos efforts, vous y êtes presque !'}
              </p>
            </div>

            {/* Score global */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 rounded-xl p-6 text-center`}>
                <p className="text-sm text-gray-600 mb-2">Score</p>
                <p className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {score.percentage}%
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Bonnes réponses</p>
                <p className="text-4xl font-bold text-blue-600">
                  {score.correct}/{score.total}
                </p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Temps utilisé</p>
                <p className="text-4xl font-bold text-purple-600">
                  {formatTime(selectedTest.duree - timeLeft)}
                </p>
              </div>
            </div>

            <button
              onClick={handleQuitTest}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Retour aux tests
            </button>
          </div>

          {/* Correction détaillée */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Correction détaillée</h2>
            {selectedTest.questions.map((question, idx) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={question.id} className={`bg-white rounded-xl shadow-lg p-6 border-2 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-3">
                        Question {idx + 1}: {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border-2 ${
                              optIdx === question.correct
                                ? 'bg-green-50 border-green-300'
                                : optIdx === userAnswer && userAnswer !== question.correct
                                ? 'bg-red-50 border-red-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optIdx)}. {option}
                            </span>
                            {optIdx === question.correct && (
                              <span className="ml-2 text-green-600 font-semibold">✓ Bonne réponse</span>
                            )}
                            {optIdx === userAnswer && userAnswer !== question.correct && (
                              <span className="ml-2 text-red-600 font-semibold">✗ Votre réponse</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong>Explication :</strong> {question.explication}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Vue du test en cours
  if (testStarted && selectedTest) {
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header du test */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTest.titre}</h2>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} sur {selectedTest.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeLeft < 60 ? 'bg-red-50 border-2 border-red-300' : 'bg-blue-50 border-2 border-blue-200'
                }`}>
                  <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`} />
                  <span className={`font-bold text-lg tabular-nums ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={handleQuitTest}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Quitter
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Zone de question */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(question.id, idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[question.id] === idx
                      ? 'bg-indigo-50 border-indigo-500 shadow-md'
                      : 'bg-white border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold text-gray-700 mr-3">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className={answers[question.id] === idx ? 'text-indigo-900 font-medium' : 'text-gray-700'}>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>

            {currentQuestion === selectedTest.questions.length - 1 ? (
              <button
                onClick={handleFinishTest}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold"
              >
                <Flag className="w-5 h-5" />
                Terminer le test
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-semibold"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mini navigation */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Navigation rapide</p>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {selectedTest.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded-lg border-2 text-sm font-semibold transition-all ${
                    idx === currentQuestion
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : answers[q.id] !== undefined
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {Object.keys(answers).length} / {selectedTest.questions.length} questions répondues
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Vue liste des tests
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Tests Blancs
              </h1>
              <p className="text-gray-600">
                Entraînez-vous en conditions réelles de concours
              </p>
            </div>
          </div>

          {/* Statistiques utilisateur */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={CheckCircle}
              label="Tests complétés"
              value={statistiquesUtilisateur.tests_completes}
              color="green"
            />
            <StatCard
              icon={Trophy}
              label="Score moyen"
              value={statistiquesUtilisateur.score_moyen > 0 ? `${statistiquesUtilisateur.score_moyen}%` : 'N/A'}
              color="yellow"
            />
            <StatCard
              icon={Zap}
              label="Meilleur score"
              value={statistiquesUtilisateur.meilleur_score > 0 ? `${statistiquesUtilisateur.meilleur_score}%` : 'N/A'}
              color="purple"
            />
            <StatCard
              icon={Target}
              label="Matière forte"
              value={statistiquesUtilisateur.matiere_forte}
              color="blue"
              small
            />
          </div>
        </div>

        {/* Liste des tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                test.disponible && test.questions.length > 0
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              {/* En-tête colorée */}
              <div className={`bg-gradient-to-r from-${test.color}-500 to-${test.color}-600 p-6 text-white`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{test.titre}</h3>
                    <p className="text-sm opacity-90">{test.matiere}</p>
                  </div>
                  {(!test.disponible || test.questions.length === 0) && (
                    <Lock className="w-6 h-6 opacity-75" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(test.duree)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="w-4 h-4" />
                    {test.questions.length || '?'} questions
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${niveauColors[test.niveau]}`}>
                    {test.niveau}
                  </span>
                  <span className="text-xs text-gray-500">
                    Score minimal : {test.score_minimal}%
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  {test.description}
                </p>

                {test.disponible && test.questions.length > 0 ? (
                  <button
                    onClick={() => handleStartTest(test)}
                    className={`w-full py-3 bg-gradient-to-r from-${test.color}-500 to-${test.color}-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold`}
                  >
                    <Play className="w-5 h-5" />
                    Commencer le test
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                  >
                    <Lock className="w-5 h-5" />
                    {test.questions.length === 0 ? 'Bientôt disponible' : 'Test verrouillé'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Conseils */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">
                Conseils pour réussir vos tests
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Assurez-vous d'avoir suffisamment de temps devant vous sans interruption</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Munissez-vous d'une calculatrice, de brouillons et de stylos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Gérez votre temps : ne restez pas bloqué sur une question</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Utilisez la navigation rapide pour revoir vos réponses avant de terminer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant StatCard
const StatCard = ({ icon: Icon, label, value, color, small }) => (
  <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4 border border-${color}-200`}>
    <Icon className={`w-6 h-6 text-${color}-600 mb-2`} />
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className={`${small ? 'text-sm' : 'text-2xl'} font-bold text-gray-900`}>
      {value}
    </p>
  </div>
);

export default TestsBlancs;