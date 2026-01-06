// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, Hash, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // ✅ Utiliser le contexte
import Loader from '../components/common/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Utiliser la fonction login du contexte
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', code_quitus: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Utiliser la fonction login du contexte qui gère la redirection
      const result = await login(
        formData.email, 
        formData.password, 
        formData.code_quitus || null
      );

      if (!result.success) {
        // Afficher l'erreur
        const errorMessage = result.error?.non_field_errors?.[0] 
          || result.error?.email?.[0] 
          || result.error?.password?.[0]
          || result.error?.code_quitus?.[0]
          || result.error?.error
          || result.error?.detail
          || 'Identifiants ou code invalides';
        
        setError(errorMessage);
      }
      // La redirection est gérée automatiquement dans AuthContext.login()
    } catch (err) {
      console.error('Erreur login:', err);
      setError('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-300 flex items-center justify-center p-2 sm:p-4 overflow-hidden font-sans">
      
      {/* Card Ultra-Compacte */}
      <div className="flex w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[500px] border border-slate-200">
        
        {/* Côté Gauche : Image Prestige */}
        <div className="hidden md:block md:w-[35%] relative">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
            alt="Library" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/40 opacity-90 backdrop-contrast-125"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold">SGEE</h2>
            <p className="text-xs opacity-70">Concours National</p>
          </div>
        </div>

        {/* Côté Droit : Formulaire */}
        <div className="w-full md:w-[65%] px-12 py-6 flex flex-col justify-center bg-white">
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Connexion</h3>
            <div className="w-8 h-[2px] bg-indigo-600 mx-auto mt-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-xs text-center font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="px-4">
                <label className="text-sm font-medium text-gray-700 ml-1 mb-1.5 block">
                  Email Académique
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                    placeholder="exemple@gmail.com"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="px-4">
                <label className="text-sm font-medium text-gray-700 ml-1 mb-1.5 block">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Code Quitus */}
              <div className="px-4">
                <div className="flex justify-between items-center mb-1.5 px-1">
                  <label className="text-sm font-medium text-gray-700 block">
                    Code Quitus
                  </label>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight">
                    Candidat uniquement
                  </span>
                </div>
                <div className="flex items-center bg-indigo-50/50 rounded-xl border border-indigo-100 px-5 py-2.5 shadow-sm">
                  <Hash size={16} className="text-indigo-400 mr-4" />
                  <input
                    type="text"
                    name="code_quitus"
                    maxLength={6}
                    value={formData.code_quitus}
                    onChange={handleChange}
                    className="bg-transparent w-full text-sm font-medium outline-none text-center text-indigo-900"
                    placeholder="000000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 px-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    Valider l'Accès
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 pt-3">
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Pas de compte ? Créez-en un
              </button>
              
              <div className="flex items-center gap-2 opacity-40">
                <ShieldCheck size={12} className="text-gray-900" />
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">
                  Portail Sécurisé SGEE
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;