// MicrosoftCallback.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OAuthService from '../services/OAuthService';

const MicrosoftCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); // ✅ Utiliser checkAuth au lieu de setUser
  const [needsQuitus, setNeedsQuitus] = useState(false);
  const [codeQuitus, setCodeQuitus] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleMicrosoftCallback();
  }, []);

  const handleMicrosoftCallback = async () => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      console.error('❌ Erreur Microsoft:', errorParam);
      navigate('/login?error=microsoft_failed');
      return;
    }

    if (!code) {
      navigate('/login?error=no_code');
      return;
    }

    const result = await OAuthService.loginWithMicrosoft(code, null);

    if (result.success) {
      // ✅ Sauvegarder les tokens
      localStorage.setItem('access_token', result.data.tokens.access);
      localStorage.setItem('refresh_token', result.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // ✅ Recharger l'authentification via le contexte
      await checkAuth();
      
      // ✅ Redirection selon le rôle
      const userRole = result.data.user.role;
      console.log('🎭 Rôle détecté:', userRole);
      
      if (['super_admin', 'admin'].includes(userRole)) {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'candidat') {
        navigate('/home', { replace: true });
      } else if (userRole === 'admin_academique') {
        navigate('/adminacad/dashboard', { replace: true });
      } else if (userRole === 'responsable_filiere') {
        navigate('/respfiliere/dashboard', { replace: true });
      } else {
        console.warn('⚠️ Rôle inconnu:', userRole);
        navigate('/login', { replace: true });
      }
    } else if (result.error?.error === 'code_quitus_required') {
      // ⚠️ Nouvel utilisateur - Code quitus requis
      setNeedsQuitus(true);
      setUserInfo(result.error.user_info);
      setLoading(false);
    } else {
      // ❌ Erreur
      setError(result.error?.message || 'Erreur de connexion');
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const handleQuitusSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const code = searchParams.get('code');
    const result = await OAuthService.loginWithMicrosoft(code, codeQuitus);

    if (result.success) {
      // ✅ Inscription réussie
      localStorage.setItem('access_token', result.data.tokens.access);
      localStorage.setItem('refresh_token', result.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // ✅ Recharger l'authentification
      await checkAuth();
      
      // Nouveaux utilisateurs = toujours candidats
      navigate('/home', { replace: true });
    } else {
      setError(result.error?.error || 'Code quitus invalide');
      setLoading(false);
    }
  };

  // ... reste du code UI inchangé ...
  
  if (loading && !needsQuitus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Connexion avec Microsoft...</p>
        </div>
      </div>
    );
  }

  if (needsQuitus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Code Quitus Requis</h2>
            <p className="text-gray-600 mt-2">
              Bienvenue <strong>{userInfo?.given_name} {userInfo?.family_name}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-1">{userInfo?.email}</p>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">
              Veuillez entrer votre code quitus à 6 chiffres pour finaliser votre inscription.
            </p>
          </div>
          
          <form onSubmit={handleQuitusSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Quitus
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={codeQuitus}
                onChange={(e) => setCodeQuitus(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-3xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || codeQuitus.length !== 6}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Vérification...' : 'Valider et Continuer'}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Le code quitus vous a été fourni lors du paiement des frais d'inscription.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MicrosoftCallback;