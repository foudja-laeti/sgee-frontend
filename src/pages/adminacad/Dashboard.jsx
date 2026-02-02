// src/pages/adminacad/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import BoutonManuel from '../../components/ManualButton';
import { useNavigate } from 'react-router-dom';
import {
  Users, Award, FileText, AlertTriangle, TrendingUp, TrendingDown,
  Plus, Download, Calendar, GraduationCap, Clock, CheckCircle, XCircle, Eye, BarChart3
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    candidats_total: 0,
    candidats_nouveaux: 0,
    dossiers_valides: 0,
    dossiers_en_attente: 0,
    dossiers_rejetes: 0,
    taux_validation: 0,
    taux_rejet: 0,
    filieres_stats: [],
    alertes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAcadService.getGlobalStats();
      if (res?.success) {
        setStats({
          candidats_total: res.data?.candidats_total || 0,
          candidats_nouveaux: res.data?.candidats_nouveaux || 0,
          dossiers_valides: res.data?.dossiers_valides || 0,
          dossiers_en_attente: res.data?.dossiers_en_attente || 0,
          dossiers_rejetes: res.data?.dossiers_rejetes || 0,
          taux_validation: res.data?.taux_validation || 0,
          taux_rejet: res.data?.taux_rejet || 0,
          filieres_stats: res.data?.filieres_stats || [],
          alertes: res.data?.alertes || []
        });
      } else {
        setError('Impossible de charger les statistiques');
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleExportClick = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // HEADER
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT ACADÉMIQUE', pageWidth / 2, 20, { align: 'center' });
      
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
      
      // STATISTIQUES GLOBALES
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229);
      doc.text('STATISTIQUES GLOBALES', 14, yPosition);
      yPosition += 10;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Indicateur', 'Valeur', 'Pourcentage']],
        body: [
          ['Total Candidats', stats.candidats_total.toString(), '100%'],
          ['Nouveaux (7 jours)', stats.candidats_nouveaux.toString(), '-'],
          ['Dossiers Validés', stats.dossiers_valides.toString(), `${stats.taux_validation}%`],
          ['En Attente', stats.dossiers_en_attente.toString(), '-'],
          ['Rejetés', stats.dossiers_rejetes.toString(), `${stats.taux_rejet}%`],
        ],
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 15;
      
      // PERFORMANCE PAR FILIÈRE
      if (stats.filieres_stats && stats.filieres_stats.length > 0) {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text('PERFORMANCE PAR FILIERE', 14, yPosition);
        yPosition += 10;
        
        const filiereData = stats.filieres_stats.map(f => [
          f.code || 'N/A',
          f.libelle || 'Sans nom',
          `${f.responsable?.nom || ''} ${f.responsable?.prenom || ''}`.trim() || 'N/A',
          f.quota?.toString() || '0',
          f.total?.toString() || '0',
          f.valides?.toString() || '0',
          f.en_attente?.toString() || '0',
          f.rejetes?.toString() || '0',
          f.quota > 0 ? `${Math.round((f.valides / f.quota) * 100)}%` : '0%'
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [['Code', 'Filière', 'Responsable', 'Quota', 'Total', 'Validés', 'Attente', 'Rejetés', 'Taux']],
          body: filiereData,
          headStyles: {
            fillColor: [79, 70, 229],
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
          },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 35 },
            2: { cellWidth: 35 },
            3: { cellWidth: 15 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 15 },
            8: { cellWidth: 15 }
          }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
      }
      
      // ALERTES
      if (stats.alertes && stats.alertes.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(234, 88, 12);
        doc.text(`ALERTES (${stats.alertes.length})`, 14, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 53, 15);
        
        stats.alertes.forEach((alerte, i) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }
          const lines = doc.splitTextToSize(alerte, pageWidth - 30);
          doc.text(lines, 14, yPosition);
          yPosition += lines.length * 7;
        });
      }
      
      // FOOTER
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} sur ${pageCount} - Système de Gestion des Enrôlements`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      const fileName = `rapport-academique-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </AdminAcadLayout>
    );
  }

  if (error) {
    return (
      <AdminAcadLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </AdminAcadLayout>
    );
  }

  return (
    <AdminAcadLayout>
      <div className="p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Tableau de Bord Académique
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar size={16} />
              Session 2026 - Vue d'ensemble administrative
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            
            <button
              onClick={handleExportClick}
              disabled={exporting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Génération...
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
               onClick={() => navigate('/adminacad/responsables-filieres')}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <TrendingUp className="h-6 w-6 opacity-75" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Candidats</p>
            <p className="text-4xl font-bold mb-2">{stats.candidats_total}</p>
            <p className="text-xs text-blue-100">
              +{stats.candidats_nouveaux} cette semaine
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
               onClick={() => navigate('/adminacad/responsables-filieres')}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-8 w-8" />
              </div>
              <Award className="h-6 w-6 opacity-75" />
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Dossiers Validés</p>
            <p className="text-4xl font-bold mb-2">{stats.dossiers_valides}</p>
            <p className="text-xs text-green-100">
              {stats.taux_validation}% de validation
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
               onClick={() => navigate('/adminacad/responsables-filieres')}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock className="h-8 w-8" />
              </div>
              <FileText className="h-6 w-6 opacity-75" />
            </div>
            <p className="text-orange-100 text-sm font-medium mb-1">En Attente</p>
            <p className="text-4xl font-bold mb-2">{stats.dossiers_en_attente}</p>
            <p className="text-xs text-orange-100">
              Nécessitent une action
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
               onClick={() => navigate('/adminacad/responsables-filieres')}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <XCircle className="h-8 w-8" />
              </div>
              <TrendingDown className="h-6 w-6 opacity-75" />
            </div>
            <p className="text-red-100 text-sm font-medium mb-1">Rejetés</p>
            <p className="text-4xl font-bold mb-2">{stats.dossiers_rejetes}</p>
            <p className="text-xs text-red-100">
              {stats.taux_rejet}% de rejet
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/adminacad/create-resp_filiere')}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 group-hover:text-indigo-600">
              Nouveau Responsable Filière
            </p>
          </button>

          <button
            onClick={() => navigate('/adminacad/responsables-filieres')}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <Users className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 group-hover:text-green-600">
              Voir Responsables Filières
            </p>
          </button>

          <button
            onClick={handleExportClick}
            disabled={exporting}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 group-hover:text-purple-600">
              {exporting ? 'Génération...' : 'Exporter Rapport'}
            </p>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Performance par Filière
                </h2>
                <p className="text-gray-600">Suivi des responsables et taux de validation</p>
              </div>
              <button
                onClick={() => navigate('/adminacad/responsables-filieres')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Détails
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {stats.filieres_stats && stats.filieres_stats.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Filière</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Responsable</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Capacité</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Inscrits</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Validés</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">En Attente</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Rejetés</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Taux</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.filieres_stats.map((filiere) => (
                    <tr key={filiere.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{filiere.libelle}</p>
                            <p className="text-sm text-gray-500">{filiere.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {filiere.responsable?.nom} {filiere.responsable?.prenom}
                          </p>
                          <p className="text-sm text-gray-500">{filiere.responsable?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-gray-900">{filiere.quota || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">{filiere.total || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                          {filiere.valides || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-bold">
                          {filiere.en_attente || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold">
                          {filiere.rejetes || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ 
                                width: `${filiere.quota > 0 ? Math.min((filiere.valides / filiere.quota) * 100, 100) : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {filiere.quota > 0 ? Math.round((filiere.valides / filiere.quota) * 100) : 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/adminacad/responsables-filieres/${filiere.id}`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Aucune filière disponible</p>
                <p className="text-sm">Les statistiques apparaîtront ici une fois des filières créées</p>
              </div>
            )}
          </div>
        </div>

        {stats.alertes && stats.alertes.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-900 mb-3">
                  Alertes Importantes ({stats.alertes.length})
                </h3>
                <ul className="space-y-2">
                  {stats.alertes.map((alerte, i) => (
                    <li key={i} className="flex items-start gap-2 text-yellow-800">
                      <span className="font-bold">•</span>
                      <span className="font-medium">{alerte}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <BoutonManuel />
      
    </AdminAcadLayout>
    
  );
};

export default Dashboard;