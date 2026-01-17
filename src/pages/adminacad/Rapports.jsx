// src/pages/adminacad/Rapports.jsx
import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, TrendingUp,
  BarChart3, Users, GraduationCap, CheckCircle, Clock,
  FileSpreadsheet, FileType, Printer, RefreshCw
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const Rapports = () => {
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState({
    type: 'global',
    format: 'csv',
    periode: '30d',
    filiere_id: 'all',
    statut: 'all'
  });

  const rapportTypes = [
    {
      id: 'global',
      title: 'Rapport Global',
      description: 'Vue d\'ensemble complète de toutes les statistiques',
      icon: BarChart3,
      color: 'indigo'
    },
    {
      id: 'candidats',
      title: 'Rapport Candidats',
      description: 'Liste détaillée de tous les candidats avec leurs statuts',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'filieres',
      title: 'Rapport par Filière',
      description: 'Statistiques détaillées par filière',
      icon: GraduationCap,
      color: 'green'
    },
    {
      id: 'validation',
      title: 'Rapport de Validation',
      description: 'Taux de validation et performance',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      id: 'temporel',
      title: 'Rapport Temporel',
      description: 'Évolution des inscriptions dans le temps',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'responsables',
      title: 'Rapport Responsables',
      description: 'Performance des responsables de filière',
      icon: Users,
      color: 'orange'
    }
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    
    try {
      let result;
      
      switch (filters.type) {
        case 'global':
          result = await adminAcadService.exportStats();
          break;
        case 'candidats':
          result = await adminAcadService.exportCandidats(
            filters.filiere_id !== 'all' ? filters.filiere_id : null
          );
          break;
        case 'filieres':
          result = await adminAcadService.exportStatsFilieres();
          break;
        case 'validation':
          result = await adminAcadService.exportRapportValidation(filters.periode);
          break;
        case 'temporel':
          result = await adminAcadService.exportRapportTemporel(filters.periode);
          break;
        case 'responsables':
          result = await adminAcadService.exportRapportResponsables();
          break;
        default:
          result = await adminAcadService.exportStats();
      }

      if (result.success) {
        alert('Rapport généré avec succès !');
      } else {
        alert('Erreur lors de la génération du rapport');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du rapport');
    } finally {
      setGenerating(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    };
    return colors[color] || colors.indigo;
  };

  return (
    <AdminAcadLayout>
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Génération de Rapports
            </h1>
            <p className="text-gray-600">
              Créer et exporter des rapports personnalisés
            </p>
          </div>
          
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download size={20} />
                Générer le Rapport
              </>
            )}
          </button>
        </div>

        {/* TYPES DE RAPPORTS */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Type de Rapport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rapportTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = filters.type === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => setFilters({...filters, type: type.id})}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-lg mb-4 ${
                    isSelected ? `bg-gradient-to-br ${getColorClasses(type.color)} text-white` : 'bg-gray-100'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* PARAMÈTRES DU RAPPORT */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Paramètres du Rapport
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileType className="inline h-4 w-4 mr-2" />
                Format d'export
              </label>
              <select
                value={filters.format}
                onChange={(e) => setFilters({...filters, format: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="csv">CSV (Excel)</option>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
              </select>
            </div>

            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Période
              </label>
              <select
                value={filters.periode}
                onChange={(e) => setFilters({...filters, periode: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">3 derniers mois</option>
                <option value="365d">12 derniers mois</option>
                <option value="all">Toute la période</option>
              </select>
            </div>

            {/* Filière (si applicable) */}
            {(filters.type === 'candidats' || filters.type === 'filieres') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="inline h-4 w-4 mr-2" />
                  Filière
                </label>
                <select
                  value={filters.filiere_id}
                  onChange={(e) => setFilters({...filters, filiere_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Toutes les filières</option>
                  {/* Les filières seront chargées dynamiquement */}
                </select>
              </div>
            )}

            {/* Statut (si applicable) */}
            {filters.type === 'candidats' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="inline h-4 w-4 mr-2" />
                  Statut
                </label>
                <select
                  value={filters.statut}
                  onChange={(e) => setFilters({...filters, statut: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="valide">Validés</option>
                  <option value="en_attente">En attente</option>
                  <option value="rejete">Rejetés</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* APERÇU */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            Aperçu du Rapport
          </h2>
          
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Type de rapport</p>
                <p className="font-semibold text-gray-900">
                  {rapportTypes.find(r => r.id === filters.type)?.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Format</p>
                <p className="font-semibold text-gray-900 uppercase">{filters.format}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Période</p>
                <p className="font-semibold text-gray-900">
                  {filters.periode === '7d' && '7 derniers jours'}
                  {filters.periode === '30d' && '30 derniers jours'}
                  {filters.periode === '90d' && '3 derniers mois'}
                  {filters.periode === '365d' && '12 derniers mois'}
                  {filters.periode === 'all' && 'Toute la période'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de génération</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RAPPORTS RÉCENTS (Placeholder) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rapports Récents
          </h2>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Rapport Global - {new Date(Date.now() - i * 86400000).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-gray-600">CSV • 2.3 MB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Download size={18} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                    <Printer size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GUIDE */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Guide d'utilisation :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sélectionnez le type de rapport souhaité</li>
                <li>Configurez les paramètres (période, format, filtres)</li>
                <li>Cliquez sur "Générer le Rapport" pour télécharger</li>
                <li>Les rapports sont automatiquement sauvegardés dans l'historique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminAcadLayout>
  );
};

export default Rapports;