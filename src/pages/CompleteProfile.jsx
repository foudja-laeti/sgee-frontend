// src/pages/CompleteProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Phone, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/common/Loader';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date_naissance: '',
    lieu_naissance: '',
    sexe: '',
    telephone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation téléphone
    const cleanPhone = formData.telephone.replace(/\s/g, '');
    if (!/^\+2376\d{8}$/.test(cleanPhone)) {
      setError('Format téléphone: +2376XXXXXXXX');
      setLoading(false);
      return;
    }

    try {
      await api.patch('/auth/profile/', formData);
      
      // Profil complété avec succès
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       Object.values(err.response?.data || {})[0] || 
                       'Erreur lors de la mise à jour';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Complétez votre profil
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Quelques informations supplémentaires sont nécessaires
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Date de naissance */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              Date de naissance
            </label>
            <input
              type="date"
              name="date_naissance"
              required
              value={formData.date_naissance}
              onChange={handleChange}
              min="1995-12-30"
              max="2011-12-30"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Âge requis: 14-30 ans</p>
          </div>

          {/* Lieu de naissance */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-2">
              <MapPin size={16} className="text-indigo-600" />
              Lieu de naissance
            </label>
            <input
              type="text"
              name="lieu_naissance"
              required
              value={formData.lieu_naissance}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Ville de naissance"
            />
          </div>

          {/* Sexe */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-2">
              <User size={16} className="text-indigo-600" />
              Sexe
            </label>
            <select
              name="sexe"
              required
              value={formData.sexe}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          {/* Téléphone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-2">
              <Phone size={16} className="text-indigo-600" />
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              required
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
              placeholder="+2376XXXXXXXX"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: +2376 suivi de 8 chiffres
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                Finaliser mon inscription
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CompleteProfile;