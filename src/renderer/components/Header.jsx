import React from 'react';

function Header({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'list', label: 'Tüm Poliçeler', icon: '📋' },
    { id: 'expiring', label: 'Biten Poliçeler', icon: '⏰' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-700">
              Sigorta Poliçe Yöneticisi
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                  currentPage === item.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
