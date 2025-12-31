import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuitusModal from '../../components/common/QuitusModal';

const Home = () => {
  const navigate = useNavigate();
  const [showQuitusModal, setShowQuitusModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fonction pour partager via WhatsApp
  const shareOnWhatsApp = () => {
    const message = "Découvrez la plateforme SGEE pour votre inscription ! https://sgee.cm";
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Fonction pour télécharger l'app (PWA)
  const downloadApp = () => {
    alert("Fonctionnalité PWA à venir : Installez l'application sur votre téléphone !");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SGEE</span>
            </div>

{/* Menu Desktop */}
<div className="hidden md:flex items-center gap-6">
  <a href="#accueil" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
    Accueil
  </a>
  <button 
    onClick={() => navigate('/nos-sites')}
    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
  >
    Nos sites
  </button>
  <button 
    onClick={() => navigate('/anciennes-epreuves')}
    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
  >
    Anciennes épreuves
  </button>
  <a href="#faq" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
    FAQ
  </a>
  <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
    Contact
  </a>
</div>



            {/* Boutons Desktop */}
            <div className="hidden md:flex items-center gap-3">
              
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors"
              >
                Connexion
              </button>
            </div>

            {/* Burger Menu Mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Menu Mobile */}
{mobileMenuOpen && (
  <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
    <div className="flex flex-col gap-3">
      <a href="#accueil" className="text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
        Accueil
      </a>
      <button 
        onClick={() => { navigate('/nos-sites'); setMobileMenuOpen(false); }}
        className="text-left text-gray-700 hover:text-indigo-600 font-medium py-2"
      >
        Nos sites
      </button>
      <button 
        onClick={() => { navigate('/anciennes-epreuves'); setMobileMenuOpen(false); }}
        className="text-left text-gray-700 hover:text-indigo-600 font-medium py-2"
      >
        Anciennes épreuves
      </button>
                
                <a href="#faq" className="text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </a>
                <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </a>
                <button 
                  onClick={shareOnWhatsApp}
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 font-medium transition-colors flex items-center gap-2 justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Partager sur WhatsApp
                </button>
                <button 
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                >
                  Connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" id="accueil">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu gauche */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Bienvenue sur notre plateforme d'inscription de{' '}
              <span className="text-indigo-600">SGEE !</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Gérez vos inscriptions, suivez vos formations et accédez à vos
              ressources éducatives en toute simplicité avec notre plateforme.
            </p>

            <p className="text-gray-600 mb-8">
              Nous vous recommandons de télécharger l'arrêté du concours qui
              pourra vous être utile ou aidez-vous en cliquant sur le bouton
              durant en fonction de votre niveau.
            </p>

            {/* Boutons documentation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button 
                onClick={() => navigate('/arrete-premiere-annee')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Première Année
              </button>
              
              <button 
                onClick={() => navigate('/arrete-troisieme-annee')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Troisième Année
              </button>
            </div>

            {/* Note importante */}
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-8 rounded-r-lg">
              <p className="text-sm text-indigo-800">
                <strong>Important :</strong> Veuillez renseigner toutes les informations lors du 
                composage en complétant et en déposant ce qui pourra vous être utile pour que nous puissions 
                vérifier et répondre convenablement.
              </p>
            </div>

            {/* Bouton Commencer - Centré */}
            <div className="flex justify-center">
              <button 
                onClick={() => setShowQuitusModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Commencer l'Enrôlement
              </button>
            </div>
          </div>

          {/* Image droite */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop" 
                alt="Livres et éducation"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
            {/* Décorations */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          </div>
        </div>
      </div>

      {/* Section Nouveaux Étudiants */}
      <div className="bg-white py-16" id="nouveaux">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir notre plateforme ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapide et Efficace</h3>
              <p className="text-gray-600">
                Complétez votre inscription en quelques minutes seulement grâce à notre interface intuitive
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurisé</h3>
              <p className="text-gray-600">
                Vos données sont protégées avec les dernières technologies de sécurité et de cryptage
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Suivi en Temps Réel</h3>
              <p className="text-gray-600">
                Suivez l'état de votre inscription et recevez des notifications à chaque étape
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Anciens Étudiants */}
      <div className="bg-gray-50 py-16" id="anciens">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Vous êtes un ancien étudiant ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Accédez à votre espace personnel pour consulter vos relevés de notes, 
            télécharger vos documents et suivre votre parcours académique.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Accéder à mon espace
          </button>
        </div>
      </div>

      {/* Section FAQ */}
      <div className="bg-white py-16" id="faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions Fréquentes
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Comment obtenir mon code quitus ?
              </h3>
              <p className="text-gray-600">
                Le code quitus est un code à 6 chiffres que vous recevez après avoir effectué 
                votre paiement à la banque. Il se trouve sur votre reçu bancaire.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Quels documents dois-je fournir ?
              </h3>
              <p className="text-gray-600">
                Vous devez fournir : acte de naissance, diplôme, 
                photos d'identité et le reçu de paiement avec le code quitus.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Combien de temps prend le traitement ?
              </h3>
              <p className="text-gray-600">
                Une fois votre dossier complet soumis, le traitement prend généralement 
                entre 24h et 72h. Vous recevrez une notification par email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div className="bg-gray-50 py-16" id="contact">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Contactez-nous
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Informations de contact */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Téléphone</h3>
                  <p className="text-gray-600">+237 658 930 984</p>
                  <a href="tel:+2376 58 93 09 83" className="text-indigo-600 hover:underline text-sm">Appeler maintenant</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-gray-600">Support en ligne</p>
                  <button onClick={shareOnWhatsApp} className="text-green-600 hover:underline text-sm">Contacter sur WhatsApp</button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">contact@sgee.cm</p>
                  <a href="mailto:contact@sgee.cm" className="text-blue-600 hover:underline text-sm">Envoyer un email</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
</div>
<div>
<h3 className="font-bold text-gray-900 mb-1">Adresse</h3>
<p className="text-gray-600">Douala, Cameroun</p>
<p className="text-gray-500 text-sm">Quartier Administratif</p>
</div>
</div>
</div>
        {/* Horaires d'ouverture */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Horaires d'ouverture</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Lundi - Vendredi</span>
              <span className="font-semibold text-gray-900">8h00 - 17h00</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Samedi</span>
              <span className="font-semibold text-gray-900">9h00 - 13h00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dimanche</span>
              <span className="font-semibold text-red-600">Fermé</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>💡 Astuce :</strong> Pour une réponse plus rapide, contactez-nous via WhatsApp pendant les heures d'ouverture.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Footer */}
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold mb-4">SGEE</h3>
          <p className="text-gray-400 text-sm">
            Système de Gestion d'Enrôlement des Étudiants
          </p>
          <div className="flex gap-3 mt-4">
            <button onClick={shareOnWhatsApp} className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button onClick={downloadApp} className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Liens Rapides</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#accueil" className="hover:text-white transition-colors">Accueil</a></li>
            <li><a href="#nouveaux" className="hover:text-white transition-colors">Nos sites</a></li>
            <li><a href="#anciens" className="hover:text-white transition-colors">Anciennes épreuves</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Inscription en ligne</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Suivi de dossier</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Téléchargement documents</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Support technique</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Email: contact@sgee.cm</li>
            <li>Tél: +237 658 930 984</li>
            <li>Douala, Cameroun</li>
            <li className="pt-2">
              <button onClick={downloadApp} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                📱 Télécharger l'application
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; 2025-2026 SGEE. Tous droits réservés.</p>
      </div>
    </div>
  </footer>

  {/* Bouton flottant WhatsApp (Mobile uniquement) */}
  <button 
    onClick={shareOnWhatsApp}
    className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center z-50 md:hidden transition-transform hover:scale-110"
  >
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </button>

  {/* Modal Quitus importé */}
  <QuitusModal 
    isOpen={showQuitusModal}
    onClose={() => setShowQuitusModal(false)}
  />
</div>
);
};
export default Home;