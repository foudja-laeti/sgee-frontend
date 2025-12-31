import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Receipt, Eye, Mail, MessageCircle } from 'lucide-react';

const ArreteTroisiemeAnnee = () => {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const hasDocument = true;

  // Configuration des liens pour la 3ème Année
  const pdfUrl = "/documents/arrete-premiere-annee.pdf";
  const fullUrl = window.location.origin + pdfUrl;

  const downloadPDF = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'Arrete_Troisieme_Annee_SGEE.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloading(false), 1000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent("Consultez l'arrêté officiel SGEE 2025 (3ème Année) : " + fullUrl)}`, '_blank');
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=Arrêté SGEE 3ème Année&body=Consultez le document ici : ${fullUrl}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button onClick={shareWhatsApp} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <MessageCircle size={18} />
            </button>
            <button onClick={shareEmail} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Mail size={18} />
            </button>
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Download size={16} />
              {downloading ? 'En cours...' : 'Télécharger PDF'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Arrêté 3ème Année</h1>
          <p className="text-lg text-slate-500 font-medium">Concours d'Admission Parallèle 2024-2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">Statut du Document</h2>
            {hasDocument && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Disponible
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Receipt size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Frais d'examen</p>
                <p className="text-sm font-bold text-slate-700">50 000 FCFA payés</p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FileText size={24} className="text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-700">Format PDF</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.open(pdfUrl, '_blank')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500 hover:text-indigo-600">
                  <Eye size={18} />
                </button>
                <button onClick={downloadPDF} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500 hover:text-green-600">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">Modalités d'admission</h3>
            <ul className="space-y-3">
              {['Bac + 2 (BTS, HND, DUT) requis', 'Moyenne minimale de 11/20', 'Entretien de motivation', 'Validation des acquis professionnels'].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <span className="text-indigo-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">Frais d'inscription</h3>
            <ul className="space-y-3">
              {[
                { label: 'Camerounais', price: '50 000 FCFA' },
                { label: 'Candidats VAE', price: '75 000 FCFA' },
                { label: 'Étrangers', price: '150 000 FCFA' },
                { label: 'Dépôt de dossier', price: 'Gratuit' }
              ].map((item, i) => (
                <li key={i} className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900 font-bold">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-xl shadow-indigo-100">
          <h3 className="font-bold text-lg mb-6 text-center">Calendrier 3ème Année</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm text-center">
              <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Dépôt Dossier</p>
              <p className="text-lg font-black">20 Juin</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Fin des dépôts</p>
              <p className="text-lg font-black">10 Sept</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Sélection</p>
              <p className="text-lg font-black">25 Sept</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArreteTroisiemeAnnee;