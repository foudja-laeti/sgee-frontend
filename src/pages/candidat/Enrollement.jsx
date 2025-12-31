import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Mail, GraduationCap, Users, CheckCircle, ChevronRight, 
  ChevronLeft, Upload, FileText, ShieldCheck, Edit, AlertCircle, Phone, MapPin
} from 'lucide-react';
import api from '../../services/api';

const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// ✅ VALIDATION TÉLÉPHONE CAMEROUN (+237)
const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  const cameroonPhoneRegex = /^(\+237|237)?[6-9]\d{8}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return cameroonPhoneRegex.test(cleanPhone);
};

const LocalInput = ({ label, required, error, helperText, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-100 transition-colors ${
        error 
          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
          : 'border-gray-200 focus:border-indigo-500'
      }`}
    />
    {helperText && (
      <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
        {helperText}
      </p>
    )}
  </div>
);

const LocalPhoneInput = ({ label, name, value, onChange, required, error }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
      {label} {required && <span className="text-red-500">*</span>}
      <Phone className="w-4 h-4 text-gray-400" />
    </label>
    <div className="relative">
      <input
        type="tel"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="6XX XX XX XX"
        className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-100 transition-colors ${
          error 
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
            : 'border-gray-200 focus:border-indigo-500'
        }`}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
        +237
      </span>
    </div>
    
    {/* Statut temps réel */}
    {value && (
      <div className={`mt-1 flex items-center gap-1 text-xs ${
        validatePhoneNumber(value) ? 'text-green-600' : 'text-red-600'
      }`}>
        {validatePhoneNumber(value) ? (
          <><CheckCircle className="w-3 h-3"/> Valide</>
        ) : (
          <><AlertCircle className="w-3 h-3"/> Incorrect</>
        )}
      </div>
    )}
  </div>
);

