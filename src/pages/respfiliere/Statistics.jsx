import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Download, RefreshCw, Award, 
  Clock, CheckCircle, XCircle, BarChart3, PieChart as PieChartIcon,
  FileText, FileSpreadsheet
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Statistics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Chargement des statistiques...');
      
      const statsResponse = await api.get('/candidats/respfiliere/dashboard-stats/');
      console.log('✅ Stats dashboard:', statsResponse.data);
      setStats(statsResponse.data);
      
      try {
        const profileResponse = await api.get('/candidats/respfiliere/profil-filiere/');
        console.log('✅ Profil filière:', profileResponse.data);
        setProfileData(profileResponse.data);
      } catch (profError) {
        console.warn('⚠️ Profil filière non disponible:', profError);
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
      setError(error.response?.data?.error || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const exportToExcel = () => {
    try {
      console.log('📊 Export Excel...');
      
      const filiereInfo = stats?.filiere || user?.filiere || {};
      
      const wsData = [
        ['STATISTIQUES DE LA FILIÈRE'],
        ['Filière', filiereInfo.libelle || 'N/A'],
        ['Code', filiereInfo.code || 'N/A'],
        ['Date export', new Date().toLocaleDateString('fr-FR')],
        [],
        ['VUE D\'ENSEMBLE'],
        ['Métrique', 'Valeur'],
        ['Total candidats', stats?.candidats_total || 0],
        ['Dossiers validés', stats?.dossiers_valides || 0],
        ['Dossiers en attente', stats?.dossiers_en_attente || 0],
        ['Dossiers rejetés', stats?.dossiers_rejetes || 0],
        ['Taux de validation', `${stats?.taux_validation || 0}%`],
        [],
      ];

      if (profileData?.statistiques?.repartition_serie?.length > 0) {
        wsData.push(['RÉPARTITION PAR SÉRIE']);
        wsData.push(['Série', 'Nombre']);
        profileData.statistiques.repartition_serie.forEach(item => {
          wsData.push([item.serie__libelle || 'Non renseigné', item.total]);
        });
        wsData.push([]);
      }

      if (profileData?.statistiques?.repartition_mention?.length > 0) {
        wsData.push(['RÉPARTITION PAR MENTION']);
        wsData.push(['Mention', 'Nombre']);
        profileData.statistiques.repartition_mention.forEach(item => {
          wsData.push([item.mention__libelle || 'Non renseigné', item.total]);
        });
        wsData.push([]);
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      ws['!cols'] = [
        { wch: 30 },
        { wch: 20 }
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Statistiques');
      XLSX.writeFile(wb, `statistiques_${filiereInfo.code}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      console.log('✅ Export Excel réussi');
      setShowExportMenu(false);
    } catch (error) {
      console.error('❌ Erreur export Excel:', error);
      alert('Erreur lors de l\'export Excel');
    }
  };

  const exportToPDF = () => {
    try {
      console.log('📄 Export PDF...');
      console.log('Stats:', stats);
      console.log('ProfileData:', profileData);
      
      const filiereInfo = stats?.filiere || user?.filiere || {};
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text('STATISTIQUES DE LA FILIÈRE', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Filière: ${filiereInfo.libelle || 'N/A'}`, 14, 30);
      doc.text(`Code: ${filiereInfo.code || 'N/A'}`, 14, 37);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 44);
      
      // Vue d'ensemble
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Vue d\'ensemble', 14, 55);
      
      const overviewData = [
        ['Total candidats', (stats?.candidats_total || 0).toString()],
        ['Dossiers validés', (stats?.dossiers_valides || 0).toString()],
        ['Dossiers en attente', (stats?.dossiers_en_attente || 0).toString()],
        ['Dossiers rejetés', (stats?.dossiers_rejetes || 0).toString()],
        ['Taux de validation', `${stats?.taux_validation || 0}%`],
      ];
      
      autoTable(doc, {
        startY: 60,
        head: [['Métrique', 'Valeur']],
        body: overviewData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 10, cellPadding: 4 }
      });
      
      let yPos = doc.lastAutoTable.finalY + 15;
      
      // Répartition par série
      if (profileData?.statistiques?.repartition_serie?.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(79, 70, 229);
        doc.text('Répartition par Série', 14, yPos);
        
        const serieData = profileData.statistiques.repartition_serie.map(item => [
          item.serie__libelle || 'Non renseigné',
          item.total.toString()
        ]);
        
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Série', 'Nombre']],
          body: serieData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          styles: { fontSize: 9 }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      }
      
      // Répartition par mention
      if (profileData?.statistiques?.repartition_mention?.length > 0 && yPos < 250) {
        doc.setFontSize(14);
        doc.setTextColor(79, 70, 229);
        doc.text('Répartition par Mention', 14, yPos);
        
        const mentionData = profileData.statistiques.repartition_mention.map(item => [
          item.mention__libelle || 'Non renseigné',
          item.total.toString()
        ]);
        
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Mention', 'Nombre']],
          body: mentionData,
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] },
          styles: { fontSize: 9 }
        });
      }
      
      // Pied de page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} sur ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      const filename = `statistiques_${filiereInfo.code || 'filiere'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      console.log('✅ Export PDF réussi:', filename);
      setShowExportMenu(false);
    } catch (error) {
      console.error('❌ Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF: ' + error.message);
    }
  };

  const exportToCSV = async () => {
    try {
      console.log('📥 Export CSV...');
      const response = await api.get('/candidats/respfiliere/export-stats/', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `statistiques_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      console.log('✅ Export CSV réussi');
      setShowExportMenu(false);
    } catch (error) {
      console.error('❌ Erreur export CSV:', error);
      alert('Erreur lors de l\'export CSV');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <XCircle className="mx-auto text-red-500 mb-3" size={48} />
            <p className="text-red-700 font-semibold mb-2 text-center">Erreur de chargement</p>
            <p className="text-red-600 text-sm text-center">{error}</p>
            <button
              onClick={fetchAllData}
              className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const candidatsTotal = stats?.candidats_total || 0;
  const dossiersValides = stats?.dossiers_valides || 0;
  const dossiersEnAttente = stats?.dossiers_en_attente || 0;
  const dossiersRejetes = stats?.dossiers_rejetes || 0;
  const tauxValidation = stats?.taux_validation || 0;
  const filiereInfo = stats?.filiere || user?.filiere || {};
  const advancedStats = profileData?.statistiques || {};

  const statutData = [
    { name: 'Validés', value: dossiersValides, color: '#10b981' },
    { name: 'En attente', value: dossiersEnAttente, color: '#f59e0b' },
    { name: 'Rejetés', value: dossiersRejetes, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const barChartData = [
    { name: 'Validés', count: dossiersValides },
    { name: 'En attente', count: dossiersEnAttente },
    { name: 'Rejetés', count: dossiersRejetes },
  ];

  const evolutionData = advancedStats.evolution_mensuelle || [];
  const serieData = (advancedStats.repartition_serie || []).map(item => ({
    name: item.serie__libelle || 'Non renseigné',
    value: item.total
  }));
  const mentionData = (advancedStats.repartition_mention || []).map(item => ({
    name: item.mention__libelle || 'Non renseigné',
    value: item.total
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Statistiques Détaillées
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Analyses et rapports - {filiereInfo.libelle || 'Ma filière'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            
            {/* Menu Export */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exporter</span>
              </button>
              
              {showExportMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={exportToExcel}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <FileSpreadsheet size={18} className="text-green-600" />
                      <span>Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <FileText size={18} className="text-red-600" />
                      <span>PDF (.pdf)</span>
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    >
                      <FileText size={18} className="text-blue-600" />
                      <span>CSV (.csv)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Candidats"
            value={candidatsTotal}
            icon={Users}
            color="bg-blue-500"
          />
          <KPICard
            title="Validés"
            value={dossiersValides}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <KPICard
            title="En Attente"
            value={dossiersEnAttente}
            icon={Clock}
            color="bg-orange-500"
          />
          <KPICard
            title="Rejetés"
            value={dossiersRejetes}
            icon={XCircle}
            color="bg-red-500"
          />
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-indigo-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Répartition par Statut
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="text-purple-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Proportion des Statuts
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution mensuelle */}
        {evolutionData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Évolution des Validations (6 derniers mois)
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  name="Validations"
                  dot={{ fill: '#6366f1', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Répartitions avancées */}
        {(serieData.length > 0 || mentionData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serieData.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="text-indigo-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    Répartition par Série
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serieData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {mentionData.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="text-green-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    Répartition par Mention
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mentionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Informations filière */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm opacity-80 mb-1">Filière</p>
              <p className="text-2xl font-bold">{filiereInfo.libelle || 'N/A'}</p>
              <p className="text-sm opacity-90 mt-1">Code: {filiereInfo.code || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm opacity-80 mb-1">Quota</p>
              <p className="text-2xl font-bold">{profileData?.quota || 'N/A'}</p>
              <p className="text-sm opacity-90 mt-1">
                Places restantes: {profileData?.places_restantes || 0}
              </p>
            </div>
            
            <div>
              <p className="text-sm opacity-80 mb-1">Taux de Remplissage</p>
              <p className="text-2xl font-bold">{profileData?.taux_remplissage || 0}%</p>
              {advancedStats.age_moyen && (
                <p className="text-sm opacity-90 mt-1">
                  Âge moyen: {advancedStats.age_moyen} ans
                </p>
              )}
            </div>
            
            <div>
              <p className="text-sm opacity-80 mb-1">Taux de Validation</p>
              <p className="text-2xl font-bold">{tauxValidation}%</p>
              <p className="text-sm opacity-90 mt-1">
                Sur {candidatsTotal} candidat(s)
              </p>
            </div>
          </div>
        </div>

        {candidatsTotal === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <Users className="mx-auto text-blue-500 mb-3" size={48} />
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Aucun candidat enregistré
            </h3>
            <p className="text-blue-700">
              Les statistiques et graphiques apparaîtront dès que des candidats seront inscrits.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const KPICard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-xl`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

export default Statistics;