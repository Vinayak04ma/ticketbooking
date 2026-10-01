import React, { useState, useMemo } from 'react';
import { useCity } from '../context/CityContext';
import type { City } from '../context/CityContext';
import { Search, MapPin, X, Check, Building2, Compass } from 'lucide-react';

// Popular cities with iconic visual icons/badges
const CITY_ICONS: Record<string, string> = {
  'Mumbai': '🏙️',
  'Delhi': '🏛️',
  'Bangalore': '💻',
  'Hyderabad': '🏰',
  'Chennai': '🛕',
  'Pune': '🎓',
  'Kolkata': '🌉',
  'Ahmedabad': '🪁',
};

const CityModal: React.FC = () => {
  const { isCityModalOpen, closeCityModal, selectedCity, setSelectedCity, cities, popularCities } = useCity();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities;
    const term = searchTerm.toLowerCase().trim();
    return cities.filter(c => 
      c.name.toLowerCase().includes(term) || 
      (c.state && c.state.toLowerCase().includes(term))
    );
  }, [cities, searchTerm]);

  if (!isCityModalOpen) return null;

  const handleSelect = (city: City) => {
    setSelectedCity(city);
    setSearchTerm('');
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      // Default to Mumbai or closest matching city in demo
      const mumbai = cities.find(c => c.name.toLowerCase() === 'mumbai') || cities[0];
      handleSelect(mumbai);
    } else {
      handleSelect(cities[0]);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && selectedCity) {
          closeCityModal();
        }
      }}
    >
      <div 
        className="glass-effect"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          borderRadius: '28px',
          padding: '2.25rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(225, 29, 72, 0.15)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          color: 'var(--text-main)',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Compass size={18} />
              <span>Location Preference</span>
            </div>
            <h2 style={{ fontSize: '2rem', letterSpacing: '-0.5px', margin: 0, fontWeight: 800 }}>
              Select Your <span style={{ color: 'var(--primary)' }}>City</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.35rem 0 0' }}>
              Choose your city to discover movies, theaters, and showtimes near you.
            </p>
          </div>

          {selectedCity && (
            <button 
              onClick={closeCityModal}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.backgroundColor = 'rgba(225, 29, 72, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              title="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              gap: '0.75rem',
              transition: 'border-color 0.2s ease',
            }}
          >
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search for your city (e.g. Mumbai, Delhi, Bangalore)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '1rem',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={handleDetectLocation}
            className="btn-glass"
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '16px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              color: 'var(--primary)'
            }}
          >
            <MapPin size={16} />
            Auto Detect
          </button>
        </div>

        {/* Popular Cities Section (When not searching or search has results) */}
        {!searchTerm && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)' }}>
                Popular Cities
              </span>
              {selectedCity && (
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Current: {selectedCity.name}
                </span>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.9rem'
            }}>
              {popularCities.map((city) => {
                const isSelected = selectedCity?.name.toLowerCase() === city.name.toLowerCase();
                const icon = CITY_ICONS[city.name] || '🏙️';
                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    style={{
                      padding: '1rem 0.75rem',
                      borderRadius: '18px',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.25) 0%, rgba(225, 29, 72, 0.1) 100%)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected 
                        ? '1.5px solid var(--primary)' 
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      boxShadow: isSelected ? '0 0 20px rgba(225, 29, 72, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                      }
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{icon}</span>
                    <span style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 700, 
                      color: isSelected ? '#fff' : 'var(--text-main)',
                      textAlign: 'center' 
                    }}>
                      {city.name}
                    </span>
                    {city.state && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-0.3rem' }}>
                        {city.state}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Cities / Filtered Cities List */}
        <div>
          <div style={{ marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--text-muted)' }}>
              {searchTerm ? `Matching Cities (${filteredCities.length})` : 'All Cities'}
            </span>
          </div>

          {filteredCities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Building2 size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>No cities found matching "{searchTerm}"</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try searching for a different city or state.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.6rem',
              maxHeight: searchTerm ? '320px' : '200px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {filteredCities.map((city) => {
                const isSelected = selectedCity?.name.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(225, 29, 72, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      color: isSelected ? 'white' : 'var(--text-main)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{city.name}</span>
                      {city.state && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{city.state}</span>
                      )}
                    </div>
                    {isSelected && <Check size={14} color="var(--primary)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>🍿 Cinema listings and seat prices are tailored to your selected city</span>
          <span style={{ color: 'var(--accent)' }}>BookMyShow Experience</span>
        </div>
      </div>
    </div>
  );
};

export default CityModal;
