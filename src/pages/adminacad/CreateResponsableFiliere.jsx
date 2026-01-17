// src/pages/adminacad/CreateResponsableFiliere.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, UserPlus, AlertCircle, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const CreateResponsableFiliere = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [filieres, setFilieres] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    filiere_id: '',
  });

  useEffect(() => {
    fetchFilieres();
    if (isEditMode) {
      fetchResponsableData();
    }
  }, [id]);

  const fetchFilieres = async () => {
    try {
      const response = await adminAcadService.getFilieres();
      if (response.success) {
        // S'assurer que data est un tableau
        const filieresData = Array.isArray(response.data) ? response.data : [];
        setFilieres(filieresData);
      } else {
        setFilieres([]);
      }
    } catch (error) {
      console.error('Erreur chargement filières:', error);
      setFilieres([]);
    }
  };

  const fetchResponsableData = async () => {
    setLoading(true);
    try {
      const response = await adminAcadService.getRespFiliereDetail(id);
      if (response.success) {
        const data = response.data;
        setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          password: '', // Ne pas pré-remplir le mot de passe
          telephone: data.telephone || '',
          filiere_id: data.filiere_id || '',
        });
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      alert('Erreur lors du chargement des données');
      navigate('/adminacad/responsables-filieres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!isEditMode && !formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!formData.filiere_id) {
      newErrors.filiere_id = 'La filière est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        filiere_id: parseInt(formData.filiere_id),
        role: 'responsable_filiere'
      };

      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      let response;
      if (isEditMode) {
        response = await adminAcadService.updateRespFiliere(id, dataToSend);
      } else {
        response = await adminAcadService.createRespFiliere(dataToSend);
      }

      if (response.success) {
        alert(
          isEditMode 
            ? 'Responsable modifié avec succès' 
            : 'Responsable créé avec succès'
        );
        navigate('/adminacad/responsables-filieres');
      } else {
        // Afficher les erreurs du serveur
        if (typeof response.error === 'object') {
          setErrors(response.error);
        } else {
          alert(response.error || 'Erreur lors de l\'enregistrement');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="animate-spin h-12 w-12 text-indigo-600" />
        </div>
      </AdminAcadLayout>
    );
  }

  return (
    <AdminAcadLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/adminacad/responsables-filieres')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Modifier' : 'Nouveau'} Responsable de Filière
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode 
                  ? 'Modifier les informations du responsable' 
                  : 'Créer un nouveau compte responsable de filière'}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nom de famille"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.nom}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.prenom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Prénom"
                />
                {errors.prenom && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.prenom}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Informations de Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@exemple.com"
                  disabled={isEditMode} // Email non modifiable en mode édition
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
                {isEditMode && (
                  <p className="mt-1 text-xs text-gray-500">
                    L'email ne peut pas être modifié
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+237 6XX XX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {isEditMode ? 'Changer le mot de passe' : 'Mot de passe'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isEditMode ? 'Laisser vide pour ne pas changer' : 'Minimum 8 caractères'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
              {isEditMode && (
                <p className="mt-1 text-xs text-gray-500">
                  Laisser vide pour conserver le mot de passe actuel
                </p>
              )}
            </div>
          </div>

          {/* Filière */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Affectation
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filière <span className="text-red-500">*</span>
              </label>
              <select
                name="filiere_id"
                value={formData.filiere_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.filiere_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une filière</option>
                {Array.isArray(filieres) && filieres.map(filiere => (
                  <option key={filiere.id} value={filiere.id}>
                    {filiere.libelle} ({filiere.code})
                  </option>
                ))}
              </select>
              {errors.filiere_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.filiere_id}
                </p>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/adminacad/responsables-filieres')}
              disabled={submitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <>
                      <Save className="h-5 w-5" />
                      Enregistrer
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Créer le responsable
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Note d'information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Information importante :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Le responsable recevra un email de confirmation avec ses identifiants</li>
                <li>Il pourra gérer uniquement les candidats de sa filière</li>
                <li>Un responsable ne peut être affecté qu'à une seule filière</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminAcadLayout>
  );
};

export default CreateResponsableFiliere;