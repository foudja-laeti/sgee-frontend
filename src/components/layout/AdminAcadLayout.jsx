// src/components/layout/AdminAcadLayout.jsx
import React from 'react';
import AdminAcadSidebar from './AdminAcadSidebar';

const AdminAcadLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminAcadSidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminAcadLayout;