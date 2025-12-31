import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quitusService from '../../services/QuitusService';

const QuitusModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [quitusCode, setQuitusCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleVerify = async () => {
    if (quitusCode.length !== 6) {
      setError('Le code doit contenir exactement 6 chiffres');
      return;
    }
  
    if (!/^\d+$/.test(quitusCode)) {
      setError('Le code ne doit contenir que des chiffres');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const result = await quitusService.verifierCode(quitusCode);
  
      if (result.success) {
        const { status, message, ...rest } = result.data;
  
        if (status === 'available') {
          // Code non utilisé → inscription
          navigate('/register', {
            state: {
              quitusCode,
              quitusData: rest,
            },
          });
          onClose();
        } else if (status === 'owned') {
          // Code déjà utilisé par l'utilisateur connecté → enrôlement
          navigate('/enrollement', {
            state: {
              quitusCode,
              quitusData: rest,
            },
          });
          onClose();
        }
      } else {
        const err = result.error;
        
        // Gérer le cas où l'utilisateur doit se connecter
        if (err.action === 'login_required') {
          setError(
            err.error || 
            'Ce code est déjà utilisé. Veuillez vous connecter si c\'est votre code.'
          );
          // Optionnel: afficher un bouton "Se connecter" dans le modal
        } else {
          const errorMsg =
            err.error ||
            err.message ||
            'Code quitus invalide ou déjà utilisé';
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error('Erreur vérification quitus:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setQuitusCode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-900">
            Code Quitus Requis
          </h3>
          <button 
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-indigo-800 font-semibold mb-1">
                Important
              </p>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Le code quitus à 6 chiffres se trouve sur votre reçu de paiement bancaire. 
                Il est obligatoire pour commencer votre inscription.
              </p>
            </div>
          </div>
        </div>
        
        {/* Input Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entrez votre code quitus
          </label>
          <input
            type="text"
            maxLength={6}
            value={quitusCode}
            onChange={(e) => {
              setQuitusCode(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="000000"
            disabled={loading}
            className={`w-full px-6 py-4 border-2 rounded-xl text-center text-3xl font-black tracking-widest focus:outline-none focus:ring-4 transition-all ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-100'
            } disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || quitusCode.length !== 6}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification...
              </>
            ) : (
              'Valider'
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Vous n'avez pas encore payé ?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Voir les modalités de paiement
            </a>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuitusModal;