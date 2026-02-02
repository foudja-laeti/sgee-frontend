// src/components/ManualCard.jsx
import React from 'react';
import { Book, ArrowRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManualCard = ({ userRole }) => {
  const navigate = useNavigate();

  const roleInfo = {
    candidat: {
      title: "Guide du Candidat",
      description: "Découvrez comment utiliser la plateforme, de l'inscription à la convocation",
      icon: "🎓",
      color: "from-blue-500 to-blue-600"
    },
    responsable_filiere: {
      title: "Guide du Responsable",
      description: "Gérez efficacement les candidatures de votre filière",
      icon: "👨‍🏫",
      color: "from-purple-500 to-purple-600"
    },
    admin_academique: {
      title: "Guide de l'Administrateur",
      description: "Administration complète de la plateforme",
      icon: "⚙️",
      color: "from-green-500 to-green-600"
    }
  };

  const info = roleInfo[userRole] || roleInfo.candidat;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`h-2 bg-gradient-to-r ${info.color}`}></div>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
            {info.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h3>
            <p className="text-sm text-gray-600">{info.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/manuel')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${info.color} hover:opacity-90 text-white rounded-lg transition-all font-semibold`}
          >
            <Book size={18} />
            Consulter
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={() => {
              // Télécharger PDF
              alert('Téléchargement du manuel PDF');
            }}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Télécharger PDF"
          >
            <Download size={18} />
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HelpCircle size={14} />
            <span>Besoin d'aide ? Consultez le manuel ou contactez le support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualCard;
