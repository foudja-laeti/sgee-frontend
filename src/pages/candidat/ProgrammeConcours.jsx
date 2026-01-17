import React, { useState } from 'react';
import { 
  ArrowLeft, Download, BookOpen, CheckCircle, Clock,
  FileText, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const ProgrammeConcours = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const programme = {
    mathematiques: {
      titre: "Mathématiques",
      duree: "2h",
      coefficient: 3,
      sections: [
        {
          titre: "Algèbre",
          sujets: [
            "Équations et inéquations du second degré",
            "Systèmes d'équations linéaires",
            "Polynômes et fractions rationnelles",
            "Logarithmes et exponentielles",
            "Suites numériques (arithmétiques et géométriques)"
          ]
        },
        {
          titre: "Analyse",
          sujets: [
            "Fonctions numériques : limites, continuité, dérivabilité",
            "Étude de fonctions",
            "Primitives et intégrales",
            "Calcul d'aires et de volumes"
          ]
        },
        {
          titre: "Géométrie",
          sujets: [
            "Géométrie plane : droites, cercles, triangles",
            "Vecteurs et produit scalaire",
            "Transformations du plan",
            "Géométrie dans l'espace"
          ]
        },
        {
          titre: "Probabilités et Statistiques",
          sujets: [
            "Dénombrement et combinatoire",
            "Probabilités conditionnelles",
            "Variables aléatoires discrètes",
            "Statistiques descriptives"
          ]
        }
      ]
    },
    physique: {
      titre: "Physique",
      duree: "1h30",
      coefficient: 2,
      sections: [
        {
          titre: "Mécanique",
          sujets: [
            "Cinématique du point matériel",
            "Dynamique : lois de Newton",
            "Travail et énergie",
            "Chute libre et mouvements projectiles"
          ]
        },
        {
          titre: "Électricité",
          sujets: [
            "Loi d'Ohm et circuits électriques",
            "Générateurs et récepteurs",
            "Énergie électrique et puissance",
            "Dipôles RC et RL"
          ]
        },
        {
          titre: "Optique",
          sujets: [
            "Réflexion et réfraction de la lumière",
            "Lentilles minces",
            "Dispersion de la lumière",
            "Applications des lentilles"
          ]
        }
      ]
    },
    culture_generale: {
      titre: "Culture Générale",
      duree: "1h",
      coefficient: 2,
      sections: [
        {
          titre: "Français",
          sujets: [
            "Compréhension de texte",
            "Expression écrite",
            "Grammaire et orthographe",
            "Vocabulaire et synonymes"
          ]
        },
        {
          titre: "Anglais",
          sujets: [
            "Compréhension écrite",
            "Grammaire anglaise",
            "Vocabulaire technique",
            "Questions de civilisation"
          ]
        },
        {
          titre: "Culture Générale",
          sujets: [
            "Actualité nationale et internationale",
            "Histoire du Cameroun",
            "Géographie",
            "Sciences et technologies"
          ]
        }
      ]
    }
  };

  const toggleSection = (key) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

  const generatePDF = () => {
    // Créer le contenu HTML pour le PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Programme Officiel ENSPY 2026</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3B82F6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1E40AF;
      margin: 0;
      font-size: 28px;
    }
    .header h2 {
      color: #6B7280;
      margin: 5px 0;
      font-weight: normal;
      font-size: 18px;
    }
    .info-box {
      background: #EFF6FF;
      border-left: 4px solid #3B82F6;
      padding: 15px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
    }
    .section {
      page-break-inside: avoid;
      margin: 30px 0;
    }
    .section-title {
      background: #1E40AF;
      color: white;
      padding: 12px 15px;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .subsection {
      margin: 20px 0;
      padding-left: 15px;
    }
    .subsection-title {
      color: #1E40AF;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 2px solid #E5E7EB;
      padding-bottom: 5px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 5px 0;
      padding-left: 25px;
      position: relative;
    }
    li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10B981;
      font-weight: bold;
    }
    .warning-box {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      margin: 20px 0;
    }
    .warning-title {
      color: #92400E;
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #6B7280;
      font-size: 12px;
      border-top: 1px solid #E5E7EB;
      padding-top: 15px;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      background: #F3F4F6;
      padding: 10px 15px;
      border-radius: 5px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>PROGRAMME OFFICIEL 2026</h1>
    <h2>Concours d'entrée à l'ENSPY - Cameroun</h2>
    <p>Session Septembre 2026</p>
  </div>

  <div class="info-box">
    <h3 style="margin-top: 0; color: #1E40AF;">Informations Générales</h3>
    <div class="info-row">
      <strong>Durée totale:</strong>
      <span>4h30</span>
    </div>
    <div class="info-row">
      <strong>Coefficient total:</strong>
      <span>7</span>
    </div>
    <div class="info-row">
      <strong>Nombre d'épreuves:</strong>
      <span>3</span>
    </div>
    <div class="info-row">
      <strong>Date du concours:</strong>
      <span>Lundi 15 Septembre 2026 - 08h00</span>
    </div>
  </div>

  ${Object.entries(programme).map(([key, matiere]) => `
    <div class="section">
      <div class="section-title">
        ${matiere.titre.toUpperCase()} - Coefficient ${matiere.coefficient} (${matiere.duree})
      </div>
      ${matiere.sections.map(section => `
        <div class="subsection">
          <div class="subsection-title">${section.titre}</div>
          <ul>
            ${section.sujets.map(sujet => `<li>${sujet}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `).join('')}

  <div class="warning-box">
    <div class="warning-title">⚠️ Recommandations Importantes</div>
    <ul style="margin: 10px 0;">
      <li>Révisez l'ensemble du programme, aucune impasse n'est conseillée</li>
      <li>Entraînez-vous avec les annales des années précédentes</li>
      <li>Pratiquez les tests blancs pour vous familiariser avec le format</li>
      <li>Gérez bien votre temps : 4h30 pour 3 épreuves</li>
      <li>Apportez le jour J : stylos, calculatrice scientifique, brouillons</li>
    </ul>
  </div>

  <div class="info-box">
    <h3 style="margin-top: 0; color: #1E40AF;">Calendrier du Concours</h3>
    <div class="info-row">
      <strong>15 Août 2026:</strong>
      <span>Publication liste admissibles</span>
    </div>
    <div class="info-row">
      <strong>15 Septembre 2026:</strong>
      <span>Date du concours (08h00 - 13h00)</span>
    </div>
    <div class="info-row">
      <strong>30 Septembre 2026:</strong>
      <span>Publication des résultats</span>
    </div>
  </div>

  <div class="footer">
    <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
    <p>École Nationale Supérieure Polytechnique de Yaoundé</p>
    <p>© ${new Date().getFullYear()} - Tous droits réservés</p>
  </div>
</body>
</html>
    `;

    // Créer une fenêtre temporaire pour l'impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Attendre que le contenu soit chargé puis imprimer
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        
        // Message de confirmation
        alert('✅ Génération du PDF en cours !\n\nVeuillez sélectionner "Enregistrer au format PDF" dans la fenêtre d\'impression.\n\nConseils:\n• Choisissez "Enregistrer au format PDF" comme imprimante\n• Sélectionnez l\'orientation Portrait\n• Marges: Normales');
      }, 250);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
                Programme Officiel 2026
              </h1>
              <p className="text-gray-600">
                Concours - Session Aout 2026
              </p>
            </div>
          </div>

          {/* Infos générales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-blue-900">Durée totale</p>
              <p className="text-2xl font-bold text-blue-600">4h30</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-green-900">Coefficient total</p>
              <p className="text-2xl font-bold text-green-600">7</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <FileText className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-purple-900">Épreuves</p>
              <p className="text-2xl font-bold text-purple-600">3</p>
            </div>
          </div>

          {/* Bouton téléchargement */}
          <button
            onClick={generatePDF}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            <Download className="w-5 h-5" />
            Télécharger le programme en PDF
          </button>
        </div>

        {/* Sections du programme */}
        <div className="space-y-4">
          {Object.entries(programme).map(([key, matiere]) => (
            <div key={key} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* En-tête de section */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {matiere.titre}
                    </h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        ⏱️ {matiere.duree}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        Coef. {matiere.coefficient}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedSection === key ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Contenu détaillé */}
              {expandedSection === key && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <div className="space-y-6">
                    {matiere.sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          {section.titre}
                        </h3>
                        <ul className="space-y-2 ml-4">
                          {section.sujets.map((sujet, sidx) => (
                            <li key={sidx} className="flex items-start gap-2 text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{sujet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommandations */}
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">
                Recommandations importantes
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Révisez l'ensemble du programme, aucune impasse n'est conseillée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Entraînez-vous avec les annales des années précédentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Pratiquez les tests blancs pour vous familiariser avec le format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>Gérez bien votre temps : 4h30 pour 3 épreuves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ressources complémentaires */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Annales</h3>
            <p className="text-sm text-gray-600 mb-4">
              Consultez les sujets des 5 dernières années avec leurs corrigés détaillés
            </p>
            <button className="text-blue-600 font-semibold text-sm hover:underline">
              Accéder aux annales →
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <FileText className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Tests Blancs</h3>
            <p className="text-sm text-gray-600 mb-4">
              Entraînez-vous en conditions réelles avec nos tests blancs chronométrés
            </p>
            <button className="text-green-600 font-semibold text-sm hover:underline">
              Commencer un test →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeConcours;