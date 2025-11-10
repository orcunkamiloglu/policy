import React, { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import ExportMenu from '../components/ExportMenu';

function ExpiringPolicies({ onRefresh }) {
  const [selectedDays, setSelectedDays] = useState(7);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filterOptions = [
    { value: 0, label: 'Bugün Bitecekler' },
    { value: 3, label: '3 Gün İçinde' },
    { value: 7, label: '7 Gün İçinde' },
    { value: 15, label: '15 Gün İçinde' },
    { value: 30, label: '30 Gün İçinde' },
    { value: 60, label: '60 Gün İçinde' },
    { value: 90, label: '90 Gün İçinde' }
  ];

  useEffect(() => {
    loadPolicies();
  }, [selectedDays]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await window.api.insurance.filterByEndDate(selectedDays);

      if (result.success) {
        setPolicies(result.data);
      } else {
        setError(result.error || 'Veriler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error('Error loading expiring policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPolicies();
    onRefresh();
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    return differenceInDays(end, today);
  };

  const getRowColor = (daysRemaining) => {
    if (daysRemaining < 0) return 'bg-red-50';
    if (daysRemaining === 0) return 'bg-orange-50';
    if (daysRemaining <= 7) return 'bg-yellow-50';
    return 'bg-white';
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filtre:
            </label>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              className="input max-w-xs"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <ExportMenu insurances={policies} />
            <button onClick={handleRefresh} className="btn btn-secondary">
              🔄 Yenile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Bulunan Poliçe:</span> {policies.length}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
          <button onClick={loadPolicies} className="btn btn-primary mt-4">
            Tekrar Dene
          </button>
        </div>
      ) : policies.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-green-600 text-5xl mb-4">✅</div>
          <p className="text-gray-500 text-lg">
            {selectedDays === 0
              ? 'Bugün biten poliçe yok'
              : `${selectedDays} gün içinde biten poliçe yok`}
          </p>
          <p className="text-gray-400 text-sm mt-2">Harika! Poliçeleriniz güncel görünüyor.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poliçe Türü
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şirket
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bitiş Tarihi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kalan Gün
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => {
                const daysRemaining = getDaysRemaining(policy.endDate);
                const rowColor = getRowColor(daysRemaining);

                return (
                  <tr key={policy.id} className={`${rowColor} hover:opacity-75`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {policy.name} {policy.surname}
                      </div>
                      {policy.policyNumber && (
                        <div className="text-xs text-gray-500">
                          #{policy.policyNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {policy.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {policy.policyType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {policy.company || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {policy.endDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          daysRemaining < 0
                            ? 'text-red-600'
                            : daysRemaining === 0
                            ? 'text-orange-600'
                            : daysRemaining <= 7
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {daysRemaining < 0
                          ? `${Math.abs(daysRemaining)} gün önce bitti`
                          : daysRemaining === 0
                          ? 'Bugün bitiyor'
                          : `${daysRemaining} gün`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpiringPolicies;
