import React, { useState, useMemo } from 'react';
import InsuranceForm from '../components/InsuranceForm';
import InsuranceTable from '../components/InsuranceTable';
import ExportMenu from '../components/ExportMenu';

function InsuranceList({
  insurances,
  onCreateInsurance,
  onUpdateInsurance,
  onDeleteInsurance,
  onRefresh
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('endDate');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter and sort insurances
  const filteredInsurances = useMemo(() => {
    let filtered = [...insurances];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ins) =>
          ins.name.toLowerCase().includes(query) ||
          ins.surname.toLowerCase().includes(query) ||
          ins.phone.includes(query) ||
          ins.policyType.toLowerCase().includes(query) ||
          (ins.policyNumber && ins.policyNumber.toLowerCase().includes(query)) ||
          (ins.company && ins.company.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date sorting
      if (sortField === 'startDate' || sortField === 'endDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [insurances, searchQuery, sortField, sortDirection]);

  const handleAddClick = () => {
    setEditingInsurance(null);
    setShowForm(true);
  };

  const handleEditClick = (insurance) => {
    setEditingInsurance(insurance);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingInsurance(null);
  };

  const handleFormSubmit = async (insurance) => {
    let result;

    if (editingInsurance) {
      // Update existing
      result = await onUpdateInsurance(editingInsurance.id, insurance);
    } else {
      // Create new
      result = await onCreateInsurance(insurance);
    }

    if (result.success) {
      handleFormClose();
    }

    return result;
  };

  const handleDeleteClick = async (id) => {
    if (confirm('Bu poliçeyi silmek istediğinizden emin misiniz?')) {
      await onDeleteInsurance(id);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Ad, soyad, telefon veya poliçe türü ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <ExportMenu insurances={filteredInsurances} />
            <button onClick={onRefresh} className="btn btn-secondary" title="Yenile">
              🔄 Yenile
            </button>
            <button onClick={handleAddClick} className="btn btn-primary">
              ➕ Yeni Poliçe Ekle
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Toplam:</span> {insurances.length}
          </div>
          {searchQuery && (
            <div>
              <span className="font-medium">Filtrelenmiş:</span> {filteredInsurances.length}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <InsuranceTable
        insurances={filteredInsurances}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Form Modal */}
      {showForm && (
        <InsuranceForm
          insurance={editingInsurance}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default InsuranceList;
