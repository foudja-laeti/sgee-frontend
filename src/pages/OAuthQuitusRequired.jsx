import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hash, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import OAuthService from '../services/OAuthService';

const OAuthQuitusRequired = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, given_name, family_name, provider, token, code } = location.state || {};
  
  const [codeQuitus, setCodeQuitus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (codeQuitus.length !== 6) {
      setError('Le code quitus doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (provider === 'microsoft') {
        result = await OAuthService.loginWithMicrosoft(code, codeQuitus);
      } else if (provider === 'google') {
        result = await OAuthService.loginWithGoogle(token, codeQuitus);
      }

      if (result.success) {
        // Sauvegarder tokens
        localStorage.setItem('access_token', result.data.tokens.access);
        localStorage.setItem('refresh_token', result.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Toujours rediriger vers complete-profile pour les nouveaux OAuth
        navigate('/complete-profile');
      } else {
        const errorMsg = result.error.error || result.error.message || 'Code quitus invalide';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Code Quitus Requis
          </h2>
          <p className="text-gray-600 text-sm">
            Authentification sécurisée
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 font-bold text-lg">
                {given_name?.[0]}{family_name?.[0]}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {given_name} {family_name}
              </p>
              <p className="text-xs text-gray-600 truncate">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-indigo-200">
            <div className="px-2 py-1 bg-white rounded text-xs font-medium text-indigo-700">
              {provider === 'microsoft' ? '🟦 Microsoft' : '🔵 Google'}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Nouveau compte détecté
              </p>
              <p className="text-xs text-blue-700">
                Pour créer votre compte candidat, veuillez entrer votre <strong>code quitus</strong> de 6 chiffres fourni lors de votre inscription au concours.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-200 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Code Quitus
            </label>
            <div className="relative">
              <div className="flex items-center bg-indigo-50 rounded-xl border-2 border-indigo-200 px-4 py-3 focus-within:border-indigo-500 transition-colors">
                <Hash size={20} className="text-indigo-500 mr-3" />
                <input
                  type="text"
                  maxLength={6}
                  value={codeQuitus}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCodeQuitus(value);
                    setError('');
                  }}
                  required
                  className="bg-transparent w-full text-lg font-bold outline-none text-center text-indigo-900 tracking-widest"
                  placeholder="000000"
                  autoFocus
                />
              </div>
              {codeQuitus.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="text-xs font-medium text-gray-500">
                    {codeQuitus.length}/6
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Le code quitus vous a été fourni lors de votre inscription
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || codeQuitus.length !== 6}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Validation...</span>
              </>
            ) : (
              <>
                Créer mon Compte
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/login')}
            className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Retour à la connexion
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Vous n'avez pas de code quitus ?<br />
              <a href="mailto:support@sgee.cm" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Contactez l'administration
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthQuitusRequired;