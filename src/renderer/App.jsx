import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InsuranceList from './pages/InsuranceList';
import ExpiringPolicies from './pages/ExpiringPolicies';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('list'); // 'list', 'expiring', 'settings'
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load insurances on mount
  useEffect(() => {
    loadInsurances();
  }, []);

  const loadInsurances = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await window.api.insurance.getAll();

      if (result.success) {
        setInsurances(result.data);
      } else {
        setError(result.error || 'Veriler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error('Error loading insurances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInsurance = async (insurance) => {
    try {
      const result = await window.api.insurance.create(insurance);

      if (result.success) {
        await loadInsurances(); // Reload all insurances
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Kayıt eklenirken bir hata oluştu' };
    }
  };

  const handleUpdateInsurance = async (id, updates) => {
    try {
      const result = await window.api.insurance.update(id, updates);

      if (result.success) {
        await loadInsurances(); // Reload all insurances
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Kayıt güncellenirken bir hata oluştu' };
    }
  };

  const handleDeleteInsurance = async (id) => {
    try {
      const result = await window.api.insurance.delete(id);

      if (result.success) {
        await loadInsurances(); // Reload all insurances
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Kayıt silinirken bir hata oluştu' };
    }
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">❌</div>
            <p className="text-red-600">{error}</p>
            <button onClick={loadInsurances} className="btn btn-primary mt-4">
              Tekrar Dene
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'list':
        return (
          <InsuranceList
            insurances={insurances}
            onCreateInsurance={handleCreateInsurance}
            onUpdateInsurance={handleUpdateInsurance}
            onDeleteInsurance={handleDeleteInsurance}
            onRefresh={loadInsurances}
          />
        );
      case 'expiring':
        return <ExpiringPolicies onRefresh={loadInsurances} />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="container mx-auto px-4 py-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
