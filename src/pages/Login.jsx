// src/pages/Login.jsx - VERSION CORRIGÉE POUR VITE
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, User, Lock, Hash, ArrowRight, 
  GraduationCap 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import OAuthService from '../services/OAuthService';
import Loader from '../components/common/Loader';

// ========== Logos SVG ==========
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 23 23">
    <path fill="#f25022" d="M0 0h11v11H0z"/>
    <path fill="#00a4ef" d="M12 0h11v11H12z"/>
    <path fill="#7fba00" d="M0 12h11v11H0z"/>
    <path fill="#ffb900" d="M12 12h11v11H12z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login,checkAuth } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    code_quitus: '' 
  });

// ========== Initialiser Google Sign-In ==========
useEffect(() => {
  const initGoogle = async () => {
    try {
      await OAuthService.initGoogleSignIn();
      
      const clientId = OAuthService.getGoogleClientId();
      
      if (window.google && clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
        });

        // ✅ AJOUTER : Rendre le bouton Google officiel
        const googleButtonElement = document.getElementById('googleSignInDiv');
        
        if (googleButtonElement) {
          window.google.accounts.id.renderButton(
            googleButtonElement,
            {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              width: googleButtonElement.offsetWidth, // Utiliser la largeur du conteneur
              locale: 'fr',
            }
          );
          console.log('✅ Bouton Google rendu');
        } else {
          console.error('❌ googleSignInDiv non trouvé');
        }
      } else {
        console.warn('⚠️ Google Client ID non configuré');
      }
    } catch (error) {
      console.error('❌ Erreur init Google:', error);
    }
  };

  initGoogle();
}, []);

const handleGoogleResponse = async (response) => {
  console.log('🔐 Réponse Google reçue');
  setOauthLoading('google');
  setError('');

  try {
    const result = await OAuthService.loginWithGoogle(response.credential);
    
    if (result.success) {
      console.log('✅ Connexion Google réussie');
      console.log('👤 User:', result.data.user);
      console.log('🎭 Rôle:', result.data.user.role);
      
      localStorage.setItem('access_token', result.data.tokens.access);
      localStorage.setItem('refresh_token', result.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Recharger l'authentification
      await checkAuth();
      
      // ✅ Redirection selon le rôle
      const userRole = result.data.user.role;
      
      if (['super_admin', 'admin'].includes(userRole)) {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'candidat') {
        if (result.data.requires_completion) {
          navigate('/complete-profile', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      } else if (userRole === 'admin_academique') {
        navigate('/adminacad/dashboard', { replace: true });
      } else if (userRole === 'responsable_filiere') {
        navigate('/respfiliere/dashboard', { replace: true });
      } else {
        console.warn('⚠️ Rôle inconnu:', userRole);
        navigate('/login', { replace: true });
      }
    } else {
      console.error('❌ Erreur Google:', result.error);
      setError(result.error?.message || 'Erreur de connexion Google');
    }
  } catch (err) {
    console.error('❌ Erreur Google login:', err);
    setError('Erreur lors de la connexion Google');
  } finally {
    setOauthLoading(null);
  }
};

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In non disponible');
    }
  };

  // ========== Gestion Microsoft OAuth ==========
  const handleMicrosoftLogin = () => {
    setOauthLoading('microsoft');
    const authUrl = OAuthService.getMicrosoftAuthUrl();
    window.location.href = authUrl;
  };

  // ========== Connexion Classique ==========
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
      const result = await login(
        formData.email, 
        formData.password, 
        formData.code_quitus || null
      );

      if (!result.success) {
        const errorMessage = result.error?.non_field_errors?.[0] 
          || result.error?.email?.[0] 
          || result.error?.password?.[0]
          || result.error?.code_quitus?.[0]
          || result.error?.error
          || result.error?.detail
          || 'Identifiants invalides';
        
        setError(errorMessage);
      }
    } catch (err) {
      setError('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-300 flex items-center justify-center p-2 sm:p-4 overflow-hidden font-sans">
      
      <div className="flex w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[600px] border border-slate-200">
        
        {/* Côté Gauche : Image */}
        <div className="hidden md:block md:w-[35%] relative">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
            alt="Library" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/40 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold">SGEE</h2>
            <p className="text-xs opacity-70">Concours National</p>
          </div>
        </div>

        {/* Côté Droit : Formulaire */}
        <div className="w-full md:w-[65%] px-8 py-6 flex flex-col justify-center bg-white overflow-y-auto">
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Connexion</h3>
            <div className="w-8 h-[2px] bg-indigo-600 mx-auto mt-1"></div>
          </div>

          {error && (
            <div className="text-red-600 text-xs text-center font-medium bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
              {error}
            </div>
          )}

         {/* ========== BOUTONS OAUTH ========== */}
<div className="space-y-3 mb-6">
  {/* ✅ Bouton Google officiel */}
  <div 
    id="googleSignInDiv" 
    className="w-full flex justify-center"
  ></div>

  {/* Bouton Microsoft */}
  <button
    type="button"
    onClick={handleMicrosoftLogin}
    disabled={oauthLoading === 'microsoft'}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {oauthLoading === 'microsoft' ? (
      <Loader size="sm" />
    ) : (
      <>
        <MicrosoftIcon />
        Continuer avec Microsoft
      </>
    )}
  </button>
</div>
          {/* ========== SÉPARATEUR ========== */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-500 font-medium">
                OU AVEC EMAIL
              </span>
            </div>
          </div>

          {/* ========== FORMULAIRE CLASSIQUE ========== */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Email */}
              <div className="px-2">
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
              <div className="px-2">
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
              <div className="px-2">
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

            <div className="pt-2 px-2">
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