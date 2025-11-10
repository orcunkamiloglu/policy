import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

function InsuranceTable({
  insurances,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete
}) {
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getExpiryStatus = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = differenceInDays(end, today);

    if (daysUntilExpiry < 0) {
      return { label: 'Süresi Dolmuş', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry === 0) {
      return { label: 'Bugün Bitiyor', color: 'bg-orange-100 text-orange-800' };
    } else if (daysUntilExpiry <= 7) {
      return { label: `${daysUntilExpiry} gün kaldı`, color: 'bg-yellow-100 text-yellow-800' };
    } else if (daysUntilExpiry <= 30) {
      return { label: `${daysUntilExpiry} gün kaldı`, color: 'bg-blue-100 text-blue-800' };
    } else {
      return { label: `${daysUntilExpiry} gün kaldı`, color: 'bg-green-100 text-green-800' };
    }
  };

  if (insurances.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">Henüz poliçe eklenmemiş</p>
        <p className="text-gray-400 text-sm mt-2">
          Yeni poliçe eklemek için yukarıdaki "Yeni Poliçe Ekle" butonuna tıklayın
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('name')}
            >
              Ad Soyad {getSortIcon('name')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('phone')}
            >
              Telefon {getSortIcon('phone')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('policyType')}
            >
              Poliçe Türü {getSortIcon('policyType')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('company')}
            >
              Şirket {getSortIcon('company')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('endDate')}
            >
              Bitiş Tarihi {getSortIcon('endDate')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {insurances.map((insurance) => {
            const expiryStatus = getExpiryStatus(insurance.endDate);

            return (
              <tr key={insurance.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {insurance.name} {insurance.surname}
                  </div>
                  {insurance.policyNumber && (
                    <div className="text-xs text-gray-500">
                      #{insurance.policyNumber}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {insurance.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {insurance.policyType}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {insurance.company || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {insurance.endDate}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${expiryStatus.color}`}
                  >
                    {expiryStatus.label}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(insurance)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                    title="Düzenle"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(insurance.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InsuranceTable;
