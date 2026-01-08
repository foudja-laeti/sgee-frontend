// src/pages/respfiliere/CandidatDetail.jsx - BACKEND DJANGO
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, 
  CheckCircle, XCircle, Download, Eye, School, GraduationCap, RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

const CandidatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidat, setCandidat] = useState(null);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [motifRejet, setMotifRejet] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidatDetail();
  }, [id]);

  const fetchCandidatDetail = async () => {
    try {
      setLoading(true);
      console.log(`📋 Chargement candidat ${id}...`);
      
       const response = await api.get(`/candidats/respfiliere/${id}/candidat_detail/`);
      console.log('✅ Candidat reçu:', response.data);
      
      setCandidat(response.data);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur chargement candidat:', error);
      setError(error.response?.data?.error || 'Erreur lors du chargement');
      
      if (error.response?.status === 404) {
        alert('Candidat non trouvé ou vous n\'avez pas accès à ce dossier');
        navigate('/respfiliere/candidats');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setProcessing(true);
      console.log(`✅ Validation dossier ${id}...`);
      
       const response = await api.post(`/candidats/respfiliere/${id}/valider_dossier/`);
    
    console.log('✅ Dossier validé:', response.data);
    
    alert('✅ Dossier validé avec succès ! Un email a été envoyé au candidat.');
    setShowValidateModal(false);
    fetchCandidatDetail();
  } catch (error) {
    console.error('❌ Erreur validation:', error);
    alert(error.response?.data?.error || 'Erreur lors de la validation');
  } finally {
    setProcessing(false);
  }
};
  const handleReject = async () => {
    if (!motifRejet.trim()) {
      alert('⚠️ Le motif de rejet est obligatoire');
      return;
    }

    try {
      setProcessing(true);
      console.log(`❌ Rejet dossier ${id}...`);
      
       const response = await api.post(`/candidats/respfiliere/${id}/rejeter_dossier/`, {
      motif: motifRejet
    });
      console.log('✅ Dossier rejeté:', response.data);
      
      alert('✅ Dossier rejeté avec succès. Un email a été envoyé au candidat.');
      setShowRejectModal(false);
      setMotifRejet('');
      fetchCandidatDetail();
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      alert(error.response?.data?.error || 'Erreur lors du rejet');
    } finally {
      setProcessing(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label: 'En attente' },
      'complet': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label: 'Complet' },
      'valide': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Validé' },
      'rejete': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Rejeté' }
    };
    
    const badge = badges[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', label: statut };
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${badge.bg} ${badge.text} ${badge.border}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement du dossier...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !candidat) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-900 font-semibold mb-2">Erreur</p>
            <p className="text-red-700 mb-4">{error || 'Candidat non trouvé'}</p>
            <button
              onClick={() => navigate('/respfiliere/candidats')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retour à la liste
            </button>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/respfiliere/candidats')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dossier de {candidat.prenom} {candidat.nom}
              </h1>
              <p className="text-gray-600 mt-1">Matricule: {candidat.matricule}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatutBadge(candidat.statut_dossier)}
          </div>
        </div>

        {/* Actions de validation/rejet */}
        {candidat.statut_dossier === 'complet' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-1">
                  Dossier prêt pour traitement
                </h3>
                <p className="text-blue-800">
                  Ce dossier est complet et attend votre décision de validation ou de rejet.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2 shadow-md"
                >
                  <XCircle size={20} />
                  Rejeter
                </button>
                <button
                  onClick={() => setShowValidateModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-md"
                >
                  <CheckCircle size={20} />
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Motif de rejet si rejeté */}
        {candidat.statut_dossier === 'rejete' && candidat.motif_rejet && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">Motif de rejet</h3>
            <p className="text-red-800">{candidat.motif_rejet}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Photo et documents */}
          <div className="space-y-6">
            {/* Photo */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Photo d'identité</h3>
              {candidat.photo_url ? (
                <img
                  src={candidat.photo_url}
                  alt="Photo candidat"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <User size={64} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-3">
                {candidat.documents && candidat.documents.length > 0 ? (
                  candidat.documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors border-2 border-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-indigo-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 capitalize text-sm">
                            {doc.type?.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-600">{doc.nom}</p>
                        </div>
                      </div>
                      <Eye size={20} className="text-gray-400" />
                    </button>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm text-center py-4">Aucun document disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Informations Personnelles
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nom</label>
                  <p className="font-medium text-gray-900">{candidat.nom}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Prénom</label>
                  <p className="font-medium text-gray-900">{candidat.prenom}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date de naissance</label>
                  <p className="font-medium text-gray-900">
                    {candidat.date_naissance ? new Date(candidat.date_naissance).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Lieu de naissance</label>
                  <p className="font-medium text-gray-900">{candidat.lieu_naissance || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Sexe</label>
                  <p className="font-medium text-gray-900">
                    {candidat.sexe === 'M' ? 'Masculin' : candidat.sexe === 'F' ? 'Féminin' : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={20} className="text-green-600" />
                Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium text-gray-900">{candidat.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Téléphone</label>
                  <p className="font-medium text-gray-900">{candidat.telephone || 'N/A'}</p>
                </div>
                {candidat.telephone_secondaire && (
                  <div>
                    <label className="text-sm text-gray-600">Téléphone secondaire</label>
                    <p className="font-medium text-gray-900">{candidat.telephone_secondaire}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-red-600" />
                Adresse
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Ville</label>
                  <p className="font-medium text-gray-900">{candidat.ville || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Quartier</label>
                  <p className="font-medium text-gray-900">{candidat.quartier || 'N/A'}</p>
                </div>
                {candidat.region && (
                  <div>
                    <label className="text-sm text-gray-600">Région</label>
                    <p className="font-medium text-gray-900">{candidat.region.nom}</p>
                  </div>
                )}
                {candidat.departement && (
                  <div>
                    <label className="text-sm text-gray-600">Département</label>
                    <p className="font-medium text-gray-900">{candidat.departement.nom}</p>
                  </div>
                )}
                {candidat.adresse_actuelle && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Adresse complète</label>
                    <p className="font-medium text-gray-900">{candidat.adresse_actuelle}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parents */}
            {(candidat.nom_pere || candidat.nom_mere) && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Parents / Tuteur</h3>
                <div className="grid grid-cols-2 gap-4">
                  {candidat.nom_pere && (
                    <>
                      <div>
                        <label className="text-sm text-gray-600">Nom du père</label>
                        <p className="font-medium text-gray-900">{candidat.nom_pere}</p>
                      </div>
                      {candidat.tel_pere && (
                        <div>
                          <label className="text-sm text-gray-600">Téléphone père</label>
                          <p className="font-medium text-gray-900">{candidat.tel_pere}</p>
                        </div>
                      )}
                    </>
                  )}
                  {candidat.nom_mere && (
                    <>
                      <div>
                        <label className="text-sm text-gray-600">Nom de la mère</label>
                        <p className="font-medium text-gray-900">{candidat.nom_mere}</p>
                      </div>
                      {candidat.tel_mere && (
                        <div>
                          <label className="text-sm text-gray-600">Téléphone mère</label>
                          <p className="font-medium text-gray-900">{candidat.tel_mere}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Informations académiques */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-purple-600" />
                Informations Académiques
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {candidat.filiere && (
                  <div>
                    <label className="text-sm text-gray-600">Filière choisie</label>
                    <p className="font-medium text-gray-900">
                      {candidat.filiere.libelle} ({candidat.filiere.code})
                    </p>
                  </div>
                )}
                {candidat.bac && (
                  <div>
                    <label className="text-sm text-gray-600">Type de BAC</label>
                    <p className="font-medium text-gray-900">{candidat.bac.libelle}</p>
                  </div>
                )}
                {candidat.serie && (
                  <div>
                    <label className="text-sm text-gray-600">Série</label>
                    <p className="font-medium text-gray-900">{candidat.serie.libelle}</p>
                  </div>
                )}
                {candidat.mention && (
                  <div>
                    <label className="text-sm text-gray-600">Mention</label>
                    <p className="font-medium text-gray-900">{candidat.mention.libelle}</p>
                  </div>
                )}
                {candidat.niveau && (
                  <div>
                    <label className="text-sm text-gray-600">Niveau</label>
                    <p className="font-medium text-gray-900">{candidat.niveau.libelle}</p>
                  </div>
                )}
                {candidat.etablissement_origine && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Établissement d'origine</label>
                    <p className="font-medium text-gray-900">{candidat.etablissement_origine}</p>
                  </div>
                )}
                {candidat.annee_obtention_diplome && (
                  <div>
                    <label className="text-sm text-gray-600">Année d'obtention</label>
                    <p className="font-medium text-gray-900">{candidat.annee_obtention_diplome}</p>
                  </div>
                )}
                {candidat.centre_examen && (
                  <div>
                    <label className="text-sm text-gray-600">Centre d'examen</label>
                    <p className="font-medium text-gray-900">{candidat.centre_examen.nom}</p>
                  </div>
                )}
                {candidat.centre_depot && (
                  <div>
                    <label className="text-sm text-gray-600">Centre de dépôt</label>
                    <p className="font-medium text-gray-900">{candidat.centre_depot.nom}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de validation */}
      {showValidateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Valider le dossier</h3>
                <p className="text-gray-600 text-sm">Action irréversible</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir valider le dossier de <strong>{candidat.prenom} {candidat.nom}</strong> ?
              <br /><br />
              ✅ Un email de confirmation sera envoyé au candidat avec son certificat d'enrôlement et un QR code.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowValidateModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleValidate}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validation...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Rejeter le dossier</h3>
                <p className="text-gray-600 text-sm">{candidat.prenom} {candidat.nom}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Veuillez indiquer le motif du rejet. Le candidat recevra un email avec ce motif.
            </p>
            <textarea
              value={motifRejet}
              onChange={(e) => setMotifRejet(e.target.value)}
              placeholder="Exemple: Documents non conformes, informations incomplètes..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setMotifRejet('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !motifRejet.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Rejet...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Rejeter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation de document */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {selectedDocument.type?.replace('_', ' ')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDocument.nom}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedDocument.url}
                  download
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Download size={16} />
                  Télécharger
                </a>
                <a
                  href={selectedDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Eye size={16} />
                  Nouvel onglet
                </a>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {(() => {
                const url = selectedDocument.url?.toLowerCase() || '';
                const isPdf = url.endsWith('.pdf');
                const isImage = url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp');
                
                if (isPdf) {
                  return (
                    <div className="w-full h-full min-h-[75vh] bg-white rounded-xl shadow-inner">
                      <iframe
                        src={`${selectedDocument.url}#view=FitH`}
                        className="w-full h-full min-h-[75vh] border-0 rounded-xl"
                        title={selectedDocument.nom}
                        type="application/pdf"
                      />
                    </div>
                  );
                } else if (isImage) {
                  return (
                    <div className="flex items-center justify-center min-h-[75vh]">
                      <img
                        src={selectedDocument.url}
                        alt={selectedDocument.nom}
                        className="max-w-full max-h-[80vh] h-auto rounded-xl shadow-lg border-2 border-gray-200"
                        onError={(e) => {
                          console.error('Erreur chargement image:', selectedDocument.url);
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="text-center p-8 bg-red-50 rounded-xl border-2 border-red-200">
                              <p class="text-red-900 font-semibold mb-2">❌ Erreur de chargement</p>
                              <p class="text-red-700 text-sm">Impossible d'afficher l'image</p>
                              <a href="${selectedDocument.url}" target="_blank" class="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Ouvrir dans un nouvel onglet
                              </a>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center justify-center min-h-[75vh]">
                      <div className="text-center p-8 bg-yellow-50 rounded-xl border-2 border-yellow-200 max-w-md">
                        <FileText className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                        <p className="text-yellow-900 font-semibold mb-2">
                          Aperçu non disponible
                        </p>
                        <p className="text-yellow-700 text-sm mb-4">
                          Ce type de fichier ne peut pas être visualisé directement.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <a
                            href={selectedDocument.url}
                            download
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                          >
                            <Download size={16} />
                            Télécharger
                          </a>
                          <a
                            href={selectedDocument.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                          >
                            <Eye size={16} />
                            Ouvrir
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CandidatDetail;