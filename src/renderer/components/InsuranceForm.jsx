import React, { useState, useEffect } from 'react';

function InsuranceForm({ insurance, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    policyType: '',
    policyNumber: '',
    company: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (insurance) {
      setFormData({
        name: insurance.name || '',
        surname: insurance.surname || '',
        phone: insurance.phone || '',
        policyType: insurance.policyType || '',
        policyNumber: insurance.policyNumber || '',
        company: insurance.company || '',
        startDate: insurance.startDate || '',
        endDate: insurance.endDate || '',
        notes: insurance.notes || ''
      });
    }
  }, [insurance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ad zorunludur';
    }
    if (!formData.surname.trim()) {
      newErrors.surname = 'Soyad zorunludur';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon zorunludur';
    }
    if (!formData.policyType.trim()) {
      newErrors.policyType = 'Poliçe türü zorunludur';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi zorunludur';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Bitiş tarihi zorunludur';
    }

    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden önce olamaz';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);

    if (!result.success) {
      alert('Hata: ' + (result.error || 'Bilinmeyen bir hata oluştu'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {insurance ? 'Poliçeyi Düzenle' : 'Yeni Poliçe Ekle'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Ad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="label">
                  Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`input ${errors.surname ? 'border-red-500' : ''}`}
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm mt-1">{errors.surname}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="0555 555 55 55"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Policy Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Poliçe Türü <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  className={`input ${errors.policyType ? 'border-red-500' : ''}`}
                  placeholder="Örn: Kasko, Trafik, Sağlık"
                />
                {errors.policyType && (
                  <p className="text-red-500 text-sm mt-1">{errors.policyType}</p>
                )}
              </div>

              <div>
                <label className="label">Poliçe No</label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Şirket</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input"
                placeholder="Sigorta şirketi adı"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Başlangıç Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`input ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="label">
                  Bitiş Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`input ${errors.endDate ? 'border-red-500' : ''}`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notlar</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input"
                rows="3"
                placeholder="Ek notlar..."
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={submitting}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Kaydediliyor...' : insurance ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InsuranceForm;
