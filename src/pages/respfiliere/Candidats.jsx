// src/pages/respfiliere/CandidatsList.jsx - AVEC FONCTIONNALITÉ D'EXPORT
import { useState, useEffect } from 'react';
import { Search, Eye, AlertCircle, RefreshCw, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CandidatsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [candidats, setCandidats] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  });
  
  const [filters, setFilters] = useState({
    statut: searchParams.get('statut') || '',
    search: ''
  });

  useEffect(() => {
    fetchCandidats();
  }, [pagination.page, filters.statut]);

  const fetchCandidats = async () => {
    try {
      setLoading(true);
      console.log('📋 Chargement candidats...');
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });
      
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/candidats/respfiliere/mes-candidats/?${params.toString()}`);
      console.log('✅ Candidats reçus:', response.data);
      
      setCandidats(response.data.results || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.count || 0,
        total_pages: response.data.total_pages || 1
      }));
    } catch (error) {
      console.error('❌ Erreur chargement candidats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCandidats();
  };

  const handleFilterChange = (statut) => {
    setFilters(prev => ({ ...prev, statut }));
    setPagination(prev => ({ ...prev, page: 1 }));
    
    if (statut) {
      setSearchParams({ statut });
    } else {
      setSearchParams({});
    }
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'en_attente': 'En attente',
      'complet': 'Complet',
      'valide': 'Validé',
      'rejete': 'Rejeté'
    };
    return labels[statut] || statut;
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'en_attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'complet': 'bg-blue-100 text-blue-800 border-blue-200',
      'valide': 'bg-green-100 text-green-800 border-green-200',
      'rejete': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${badges[statut] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {getStatutLabel(statut)}
      </span>
    );
  };

  // Export Excel
  const exportToExcel = () => {
    try {
      console.log('📊 Export Excel...');
      
      const wsData = [
        ['LISTE DES CANDIDATS'],
        ['Date export', new Date().toLocaleDateString('fr-FR')],
        ['Filtre statut', filters.statut ? getStatutLabel(filters.statut) : 'Tous'],
        ['Total candidats', candidats.length],
        [],
        ['Matricule', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Statut', 'Date inscription']
      ];

      candidats.forEach(c => {
        wsData.push([
          c.matricule || 'N/A',
          c.nom || '',
          c.prenom || '',
          c.email || '',
          c.telephone || 'N/A',
          getStatutLabel(c.statut_dossier),
          new Date(c.created_at).toLocaleDateString('fr-FR')
        ]);
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      ws['!cols'] = [
        { wch: 15 }, // Matricule
        { wch: 20 }, // Nom
        { wch: 20 }, // Prénom
        { wch: 30 }, // Email
        { wch: 15 }, // Téléphone
        { wch: 15 }, // Statut
        { wch: 15 }  // Date
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Candidats');
      XLSX.writeFile(wb, `candidats_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      console.log('✅ Export Excel réussi');
      setShowExportMenu(false);
    } catch (error) {
      console.error('❌ Erreur export Excel:', error);
      alert('Erreur lors de l\'export Excel');
    }
  };

  // Export PDF
  const exportToPDF = () => {
    try {
      console.log('📄 Export PDF...');
      
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text('LISTE DES CANDIDATS', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
      doc.text(`Filtre: ${filters.statut ? getStatutLabel(filters.statut) : 'Tous'}`, 14, 37);
      doc.text(`Total: ${candidats.length} candidat(s)`, 14, 44);
      
      // Table des candidats
      const tableData = candidats.map(c => [
        c.matricule || 'N/A',
        `${c.prenom || ''} ${c.nom || ''}`,
        c.email || '',
        c.telephone || 'N/A',
        getStatutLabel(c.statut_dossier),
        new Date(c.created_at).toLocaleDateString('fr-FR')
      ]);
      
      autoTable(doc, {
        startY: 55,
        head: [['Matricule', 'Nom complet', 'Email', 'Téléphone', 'Statut', 'Date']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 }
        }
      });
      
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
      
      doc.save(`candidats_${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('✅ Export PDF réussi');
      setShowExportMenu(false);
    } catch (error) {
      console.error('❌ Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  // Export CSV
  const exportToCSV = () => {
    try {
      console.log('📥 Export CSV...');
      
      const headers = ['Matricule', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Statut', 'Date inscription'];
      const rows = candidats.map(c => [
        c.matricule || 'N/A',
        c.nom || '',
        c.prenom || '',
        c.email || '',
        c.telephone || 'N/A',
        getStatutLabel(c.statut_dossier),
        new Date(c.created_at).toLocaleDateString('fr-FR')
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `candidats_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Calculer les stats pour les boutons de filtre
  const statsCount = {
    tous: pagination.total,
    complet: candidats.filter(c => c.statut_dossier === 'complet').length,
    valide: candidats.filter(c => c.statut_dossier === 'valide').length,
    rejete: candidats.filter(c => c.statut_dossier === 'rejete').length,
    en_attente: candidats.filter(c => c.statut_dossier === 'en_attente').length
  };

  if (loading && candidats.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des candidats...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Candidats</h1>
            <p className="text-gray-600 mt-1">
              Gérez les dossiers d'enrôlement de votre filière
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchCandidats()}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            {/* Menu Export */}
            {candidats.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-sm"
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
            )}
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, matricule, email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <div className="flex gap-2">
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="complet">Complets (à traiter)</option>
                <option value="valide">Validés</option>
                <option value="rejete">Rejetés</option>
                
              </select>
              
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => handleFilterChange('')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filters.statut === '' 
                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{statsCount.tous}</div>
            <div className="text-sm text-gray-600 mt-1">Tous</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('complet')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filters.statut === 'complet' 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
            }`}
          >
            <div className="text-2xl font-bold text-blue-600">{statsCount.complet}</div>
            <div className="text-sm text-gray-600 mt-1">en attente</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('valide')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filters.statut === 'valide' 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
            }`}
          >
            <div className="text-2xl font-bold text-green-600">{statsCount.valide}</div>
            <div className="text-sm text-gray-600 mt-1">Validés</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('rejete')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filters.statut === 'rejete' 
                ? 'border-red-500 bg-red-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
            }`}
          >
            <div className="text-2xl font-bold text-red-600">{statsCount.rejete}</div>
            <div className="text-sm text-gray-600 mt-1">Rejetés</div>
          </button>

          
        </div>

        {/* Liste des candidats */}
        {candidats.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Matricule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Candidat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidats.map((candidat) => (
                    <tr key={candidat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {candidat.matricule || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {candidat.photo_url ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                src={candidat.photo_url}
                                alt={`${candidat.prenom} ${candidat.nom}`}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                <span className="text-white font-semibold text-sm">
                                  {candidat.prenom?.[0] || 'C'}{candidat.nom?.[0] || 'A'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidat.prenom} {candidat.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {candidat.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {candidat.telephone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatutBadge(candidat.statut_dossier)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(candidat.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/respfiliere/candidats/${candidat.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                        >
                          <Eye size={16} />
                          Consulter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page {pagination.page} sur {pagination.total_pages} • {pagination.total} candidat{pagination.total > 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                    }}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => {
                      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                    }}
                    disabled={pagination.page === pagination.total_pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun candidat trouvé</h3>
            <p className="text-sm text-gray-500 mb-4">
              {filters.statut || filters.search 
                ? 'Essayez de modifier vos filtres de recherche.' 
                : 'Aucun candidat n\'a encore soumis de dossier pour cette filière.'}
            </p>
            {(filters.statut || filters.search) && (
              <button
                onClick={() => {
                  setFilters({ statut: '', search: '' });
                  setSearchParams({});
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CandidatsList;