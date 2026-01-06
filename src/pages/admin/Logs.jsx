import { useState, useEffect } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', user_id: '' });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/auth/action-logs/?${params}`);
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Erreur logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs d'Activité</h1>
          <p className="text-sm text-gray-600">Historique des actions utilisateurs</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex gap-4 items-center flex-wrap">
            <select className="px-4 py-2 border rounded-xl" onChange={(e) => setFilters({...filters, action: e.target.value})}>
              <option value="">Toutes actions</option>
              <option value="create_user">Création</option>
              <option value="toggle_active">Activation</option>
              <option value="delete_user">Suppression</option>
            </select>
          </div>
        </div>

        {/* Liste logs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <Loader text="Chargement des logs..." />
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Par {log.actor} • {new Date(log.created_at).toLocaleString('fr-FR')}
                      </p>
                      {log.details && (
                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded-lg overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LogsPage;
