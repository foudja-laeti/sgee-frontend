// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-black text-indigo-600 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
        <p className="text-xl text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <Button 
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;