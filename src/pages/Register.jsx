import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, User, Lock, Hash, ArrowRight,
  UserPlus, Eye, EyeOff, CheckCircle, Loader2
} from 'lucide-react';

import api from '../services/api';
import quitusService from '../services/QuitusService';

const Alert = ({ message, className }) => (
  <div className={`p-3 rounded-xl ${className}`}>
    {message}
  </div>
);

const Loader = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const PasswordStrength = ({ password }) => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noRepeat: !/(.)\1{2,}/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;
  const strength = score >= 6 ? 'Très fort' : score >= 4 ? 'Fort' : score >= 3 ? 'Moyen' : 'Faible';
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-emerald-600'];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">Force du mot de passe</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${score >= 6 ? 'text-emerald-700 bg-emerald-100' : score >= 4 ? 'text-green-700 bg-green-100' : score >= 3 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'}`}>
          {strength}
        </span>
      </div>
      <div className="flex space-x-1 mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[Math.min(i, 4)] : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [quitusStatus, setQuitusStatus] = useState(null);
  
  // 🔥 FORMULAIRE COMPLÈTEMENT VIDE
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    code_quitus: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    sexe: '',
    telephone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password' || name === 'password_confirm') {
      setPasswordsMatch(formData.password === value);
    }
    
    setError('');
    
    if (name === 'code_quitus' && value.length === 6 && /^\d{6}$/.test(value)) {
      checkQuitus(value);
    } else if (name === 'code_quitus') {
      setQuitusStatus(null);
    }
  };

  const checkQuitus = async (code) => {
    console.log('🔍 CHECK QUITUS:', code);
    setQuitusStatus('checking');
    
    try {
      const result = await quitusService.verifierCode(code);
      
      console.log('📡 RESPONSE:', result);
      
      if (result.success) {
        if (result.data.status === 'available') {
          setQuitusStatus('valid');
          setError('');
        } else if (result.data.status === 'owned') {
          setQuitusStatus('used');
          setError("Ce code est déjà associé à votre compte");
        }
      } else {
        setQuitusStatus('invalid');
        const errorMsg = result.error?.error || result.error?.message || "Code quitus invalide";
        setError(errorMsg);
      }
    } catch (err) {
      console.error('❌ QUITUS ERROR:', err);
      setQuitusStatus('invalid');
      setError("Erreur de vérification");
    }
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) &&
      !/(.)\1{2,}/.test(password) &&
      !/\s/.test(password)
    );
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    return /^\+2376\d{8}$/.test(cleanPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 SUBMIT:', formData);
    setLoading(true);
    setError('');

    // Validations locales
    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Mot de passe trop faible');
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.telephone)) {
      setError('Téléphone: +2376XXXXXXXX');
      setLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(formData.code_quitus)) {
      setError('Code quitus: 6 chiffres');
      setLoading(false);
      return;
    }

    if (quitusStatus !== 'valid') {
      setError('Code quitus non validé');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register/', formData);
      
      console.log('✅ REGISTER SUCCESS:', response.data);
      setSuccess('Inscription réussie !');
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err) {
      console.error('❌ REGISTER ERROR:', err);
      
      const errorData = err.response?.data;
      const errorMsg = 
        errorData?.code_quitus?.[0] || 
        errorData?.email?.[0] || 
        errorData?.non_field_errors?.[0] || 
        errorData?.detail ||
        errorData?.message ||
        Object.values(errorData || {})[0] || 
        'Erreur lors de l\'inscription';
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
        <div className="p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Créer un compte</h3>
            <p className="text-gray-500 text-sm mt-1">Espace Candidat National</p>
          </div>

          {error && <Alert message={error} className="mb-6 bg-red-50 text-red-600 text-xs font-medium border border-red-100 text-center" />}
          {success && <Alert message={success} className="mb-6 bg-green-50 text-green-600 text-xs font-medium border border-green-100 text-center" />}

          <div onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-gray-700">Informations de connexion</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="px-1">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email Académique</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                        placeholder="exemple@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="px-1">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Code Quitus</label>
                    <div className="relative">
                      <div className="flex items-center bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                        <Hash className="text-indigo-400 mr-2" size={14} />
                        <input
                          type="text"
                          name="code_quitus"
                          maxLength={6}
                          value={formData.code_quitus}
                          onChange={handleChange}
                          required
                          className="bg-transparent w-full text-sm font-bold outline-none text-indigo-900"
                          placeholder="000000"
                        />
                      </div>
                      
                      {quitusStatus === 'checking' && (
                        <div className="flex items-center gap-1 text-xs text-indigo-600 mt-1 px-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Vérification...
                        </div>
                      )}
                      {quitusStatus === 'valid' && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 px-2">
                          <CheckCircle size={12} />
                          Code valide ✓
                        </div>
                      )}
                      {quitusStatus === 'used' && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1 px-2">
                          Code déjà utilisé
                        </div>
                      )}
                      {quitusStatus === 'invalid' && (
                        <div className="flex items-center gap-1 text-xs text-red-600 mt-1 px-2">
                          Code invalide
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Mot de passe sécurisé"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formData.password && <PasswordStrength password={formData.password} />}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Confirmation</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        required
                        className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        placeholder="Répétez le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formData.password_confirm && (
                      <div className={`text-xs flex items-center gap-1 ${
                        passwordsMatch ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {passwordsMatch ? '✓' : '✗'} 
                        {passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-gray-700">Informations personnelles</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="Nom de famille"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="Prénom(s)"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Date de naissance (14-30 ans)</label>
                    <input
                      type="date"
                      name="date_naissance"
                      value={formData.date_naissance}
                      onChange={handleChange}
                      required
                      min="1995-12-30"
                      max="2011-12-30"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Sexe</label>
                    <select
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Lieu de naissance</label>
                    <input
                      type="text"
                      name="lieu_naissance"
                      value={formData.lieu_naissance}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="Ville de naissance"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                      placeholder="+2376XXXXXXXX"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format obligatoire: +2376 suivi de 8 chiffres</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={loading || quitusStatus !== 'valid'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader /> : (
                    <>
                      Créer mon compte
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Déjà inscrit ? Se connecter
            </button>
            <div className="flex items-center gap-2 opacity-40">
              <ShieldCheck size={12} className="text-gray-900" />
              <span className="text-xs font-bold text-gray-900 uppercase">Portail Sécurisé SGEE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;