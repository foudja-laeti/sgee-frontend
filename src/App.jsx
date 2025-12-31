// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // ⚠️ Vérifiez le chemin exact
import Home from './pages/candidat/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArretePremiereAnnee from './pages/candidat/ArretePremiereAnnee';
import ArreteTroisiemeAnnee from './pages/candidat/ArreteTroisiemeAnnee';
import NotFound from './pages/NotFound';
import Enrollement from './pages/candidat/Enrollement';
import Dashboard from './pages/admin/Dashboard';
import NosSites from './pages/candidat/NosSites';
import AnciennesEpreuves from './pages/candidat/AnciennesEpreuves';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* 🔥 IMPORTANT : Wrap avec AuthProvider */}
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes candidats protégées */}
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
          
          {/* Routes admin protégées */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'admin_academique', 'responsable_filiere']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'admin_academique', 'responsable_filiere']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Page non trouvée */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;