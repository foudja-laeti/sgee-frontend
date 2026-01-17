// src/pages/adminacad/Statistiques.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, GraduationCap, Calendar,
  Download, RefreshCw, CheckCircle, XCircle, Clock
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const Statistiques = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState('30d');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, [periode]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await adminAcadService.getGlobalStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Préparer les données pour les graphiques
  const getEvolutionData = () => {
    // Simuler des données d'évolution (à remplacer par de vraies données du backend)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    return months.map((month, index) => ({
      mois: month,
      inscrits: Math.floor(Math.random() * 50) + 20,
      valides: Math.floor(Math.random() * 30) + 10,
      rejetes: Math.floor(Math.random() * 10) + 2
    }));
  };

  const getTauxValidationData = () => {
    if (!stats?.filieres_stats) return [];
    return stats.filieres_stats.map(f => ({
      name: f.code,
      taux: f.quota > 0 ? Math.round((f.valides / f.quota) * 100) : 0,
      valides: f.valides || 0,
      quota: f.quota || 0
    }));
  };

  const getRepartitionData = () => {
    if (!stats) return [];
    return [
      { name: 'Validés', value: stats.dossiers_valides || 0, color: '#10b981' },
      { name: 'En Attente', value: stats.dossiers_en_attente || 0, color: '#f59e0b' },
      { name: 'Rejetés', value: stats.dossiers_rejetes || 0, color: '#ef4444' }
    ];
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // HEADER
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('STATISTIQUES AVANCÉES', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Généré le ${currentDate}`, pageWidth / 2, 30, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      let yPosition = 50;
      
      // VUE D'ENSEMBLE
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text('VUE D\'ENSEMBLE', 14, yPosition);
      yPosition += 10;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Métrique', 'Valeur', 'Détails']],
        body: [
          ['Total Candidats', stats?.candidats_total || 0, `+${stats?.candidats_nouveaux || 0} nouveaux`],
          ['Dossiers Validés', stats?.dossiers_valides || 0, `${stats?.taux_validation || 0}%`],
          ['En Attente', stats?.dossiers_en_attente || 0, 'Nécessitent action'],
          ['Dossiers Rejetés', stats?.dossiers_rejetes || 0, `${stats?.taux_rejet || 0}%`],
          ['Responsables Filières', stats?.responsables_filieres || 0, 'Actifs'],
          ['Filières Actives', stats?.filieres_actives || 0, 'Ouvertes']
        ],
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 15;
      
      // STATISTIQUES PAR FILIÈRE
      if (stats?.filieres_stats && stats.filieres_stats.length > 0) {
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('RÉPARTITION PAR FILIÈRE', 14, yPosition);
        yPosition += 10;
        
        const filiereData = stats.filieres_stats.map(f => [
          f.code,
          f.libelle,
          f.total || 0,
          f.valides || 0,
          f.en_attente || 0,
          f.rejetes || 0,
          `${f.valides || 0}/${f.quota || 0}`,
          f.quota > 0 ? `${Math.round((f.valides / f.quota) * 100)}%` : '0%'
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [['Code', 'Filière', 'Total', 'Validés', 'Attente', 'Rejetés', 'Places', 'Taux']],
          body: filiereData,
          headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          styles: {
            fontSize: 8,
            cellPadding: 3
          }
        });
      }
      
      // FOOTER
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} sur ${pageCount} - Statistiques Académiques`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`statistiques-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="animate-spin h-16 w-16 text-indigo-600" />
        </div>
      </AdminAcadLayout>
    );
  }

  return (
    <AdminAcadLayout>
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Statistiques Avancées
            </h1>
            <p className="text-gray-600">
              Analyse détaillée des données de candidature
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
              <option value="365d">12 derniers mois</option>
            </select>
            
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Export...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Exporter PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* OVERVIEW STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-10 w-10 text-blue-500" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.candidats_total || 0}
            </p>
            <p className="text-sm text-gray-600">Total Candidats</p>
            <p className="text-xs text-green-600 mt-2">
              +{stats?.candidats_nouveaux || 0} nouveaux
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                {stats?.taux_validation || 0}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.dossiers_valides || 0}
            </p>
            <p className="text-sm text-gray-600">Dossiers Validés</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-10 w-10 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.dossiers_en_attente || 0}
            </p>
            <p className="text-sm text-gray-600">En Attente</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="h-10 w-10 text-red-500" />
              <span className="text-2xl font-bold text-red-600">
                {stats?.taux_rejet || 0}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.dossiers_rejetes || 0}
            </p>
            <p className="text-sm text-gray-600">Dossiers Rejetés</p>
          </div>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution des inscriptions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Évolution des inscriptions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getEvolutionData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="inscrits" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Inscrits"
                  dot={{ fill: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valides" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Validés"
                  dot={{ fill: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rejetes" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Rejetés"
                  dot={{ fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Taux de validation par filière */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              Taux de remplissage par filière
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getTauxValidationData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => {
                    if (name === 'taux') return [`${value}%`, 'Taux'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="taux" 
                  fill="#6366f1" 
                  name="Taux de remplissage"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition des dossiers (Pie Chart) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
              Répartition des dossiers
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getRepartitionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getRepartitionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution par filière */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Distribution par filière
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getTauxValidationData()} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={60} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="valides" fill="#10b981" name="Validés" radius={[0, 8, 8, 0]} />
                <Bar dataKey="quota" fill="#e5e7eb" name="Quota" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATISTIQUES PAR FILIÈRE */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Détail par Filière
          </h2>
          
          <div className="space-y-4">
            {stats?.filieres_stats?.map((filiere) => (
              <div key={filiere.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">{filiere.libelle}</h3>
                      <p className="text-sm text-gray-500">{filiere.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      {filiere.valides || 0}/{filiere.quota || 0}
                    </p>
                    <p className="text-xs text-gray-500">Places occupées</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{filiere.total || 0}</p>
                    <p className="text-xs text-gray-600">Inscrits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{filiere.valides || 0}</p>
                    <p className="text-xs text-gray-600">Validés</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{filiere.en_attente || 0}</p>
                    <p className="text-xs text-gray-600">En attente</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{filiere.rejetes || 0}</p>
                    <p className="text-xs text-gray-600">Rejetés</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((filiere.valides / filiere.quota) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INFOS COMPLÉMENTAIRES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-8 w-8 text-indigo-600" />
              <h3 className="font-bold text-gray-900">Responsables Filières</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600 mb-1">
              {stats?.responsables_filieres || 0}
            </p>
            <p className="text-sm text-gray-600">Actifs</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <h3 className="font-bold text-gray-900">Filières Actives</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {stats?.filieres_actives || 0}
            </p>
            <p className="text-sm text-gray-600">Ouvertes</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h3 className="font-bold text-gray-900">Session en cours</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">2025</p>
            <p className="text-sm text-gray-600">Année académique</p>
          </div>
        </div>
      </div>
    </AdminAcadLayout>
  );
};

export default Statistiques;