const LocalSelect = ({ label, required, error, options = [], ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-100 transition-colors bg-white ${
        error 
          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
          : 'border-gray-200 focus:border-indigo-500'
      }`}
    >
      <option value="">-- Choisir --</option>
      {Array.isArray(options) && options.map((opt, index) => (
        <option key={opt.value || index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, icon: Icon, fileName, onChange, required, error }) => {
  const fileInputRef = useRef(null);
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
          error
            ? 'border-red-300 bg-red-50/50 hover:border-red-400'
            : fileName
            ? 'border-green-300 bg-green-50'
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onChange}
          className="hidden"
          accept="image/*,.pdf"
        />
        <div className="flex flex-col items-center gap-2">
          {fileName ? (
            <>
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-green-700 text-center">
                {fileName}
              </span>
            </>
          ) : (
            <>
              <Icon className={`w-8 h-8 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              <span className={`text-sm text-center ${error ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {error ? 'Fichier obligatoire' : 'Cliquer pour ajouter'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const RecapItem = ({ label, value, onEdit, icon: Icon, isMissing = false }) => (
  <div className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer group ${
    isMissing 
      ? 'border-red-200 bg-red-50/30 hover:bg-red-50 hover:border-red-300' 
      : 'border-slate-200/50 bg-white hover:bg-slate-50/50 hover:border-slate-300'
  }`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
            isMissing 
              ? 'bg-red-50 text-red-500' 
              : 'bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-700 mb-1">{label}</p>
          <p className={`font-semibold truncate pr-2 group-hover:pr-0 ${
            isMissing ? 'text-red-800' : 'text-slate-900'
          }`}>
            {value || '—'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="p-2 ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
        title={`Modifier ${label}`}
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const Enrollement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quitusCode, quitusData } = location.state || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [files, setFiles] = useState({ photo: null, cni: null, diplome: null });
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState({});

  const [options, setOptions] = useState({
    bacs: [], series: [], mentions: [], filieres: [], niveaux: [],
    centresExamen: [], centresDepot: [], regions: [], departements: []
  });

  const [formData, setFormData] = useState({
    nom: quitusData?.nom || '',
    prenom: quitusData?.prenom || '',
    date_naissance: quitusData?.date_naissance || '',
    lieu_naissance: quitusData?.lieu_naissance || '',
    sexe: quitusData?.sexe || '',
    ville: '',
    quartier: '',
    bac_id: '', 
    serie_id: '', 
    mention_id: '', 
    mention_points: '',
    etablissement_origine: '', 
    annee_obtention_diplome: '',
    filiere_id: '', 
    niveau_id: '',
    centre_examen_id: '', 
    centre_depot_id: '',
    nom_pere: '', 
    tel_pere: '', 
    
    nom_mere: '', 
    tel_mere: '', 
    
    telephone_secondaire: '',
    email: '',
    region_id: '',
    departement_id: '',
  });

  const validateBirthDate = (date) => {
    if (!date) return false;
    const age = calculateAge(date);
    return age >= 14 && age <= 30;
  };

  // Chargement initial des options
  useEffect(() => {
    if (!quitusCode) {
      navigate('/home');
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoadError('');
        const [bacRes, mentionRes, cExRes, cDepRes, regionsRes, departementsRes] = await Promise.all([
          api.get('/config/bacs/'),
          api.get('/config/mentions/'),
          api.get('/config/centres-examen/'),
          api.get('/config/centres-depot/'),
          api.get('/config/regions/'),
          api.get('/config/departements/'),
        ]);

        setOptions((prev) => ({
          ...prev,
          bacs: bacRes.data.results || bacRes.data || [],
          mentions: mentionRes.data.results || mentionRes.data || [],
          centresExamen: cExRes.data.results || cExRes.data || [],
          centresDepot: cDepRes.data.results || cDepRes.data || [],
          regions: regionsRes.data.results || regionsRes.data || [],
          departements: departementsRes.data.results || departementsRes.data || [],
        }));
      } catch (err) {
        console.error('Erreur chargement:', err);
        setLoadError("Impossible de charger les données.");
      }
    };

    fetchInitialData();
  }, [quitusCode, navigate]);

  // Cascade BAC -> Series
  useEffect(() => {
    if (!formData.bac_id) {
      setOptions((prev) => ({ ...prev, series: [], filieres: [], niveaux: [] }));
      setFormData((prev) => ({ ...prev, serie_id: '', filiere_id: '', niveau_id: '' }));
      return;
    }
    const fetchSeries = async () => {
      try {
        const res = await api.get(`/config/bacs/${formData.bac_id}/series/`);
        setOptions((prev) => ({ ...prev, series: res.data || [] }));
      } catch (err) {
        console.error('Erreur séries:', err);
      }
    };
    fetchSeries();
  }, [formData.bac_id]);

  // Cascade Series -> Filieres
  useEffect(() => {
    if (!formData.serie_id) {
      setOptions((prev) => ({ ...prev, filieres: [], niveaux: [] }));
      setFormData((prev) => ({ ...prev, filiere_id: '', niveau_id: '' }));
      return;
    }
    const fetchFilieres = async () => {
      try {
        const res = await api.get(`/config/series/${formData.serie_id}/filieres/`);
        setOptions((prev) => ({ ...prev, filieres: res.data || [] }));
      } catch (err) {
        console.error('Erreur filières:', err);
      }
    };
    fetchFilieres();
  }, [formData.serie_id]);

  // Cascade Filieres -> Niveaux
  useEffect(() => {
    if (!formData.filiere_id || !formData.serie_id) {
      setOptions((prev) => ({ ...prev, niveaux: [] }));
      setFormData((prev) => ({ ...prev, niveau_id: '' }));
      return;
    }
    const fetchNiveaux = async () => {
      try {
        const res = await api.get(`/config/series/${formData.serie_id}/filieres/${formData.filiere_id}/niveaux/`);
        setOptions((prev) => ({ ...prev, niveaux: res.data || [] }));
      } catch (err) {
        console.error('Erreur niveaux:', err);
      }
    };
    fetchNiveaux();
  }, [formData.filiere_id, formData.serie_id]);

  const validateStep1 = useCallback(() => {
    const newErrors = {};
    
    // Champs obligatoires étape 1
    if (!formData.nom?.trim()) newErrors.nom = true;
    if (!formData.prenom?.trim()) newErrors.prenom = true;
    if (!formData.date_naissance || !validateBirthDate(formData.date_naissance)) {
      newErrors.date_naissance = true;
    }
    if (!formData.lieu_naissance?.trim()) newErrors.lieu_naissance = true;
    if (!formData.sexe) newErrors.sexe = true;
    if (!formData.email?.trim()) newErrors.email = true;
    
    // Téléphone principal
    if (!formData.telephone_secondaire?.trim()) {
      newErrors.telephone_secondaire = 'Numéro obligatoire';
    } else if (!validatePhoneNumber(formData.telephone_secondaire)) {
      newErrors.telephone_secondaire = 'Format +237 6XX XX XX XX requis';
    }
    
    if (!formData.region_id) newErrors.region_id = true;
    if (!formData.departement_id) newErrors.departement_id = true;
    if (!formData.ville?.trim()) newErrors.ville = true;
    if (!formData.quartier?.trim()) newErrors.quartier = true;
    if (!files.photo) newErrors.photo = true;
    if (!files.cni) newErrors.cni = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, files]);

  const validateStep2 = useCallback(() => {
    const newErrors = {};
    
    if (!formData.bac_id) newErrors.bac_id = true;
    if (!formData.serie_id) newErrors.serie_id = true;
    if (!formData.filiere_id) newErrors.filiere_id = true;
    if (!formData.niveau_id) newErrors.niveau_id = true;
    if (!formData.etablissement_origine?.trim()) newErrors.etablissement_origine = true;
    
    const selectedBac = options.bacs.find(b => b.id === parseInt(formData.bac_id));
    const isGCE = selectedBac?.code === 'GCE_AL';
    
    if (isGCE && (!formData.mention_points || formData.mention_points < 2 || formData.mention_points > 25)) {
      newErrors.mention_points = true;
    }
    if (!isGCE && !formData.mention_id) newErrors.mention_id = true;
    if (!formData.annee_obtention_diplome) newErrors.annee_obtention_diplome = true;
    if (!formData.centre_examen_id) newErrors.centre_examen_id = true;
    if (!formData.centre_depot_id) newErrors.centre_depot_id = true;
    if (!files.diplome) newErrors.diplome = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, files, options.bacs]);

  const validateStep3 = useCallback(() => {
    const newErrors = {};
    
    if (!formData.nom_pere?.trim()) newErrors.nom_pere = 'Nom obligatoire';
   
    
    if (!formData.tel_pere?.trim()) {
      newErrors.tel_pere = 'Numéro Père obligatoire';
    } else if (!validatePhoneNumber(formData.tel_pere)) {
      newErrors.tel_pere = 'Format +237 6XX XX XX XX requis';
    }
    
    if (!formData.nom_mere?.trim()) newErrors.nom_mere = 'Nom obligatoire';
    
    
    if (!formData.tel_mere?.trim()) {
      newErrors.tel_mere = 'Numéro Mère obligatoire';
    } else if (!validatePhoneNumber(formData.tel_mere)) {
      newErrors.tel_mere = 'Format +237 6XX XX XX XX requis';
    }

    setErrors(newErrors);
    
    return Object.values(newErrors).every(value => !value);
  }, [formData]);

  const nextStep = () => {
    let isValid = false;
    switch(step) {
      case 1: isValid = validateStep1(); break;
      case 2: isValid = validateStep2(); break;
      case 3: isValid = validateStep3(); break;
    }
    
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 4));
      setErrors({});
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }

    if (name === 'bac_id') {
      setFormData((prev) => ({
        ...prev,
        bac_id: value,
        serie_id: '', filiere_id: '', niveau_id: '',
        mention_id: '', mention_points: '',
      }));
      setOptions((prev) => ({ ...prev, series: [], filieres: [], niveaux: [] }));
      return;
    }
    if (name === 'serie_id') {
      setFormData((prev) => ({
        ...prev,
        serie_id: value,
        filiere_id: '', niveau_id: '',
      }));
      setOptions((prev) => ({ ...prev, filieres: [], niveaux: [] }));
      return;
    }
    if (name === 'filiere_id') {
      setFormData((prev) => ({
        ...prev,
        filiere_id: value,
        niveau_id: '',
      }));
      return;
    }
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleFinalSubmit = async () => {
    const finalErrors = {};
  
    // ✅ 1. VALIDATION PERSONNELS OBLIGATOIRES
    ['nom', 'prenom', 'date_naissance', 'lieu_naissance', 'sexe', 'email', 'telephone_secondaire',
     'ville', 'quartier', 'region_id', 'departement_id'].forEach(key => {
      if (!formData[key]?.toString().trim()) {
        finalErrors[key] = 'Champ obligatoire';
      }
    });
  
    // ✅ Âge entre 14 et 30 ans
    if (formData.date_naissance) {
      const age = calculateAge(formData.date_naissance);
      if (age < 14) {
        finalErrors.date_naissance = 'Vous devez avoir au moins 14 ans';
      } else if (age > 30) {
        finalErrors.date_naissance = 'Vous ne pouvez pas avoir plus de 30 ans';
      }
    } else {
      finalErrors.date_naissance = 'Date de naissance obligatoire';
    }
  
    // Email valide
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      finalErrors.email = 'Email invalide';
    }
  
    // ✅ 2. VALIDATION SCOLAIRE OBLIGATOIRE
    ['bac_id', 'serie_id', 'filiere_id', 'niveau_id', 'etablissement_origine', 'annee_obtention_diplome',
     'centre_examen_id', 'centre_depot_id'].forEach(key => {
      if (!formData[key]) {
        finalErrors[key] = 'Champ obligatoire';
      }
    });
  
    // ✅ 3. VALIDATION FAMILLE OBLIGATOIRE
    ['nom_pere', 'nom_mere', 'tel_pere', 'tel_mere'].forEach(key => {
      if (!formData[key]?.trim()) {
        finalErrors[key] = 'Champ obligatoire';
      }
    });
  
    // ✅ 4. VALIDATION TÉLÉPHONES INDIVIDUELS
    const phoneFields = {
      telephone_secondaire: 'Téléphone principal',
      tel_pere: 'Téléphone père',
      tel_mere: 'Téléphone mère'
    };
  
    Object.entries(phoneFields).forEach(([field, label]) => {
      const phone = formData[field];
      if (!phone?.trim()) {
        finalErrors[field] = `${label} obligatoire`;
      } else if (!validatePhoneNumber(phone)) {
        finalErrors[field] = `${label} invalide (format: +237XXXXXXXXX ou 6XXXXXXXX)`;
      }
    });
  
    // ✅ 5. ANTI-DOUBLONS TÉLÉPHONES
    const phones = [formData.telephone_secondaire, formData.tel_pere, formData.tel_mere].filter(Boolean);
    if (phones.length === 3) {
      const cleanedPhones = phones.map(p => p.replace(/[\s\-\(\)]/g, ''));
      const hasDuplicates = cleanedPhones.length !== new Set(cleanedPhones).size;
      
      if (hasDuplicates) {
        finalErrors.telephone_secondaire = 'Les 3 numéros doivent être différents';
        finalErrors.tel_pere = 'Les 3 numéros doivent être différents';
        finalErrors.tel_mere = 'Les 3 numéros doivent être différents';
      }
    }
  
    // ✅ 6. VALIDATION FICHIERS OBLIGATOIRES
    const fileFields = {
      photo: 'Photo d\'identité',
      cni: 'CNI / Acte de naissance',
      diplome: 'Diplôme / Relevé de notes'
    };
  
    Object.entries(fileFields).forEach(([key, label]) => {
      if (!files[key]) {
        finalErrors[key] = `${label} obligatoire`;
      }
    });
  
    // ❌ SI ERREURS : AFFICHAGE ET NAVIGATION INTELLIGENTE
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      
      // Construire le message d'erreur groupé
      const errorsByStep = {
        1: ['nom', 'prenom', 'date_naissance', 'lieu_naissance', 'sexe', 'email', 'telephone_secondaire', 
            'ville', 'quartier', 'region_id', 'departement_id', 'photo', 'cni'],
        2: ['bac_id', 'serie_id', 'filiere_id', 'niveau_id', 'etablissement_origine', 
            'annee_obtention_diplome', 'centre_examen_id', 'centre_depot_id', 'diplome'],
        3: ['nom_pere', 'nom_mere', 'tel_pere', 'tel_mere']
      };
      
      let targetStep = 1;
      let errorMessage = '❌ Veuillez corriger les erreurs suivantes :\n\n';
      
      // Déterminer l'étape problématique et construire le message
      for (const [stepNum, stepFields] of Object.entries(errorsByStep)) {
        const stepErrors = Object.entries(finalErrors)
         .filter(([key]) => stepFields.includes(key));
        
        if (stepErrors.length > 0) {
          if (targetStep === 1) targetStep = parseInt(stepNum);
          
          const stepName = stepNum === '1' ? 'Identité & Contact' : 
                          stepNum === '2' ? 'Parcours Scolaire' : 
                          'Responsables Légaux';
          
          errorMessage += `📍 ${stepName} :\n`;
          stepErrors.forEach(([key, msg]) => {
            const fieldLabel = key.replace(/_/g, ' ')
              .replace(/id$/, '')
              .replace(/file$/, '')
              .trim();
            errorMessage += `  • ${fieldLabel} : ${msg}\n`;
          });
          errorMessage += '\n';
        }
      }
      
      alert(errorMessage);
      setStep(targetStep);
      
      // Scroll vers le haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    // ✅ CONFIRMATION AVANT SOUMISSION
    const age = calculateAge(formData.date_naissance);
    const confirmationMessage = 
      `⚠️ CONFIRMATION FINALE\n\n` +
      `Êtes-vous sûr(e) d'avoir bien rempli toutes vos informations ?\n\n` +
      `📋 Nom : ${formData.nom} ${formData.prenom}\n` +
      `📅 Âge : ${age} ans\n` +
      `📧 Email : ${formData.email}\n` +
      `📱 Téléphone : ${formData.telephone_secondaire}\n\n` +
      `⚠️ ATTENTION : Cette action est IRRÉVERSIBLE.\n` +
      `Une fois envoyé, vous ne pourrez plus modifier votre dossier.\n\n` +
      `Voulez-vous vraiment soumettre votre dossier ?`;
  
    const userConfirmed = window.confirm(confirmationMessage);
  
    if (!userConfirmed) {
      console.log('❌ Soumission annulée par l\'utilisateur');
      return;
    }
  
    // ✅ TOUT OK → SOUMISSION
    setLoading(true);
  
    try {
      const data = new FormData();
      
      // ✅ FIX 1: Nom du champ backend (quitus_code → code_quitus)
      data.append('code_quitus', quitusCode);
      
      // ✅ FIX 2: TOUS les champs explicitement (même vides)
      const requiredFields = {
        'nom': formData.nom,
        'prenom': formData.prenom,
        'date_naissance': formData.date_naissance,
        'lieu_naissance': formData.lieu_naissance,
        'sexe': formData.sexe,
        'ville': formData.ville,
        'quartier': formData.quartier || '',
        'email': formData.email || '',
        'region_id': formData.region_id,
        'departement_id': formData.departement_id,
        'bac_id': formData.bac_id,
        'serie_id': formData.serie_id,
        'filiere_id': formData.filiere_id,
        'niveau_id': formData.niveau_id || null,
        'mention_id': formData.mention_id || null,
        'mention_points': formData.mention_points || null,
        'etablissement_origine': formData.etablissement_origine,
        'annee_obtention_diplome': formData.annee_obtention_diplome,
        'centre_examen_id': formData.centre_examen_id,
        'centre_depot_id': formData.centre_depot_id,
        'nom_pere': formData.nom_pere || '',
        'tel_pere': formData.tel_pere || '',
        'profession_pere': formData.profession_pere || '',
        'nom_mere': formData.nom_mere || '',
        'tel_mere': formData.tel_mere || '',
        'profession_mere': formData.profession_mere || '',
        'telephone_secondaire': formData.telephone_secondaire
      };
  
      Object.entries(requiredFields).forEach(([key, value]) => {
        data.append(key, value || '');
      });
  
      // ✅ FIX 3: Fichiers OBLIGATOIRES
      if (!files.photo) throw new Error('Photo manquante');
      if (!files.cni) throw new Error('CNI manquante');
      if (!files.diplome) throw new Error('Diplôme manquant');
      
      data.append('photo_file', files.photo);
      data.append('cni_file', files.cni);
      data.append('diplome_file', files.diplome);
  
      // ✅ FIX 4: DEBUG FormData
      console.log('📤 ENVOI FormData COMPLET:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
  
      // ✅ FIX 5: URL et Headers corrects
      const response = await api.post('/candidats/enrollement/', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('✅ SUCCÈS:', response.data);
      setSubmitSuccess(true);
      
    } catch (err) {
      console.error('❌ ERREUR COMPLÈTE:', err.response?.data || err.message);
      
      // ✅ Gestion backend serializer errors
      const errorData = err.response?.data;
      
      if (errorData?.code_quitus) {
        alert(`❌ CODE QUITUS\n\n${errorData.code_quitus[0]}`);
        return;
      }
      
      if (errorData?.non_field_errors) {
        alert(`❌ SERVEUR\n\n${errorData.non_field_errors[0]}`);
        return;
      }
      
      // Erreurs champs spécifiques
      if (errorData && typeof errorData === 'object') {
        let msg = '❌ ERREURS VALIDATION\n\n';
        Object.entries(errorData).forEach(([field, errors]) => {
          const fieldName = field.replace(/_id$/, '').replace(/_/g, ' ').toUpperCase();
          msg += `• ${fieldName}: ${Array.isArray(errors) ? errors[0] : errors}\n`;
        });
        alert(msg);
        return;
      }
      
      // Erreur générique
      alert(`❌ ${err.response?.status || 'Erreur'}:\n${errorData?.error || err.message || 'Erreur inconnue'}`);
      
    } finally {
      setLoading(false);
    }
  };
  
  const getLabel = (id, list) => {
    const item = Array.isArray(list) ? list.find(i => i.id === parseInt(id)) : null;
    return item ? `${item.code || ''} - ${item.libelle || item.nom || '—'}` : '—';
  };

  const selectedBac = Array.isArray(options.bacs) 
    ? options.bacs.find(b => b.id === parseInt(formData.bac_id))
    : null;
  const isGCE = selectedBac?.code === 'GCE_AL';
  const age = calculateAge(formData.date_naissance);

  const currentYear = new Date().getFullYear();
  const annees = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const getBacOptions = () => 
    Array.isArray(options.bacs) ? options.bacs.map(b => ({ value: b.id, label: b.libelle })) : [];
  const getSerieOptions = () => 
    Array.isArray(options.series) ? options.series.map(s => ({ value: s.id, label: `${s.code} - ${s.libelle}` })) : [];
  const getMentionOptions = () => 
    Array.isArray(options.mentions) ? options.mentions.map(m => ({ value: m.id, label: m.libelle })) : [];
  const getFiliereOptions = () => 
    Array.isArray(options.filieres) ? options.filieres.map(f => ({ value: f.id, label: `${f.code} - ${f.libelle}` })) : [];
  const getNiveauOptions = () => 
    Array.isArray(options.niveaux) ? options.niveaux.map(n => ({ value: n.id, label: `${n.code} - ${n.libelle}` })) : [];
  const getRegionOptions = () => 
    Array.isArray(options.regions) ? options.regions.map(r => ({ value: r.id, label: r.nom || r.libelle })) : [];
  const getDepartementOptions = () => 
    Array.isArray(options.departements) ? options.departements.map(d => ({ value: d.id, label: d.nom || d.libelle })) : [];
  const getCentreExamenOptions = () => 
    Array.isArray(options.centresExamen) ? options.centresExamen.map(c => ({ value: c.id, label: `${c.code} - ${c.nom} (${c.ville})` })) : [];
  const getCentreDepotOptions = () => 
    Array.isArray(options.centresDepot) ? options.centresDepot.map(c => ({ value: c.id, label: `${c.code} - ${c.nom} (${c.ville})` })) : [];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Dossier envoyé !</h2>
          <p className="text-gray-600 mb-6">Votre inscription a été enregistrée avec succès.</p>
          <button onClick={() => navigate('/home')} className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-indigo-600 p-6 text-white">
            <div className="flex items-center gap-2 text-sm mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Inscription Session 2025</span>
            </div>
            <h1 className="text-2xl font-bold">Dossier d'Inscription</h1>
            <p className="text-indigo-100 mt-1">Code Quitus: {quitusCode}</p>
          </div>

          <div className="p-6">
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              ))}
            </div>

            {loadError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{loadError}</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
              {/* ÉTAPE 1: PERSONNEL */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LocalInput label="Nom" name="nom" value={formData.nom} onChange={handleChange} required error={errors.nom} />
                    <LocalInput label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required error={errors.prenom} />
                    <LocalInput 
  label="Date de naissance (14-30 ans)" 
  type="date" 
  name="date_naissance" 
  value={formData.date_naissance} 
  onChange={handleChange} 
  required 
  error={errors.date_naissance}
  helperText={
    formData.date_naissance && !validateBirthDate(formData.date_naissance) 
      ? calculateAge(formData.date_naissance) < 14 
        ? 'Âge minimum requis : 14 ans' 
        : 'Âge maximum autorisé : 30 ans'
      : ''
  }
/>
                    <LocalInput label="Lieu de naissance" name="lieu_naissance" value={formData.lieu_naissance} onChange={handleChange} required error={errors.lieu_naissance} />
                    <LocalSelect label="Sexe" name="sexe" value={formData.sexe} onChange={handleChange} 
                      options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]} required error={errors.sexe} />
                    <LocalInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required error={errors.email} />
                    <LocalPhoneInput 
                      label="Téléphone principal" 
                      name="telephone_secondaire" 
                      value={formData.telephone_secondaire} 
                      onChange={handleChange} 
                      required 
                      error={errors.telephone_secondaire}
                    />
                    <LocalSelect label="Région d'origine" name="region_id" value={formData.region_id} onChange={handleChange} options={getRegionOptions()} required error={errors.region_id} />
                    <LocalSelect label="Département d'origine" name="departement_id" value={formData.departement_id} onChange={handleChange} options={getDepartementOptions()} required error={errors.departement_id} />
                    <LocalInput label="Ville de résidence" name="ville" value={formData.ville} onChange={handleChange} required error={errors.ville} />
                    <LocalInput label="Quartier de résidence" name="quartier" value={formData.quartier} onChange={handleChange} required error={errors.quartier} />
                    <div className="md:col-span-2">
                      <FileUpload label="Photo d'identité" icon={User} fileName={files.photo?.name} onChange={(e) => handleFileChange(e, 'photo')} required error={errors.photo} />
                    </div>
                    
                    <div className="md:col-span-2">
                    <FileUpload label="CNI ou Acte de naissance" icon={Upload} fileName={files.cni?.name} onChange={(e) => handleFileChange(e, 'cni')} required error={errors.cni} />
                  </div>
                </div>
                {formData.date_naissance && age > 0 && (
  <p className={`mt-4 text-sm font-medium ${
    age >= 14 && age <= 30 ? 'text-green-700' : 'text-red-700'
  }`}>
    Âge calculé: <strong>{age} ans</strong> 
    {age < 14 && ' (Minimum 14 ans requis)'}
    {age > 30 && ' (Maximum 30 ans autorisé)'}
  </p>
)}
              </div>
            )}

            {/* ÉTAPE 2: SCOLAIRE */}
            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Parcours scolaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LocalSelect label="Baccalauréat" name="bac_id" value={formData.bac_id} onChange={handleChange} options={getBacOptions()} required error={errors.bac_id} />
                  {formData.bac_id && <LocalSelect label="Série" name="serie_id" value={formData.serie_id} onChange={handleChange} options={getSerieOptions()} required error={errors.serie_id} />}
                  {formData.serie_id && <LocalSelect label="Filière" name="filiere_id" value={formData.filiere_id} onChange={handleChange} options={getFiliereOptions()} required error={errors.filiere_id} />}
                  {formData.filiere_id && <LocalSelect label="Niveau" name="niveau_id" value={formData.niveau_id} onChange={handleChange} options={getNiveauOptions()} required error={errors.niveau_id} />}
                  <LocalInput label="Établissement" name="etablissement_origine" value={formData.etablissement_origine} onChange={handleChange} required error={errors.etablissement_origine} />
                  {isGCE ? (
                    <LocalInput label="Points GCE (2-25)" type="number" name="mention_points" min="2" max="25" value={formData.mention_points} onChange={handleChange} required error={errors.mention_points} />
                  ) : (
                    <LocalSelect label="Mention" name="mention_id" value={formData.mention_id} onChange={handleChange} options={getMentionOptions()} required error={errors.mention_id} />
                  )}
                  <LocalSelect label="Année d'obtention" name="annee_obtention_diplome" value={formData.annee_obtention_diplome} onChange={handleChange} 
                    options={annees.map((y) => ({ value: y.toString(), label: y.toString() }))} required error={errors.annee_obtention_diplome} />
                  <LocalSelect label="Centre d'examen" name="centre_examen_id" value={formData.centre_examen_id} onChange={handleChange} options={getCentreExamenOptions()} required error={errors.centre_examen_id} />
                  <LocalSelect label="Centre de dépôt" name="centre_depot_id" value={formData.centre_depot_id} onChange={handleChange} options={getCentreDepotOptions()} required error={errors.centre_depot_id} />
                  <div className="md:col-span-2">
                    <FileUpload label="Diplôme" icon={FileText} fileName={files.diplome?.name} onChange={(e) => handleFileChange(e, 'diplome')} required error={errors.diplome} />
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3: FAMILLE OBLIGATOIRE */}
            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Parents / Tuteurs <span className="text-red-500 text-lg">*</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-6 bg-red-50/30 border-2 border-red-200 rounded-xl">
                    <p className="font-bold text-lg text-red-800 mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6" /> Père <span className="text-red-500">*</span>
                    </p>
                    <LocalInput label="Nom complet" name="nom_pere" value={formData.nom_pere} onChange={handleChange} required error={errors.nom_pere} />
                    
                    <LocalPhoneInput 
                      label="Téléphone Père" 
                      name="tel_pere" 
                      value={formData.tel_pere} 
                      onChange={handleChange} 
                      required 
                      error={errors.tel_pere}
                    />
                  </div>
                  <div className="space-y-4 p-6 bg-red-50/30 border-2 border-red-200 rounded-xl">
                    <p className="font-bold text-lg text-red-800 mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6" /> Mère <span className="text-red-500">*</span>
                    </p>
                    <LocalInput label="Nom complet" name="nom_mere" value={formData.nom_mere} onChange={handleChange} required error={errors.nom_mere} />
                   
                    <LocalPhoneInput 
                      label="Téléphone Mère" 
                      name="tel_mere" 
                      value={formData.tel_mere} 
                      onChange={handleChange} 
                      required 
                      error={errors.tel_mere}
                    />
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 inline mr-2" />
                  <span className="text-sm font-medium text-red-800">
                    Tous les champs familiaux sont OBLIGATOIRES
                  </span>
                </div>
              </div>
            )}

            {/* ÉTAPE 4: RÉCAPITULATIF COMPLET */}
{step === 4 && (
  <div>
    <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
      <div className="flex items-start gap-3 mb-2">
        <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
        <h3 className="text-xl font-bold text-amber-900">VÉRIFICATION FINALE</h3>
      </div>
      <p className="text-amber-800 font-medium">Aucune modification après envoi</p>
    </div>

    {/* ✅ RÉCAPITULATIF COMPLET - TOUS LES CHAMPS */}

    {/* SECTION 1: IDENTITÉ & CONTACT */}
    <div className="mb-8">
      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" /> Identité & Contact
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecapItem label="Nom complet" value={`${formData.nom || ''} ${formData.prenom || ''}`} onEdit={() => setStep(1)} icon={User} isMissing={!formData.nom || !formData.prenom} />
        <RecapItem label="Date naissance" value={formData.date_naissance || '—'} onEdit={() => setStep(1)} icon={GraduationCap} isMissing={!formData.date_naissance} />
        <RecapItem 
  label="Âge" 
  value={`${age} ans ${age >= 14 && age <= 30 ? '✅' : '❌'}`} 
  onEdit={() => setStep(1)} 
  icon={User} 
  isMissing={age < 14 || age > 30} 
/>
        <RecapItem label="Lieu naissance" value={formData.lieu_naissance || '—'} onEdit={() => setStep(1)} icon={MapPin} isMissing={!formData.lieu_naissance} />
        <RecapItem label="Sexe" value={formData.sexe === 'M' ? 'Masculin' : formData.sexe === 'F' ? 'Féminin' : '—'} onEdit={() => setStep(1)} icon={User} isMissing={!formData.sexe} />
        <RecapItem label="Email" value={formData.email || '—'} onEdit={() => setStep(1)} icon={Mail} isMissing={!formData.email} />
        <RecapItem label="Téléphone principal" value={formData.telephone_secondaire || '—'} onEdit={() => setStep(1)} icon={Phone} isMissing={!formData.telephone_secondaire} />
        <RecapItem label="Région" value={getLabel(formData.region_id, options.regions)} onEdit={() => setStep(1)} icon={MapPin} isMissing={!formData.region_id} />
        <RecapItem label="Département" value={getLabel(formData.departement_id, options.departements)} onEdit={() => setStep(1)} icon={MapPin} isMissing={!formData.departement_id} />
        <RecapItem label="Ville" value={formData.ville || '—'} onEdit={() => setStep(1)} icon={MapPin} isMissing={!formData.ville} />
        <RecapItem label="Quartier" value={formData.quartier || '—'} onEdit={() => setStep(1)} icon={MapPin} isMissing={!formData.quartier} />
        <RecapItem label="Photo" value={files.photo?.name ? '✅ Uploadé' : '❌ Manquant'} onEdit={() => setStep(1)} icon={User} isMissing={!files.photo} />
        <RecapItem label="CNI/Acte" value={files.cni?.name ? '✅ Uploadé' : '❌ Manquant'} onEdit={() => setStep(1)} icon={Upload} isMissing={!files.cni} />
      </div>
    </div>

    {/* SECTION 2: PARCOURS SCOLAIRE */}
    <div className="mb-8">
      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5" /> Parcours Scolaire
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecapItem label="Baccalauréat" value={getLabel(formData.bac_id, options.bacs)} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={!formData.bac_id} />
        <RecapItem label="Série" value={getLabel(formData.serie_id, options.series)} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={!formData.serie_id} />
        <RecapItem label="Filière" value={getLabel(formData.filiere_id, options.filieres)} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={!formData.filiere_id} />
        <RecapItem label="Niveau" value={getLabel(formData.niveau_id, options.niveaux)} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={!formData.niveau_id} />
        <RecapItem label="Établissement" value={formData.etablissement_origine || '—'} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={!formData.etablissement_origine} />
        <RecapItem label={isGCE ? 'Points GCE' : 'Mention'} value={isGCE ? formData.mention_points || '—' : getLabel(formData.mention_id, options.mentions)} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={isGCE ? !formData.mention_points : !formData.mention_id} />
        <RecapItem label="Année obtention" value={formData.annee_obtention_diplome || '—'} onEdit={() => setStep(2)} icon={GraduationCap} isMissing={!formData.annee_obtention_diplome} />
        <RecapItem label="Centre examen" value={getLabel(formData.centre_examen_id, options.centresExamen)} onEdit={() => setStep(2)} icon={MapPin} isMissing={!formData.centre_examen_id} />
        <RecapItem label="Centre dépôt" value={getLabel(formData.centre_depot_id, options.centresDepot)} onEdit={() => setStep(2)} icon={MapPin} isMissing={!formData.centre_depot_id} />
        <RecapItem label="Diplôme" value={files.diplome?.name ? '✅ Uploadé' : '❌ Manquant'} onEdit={() => setStep(2)} icon={FileText} isMissing={!files.diplome} />
      </div>
    </div>

    {/* SECTION 3: PARENTS/TUTEURS */}
    <div className="mb-8">
      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" /> Parents / Tuteurs
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecapItem label="Père - Nom" value={formData.nom_pere || '—'} onEdit={() => setStep(3)} icon={Users} isMissing={!formData.nom_pere} />
        
        <RecapItem label="Père - Téléphone" value={formData.tel_pere || '—'} onEdit={() => setStep(3)} icon={Phone} isMissing={!formData.tel_pere || !validatePhoneNumber(formData.tel_pere)} />
        <RecapItem label="Mère - Nom" value={formData.nom_mere || '—'} onEdit={() => setStep(3)} icon={Users} isMissing={!formData.nom_mere} />
       
        <RecapItem label="Mère - Téléphone" value={formData.tel_mere || '—'} onEdit={() => setStep(3)} icon={Phone} isMissing={!formData.tel_mere || !validatePhoneNumber(formData.tel_mere)} />
      </div>
    </div>

    {/* SECTION 4: VALIDATIONS GLOBALES */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      
      
      
    </div>
  </div>
)}


            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={step === 1 ? () => navigate('/home') : prevStep}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {step === 1 ? 'Accueil' : 'Précédent'}
              </button>

              {step < 4 ? (
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="px-12 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    'ENVOYER DOSSIER'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Enrollement;
