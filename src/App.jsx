// ============================================
// 1. MISE À JOUR DE App.jsx
// ============================================
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/candidat/Home';
import CandidatDetail from './pages/respfiliere/CandidatDetail';
import Login from './pages/Login';
import ProfilFiliere from './pages/respfiliere/ProfilFiliere';
import MonProfil from './pages/respfiliere/MonProfil';
import Register from './pages/Register'; 
import ArretePremiereAnnee from './pages/candidat/ArretePremiereAnnee';
import ArreteTroisiemeAnnee from './pages/candidat/ArreteTroisiemeAnnee';
import NotFound from './pages/NotFound';
import Enrollement from './pages/candidat/Enrollement';
import NosSites from './pages/candidat/NosSites';
import AnciennesEpreuves from './pages/candidat/AnciennesEpreuves';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminLogs from './pages/admin/Logs';
import AdminStatistics from './pages/admin/Statistics';

// 🆕 Responsable Filière pages
import RespFiliereDashboard from './pages/respfiliere/Dashboard';
import RespFiliereCandidats from './pages/respfiliere/Candidats';
import RespFiliereStatistics from './pages/respfiliere/Statistics';
import RespFiliereMaFiliere from './pages/respfiliere/MaFiliere';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
          <Route path="/arrete-troisieme-annee" element={
            <ProtectedRoute allowedRoles={['candidat']}>
              <ArreteTroisiemeAnnee />
            </ProtectedRoute>
          } />
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
          
          {/* Routes Admin (Super Admin + Admin Académique uniquement) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin', 'admin_academique']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['super_admin', 'admin_academique']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/statistics" element={
            <ProtectedRoute allowedRoles={['super_admin', 'admin_academique']}>
              <AdminStatistics />
            </ProtectedRoute>
          } />
          <Route path="/admin/logs" element={
            <ProtectedRoute allowedRoles={['super_admin', 'admin_academique']}>
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
          <Route 
  path="/respfiliere/profil-filiere" 
  element={
    <ProtectedRoute>
      <ProfilFiliere />
    </ProtectedRoute>
  } 
/>

  <Route path="/respfiliere/Mon-profil" 
  element={
    <ProtectedRoute>
      <MonProfil />
    </ProtectedRoute>
  } 
/>
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
          <Route 
  path="/respfiliere/candidats/:id" 
  element={
    <ProtectedRoute>
      <CandidatDetail />
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