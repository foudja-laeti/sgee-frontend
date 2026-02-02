import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/candidat/Home';
import CandidatDetail from './pages/respfiliere/CandidatDetail';
import Login from './pages/Login';
import ProfilFiliere from './pages/respfiliere/ProfilFiliere';
import CreateResponsableFiliere from './pages/adminacad/CreateResponsableFiliere'; // ✅ CORRIGÉ
import Dashboard from './pages/adminacad/Dashboard';
import ResponsableFiliere from './pages/adminacad/ResponsableFiliere';
import ResponsableFiliereDetail from './pages/adminacad/ResponsableFiliereDetails';
import MonProfil from './pages/respfiliere/MonProfil';
import Register from './pages/Register'; 
import ArretePremiereAnnee from './pages/candidat/ArretePremiereAnnee';
import ArreteTroisiemeAnnee from './pages/candidat/ArreteTroisiemeAnnee';
import NotFound from './pages/NotFound';
import Enrollement from './pages/candidat/Enrollement';
import NosSites from './pages/candidat/NosSites';
import AnciennesEpreuves from './pages/candidat/AnciennesEpreuves';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardCandidatPostEnrollment from './pages/candidat/DashboardCandidatPostEnrollment';
import MonProfile from './pages/candidat/MonProfil';
import MonDossiers from './pages/candidat/MonDossier';
import Notifications from './pages/candidat/Notifications';
import MicrosoftCallback from './pages/MicrosoftCallback';
// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminLogs from './pages/admin/Logs';
import AdminStatistics from './pages/admin/Statistics';
import ProgrammeConcours from './pages/candidat/ProgrammeConcours';
import TestsBlancs from './pages/candidat/TestsBlancs'

// 🆕 Responsable Filière pages
import RespFiliereDashboard from './pages/respfiliere/Dashboard';
import RespFiliereCandidats from './pages/respfiliere/Candidats';
import RespFiliereStatistics from './pages/respfiliere/Statistics';

import MonDossier from './pages/candidat/MonDossier';

import AdminAcadCandidats from './pages/adminacad/Candidats';
import AdminAcadFilieres from './pages/adminacad/Filieres';
import AdminAcadStatistiques from './pages/adminacad/Statistiques';
import AdminAcadUtilisateurs from './pages/adminacad/Utilisateurs';
import AdminAcadRapports from './pages/adminacad/Rapports';
import AdminAcadNotifications from './pages/adminacad/NotificationsManagement';
import AdminAcadParametres from './pages/adminacad/Parametres';
import CompleteProfile from './pages/CompleteProfile';
import OAuthQuitusRequired from './pages/OAuthQuitusRequired';
import ChatbotSGEE from './pages/candidat/ChatbotSGEE';
import ManualViewer from './pages/ManualViewer';
import ManualViewerAdminAcad from './pages/ManualViewerAdminAcad';
import ManuelRedirect from './pages/ManuelRedirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
          <Route path="/OAuthQuitusRequired" element={<OAuthQuitusRequired />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          {/* Routes candidats */}
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/arrete-premiere-annee" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <ArretePremiereAnnee />
            </ProtectedRoute>
          } />
          <Route path="/ChatbotSGEE" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <ChatbotSGEE />
            </ProtectedRoute>
          } />
         {/* ✅ ROUTE MANUEL UNIQUE - Accessible à tous les utilisateurs connectés */}
         <Route 
  path="/manuel/candidat" 
  element={
    <ProtectedRoute allowedRoles={['candidat']}>
      <ManualViewer />
    </ProtectedRoute>
  } 
/>
 <Route 
  path="/manuelRedirect" 
  element={
    <ProtectedRoute allowedRoles={['candidat']}>
      <ManuelRedirect />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/manuel/admin-academique" 
  element={
    <ProtectedRoute allowedRoles={['admin_academique', 'super_admin', 'responsable_filiere']}>
      <ManualViewerAdminAcad />
    </ProtectedRoute>
  } 
/>

 
          <Route path="/arrete-troisieme-annee" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <ArreteTroisiemeAnnee />
            </ProtectedRoute>
          } />
          <Route path="/programme-concours" element={<ProgrammeConcours />} />
<Route path="/tests-blancs" element={<TestsBlancs />} />
          <Route path="/nos-sites" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <NosSites />
            </ProtectedRoute>
          } />
          <Route path="/anciennes-epreuves" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <AnciennesEpreuves />
            </ProtectedRoute>
          } />
          <Route path="/enrollement" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <Enrollement />
            </ProtectedRoute>
          } />
          
          {/* Routes Admin Académique ✅ CORRIGÉES */}
          <Route path="/adminacad/dashboard" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/responsables-filieres" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <ResponsableFiliere />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/responsables-filieres/:id" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <ResponsableFiliereDetail />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/create-resp_filiere" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <CreateResponsableFiliere />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/candidats" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadCandidats />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/filieres" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadFilieres />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/statistiques" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadStatistiques />
            </ProtectedRoute>
          }  />
          <Route path="/adminacad/utilisateurs" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadUtilisateurs />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/rapports" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadRapports />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/notifications" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadNotifications />
            </ProtectedRoute>
          } />
          <Route path="/adminacad/parametres" element={
            <ProtectedRoute allowedRoles={['admin_academique']}>
              <AdminAcadParametres />
            </ProtectedRoute>
          } />
          {/* Routes Admin (Super Admin uniquement) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/statistics" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminStatistics />
            </ProtectedRoute>
          } />
          <Route path="/admin/logs" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLogs />
            </ProtectedRoute>
          } />
          
          {/* 🆕 Routes Responsable Filière */}
          <Route path="/respfiliere/dashboard" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <RespFiliereDashboard />
            </ProtectedRoute>
          } />
          <Route path="/respfiliere/candidats" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <RespFiliereCandidats />
            </ProtectedRoute>
          } />
          <Route path="/respfiliere/profil-filiere" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <ProfilFiliere />
            </ProtectedRoute>
          } />
          <Route path="/respfiliere/mon-profil" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <MonProfil />
            </ProtectedRoute>
          } />
          <Route path="/respfiliere/statistics" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <RespFiliereStatistics />
            </ProtectedRoute>
          } />
          <Route path="/respfiliere/ma-filiere" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <RespFiliereMaFiliere />
            </ProtectedRoute>
          } />
          <Route path="/respfiliere/candidats/:id" element={
            <ProtectedRoute allowedRoles={['responsable_filiere']}>
              <CandidatDetail />
            </ProtectedRoute>
          } />
           <Route 
          path="/dashboard-candidat" 
          element={
            <ProtectedRoute>
              <DashboardCandidatPostEnrollment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Mon-profil" 
          element={
            <ProtectedRoute>
              <MonProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Mon-dossier" 
          element={
            <ProtectedRoute>
              <MonDossiers />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
          
          
        
        />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
