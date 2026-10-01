import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, Play, X, Star, MapPin } from 'lucide-react';
import { useCity } from '../context/CityContext';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  movies?: any[];
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery, onSearch, movies = [] }) => {
  const { selectedCity, openCityModal } = useCity();
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const matchingSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return movies.filter(m => 
      m.title.toLowerCase().includes(q) || 
      (m.genre && m.genre.toLowerCase().includes(q)) ||
      (m.language && m.language.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, movies]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowDropdown(false);
    onSearch(searchQuery);
  };

  const handleSuggestionClick = (movieId: number) => {
    setShowDropdown(false);
    navigate(`/movie/${movieId}`);
  };

  return (
    <section style={{
      minHeight: '85vh',
      width: '100%',
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      alignItems: 'center',
      padding: '6rem 0'
    }}>
      {/* Background with advanced overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(to right, #020617 35%, rgba(2, 6, 23, 0.4)), url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '700px' }} className="animate-fade">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'var(--primary-muted)', 
              padding: '0.5rem 1rem', 
              borderRadius: '100px',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              <Play size={14} fill="currentColor" />
              NOW SHOWING IN CINEMAS
            </div>

            <button
              onClick={openCityModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover-scale-sm"
              title="Change your city"
            >
              <MapPin size={14} color="var(--primary)" />
              {selectedCity ? selectedCity.name : 'Choose City'}
            </button>
          </div>
          
          <h1 style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
            Your <span className="text-gradient">Ultimate</span> Cinema Companion
          </h1>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.4 }}>
            Book tickets for the latest blockbusters {selectedCity ? `in ${selectedCity.name}` : ''}, explore premier theaters, and enjoy the ultimate silver screen experience.
          </p>

          {/* Search Form with Live Dropdown */}
          <div ref={searchContainerRef} style={{ position: 'relative', maxWidth: '620px' }}>
            <form 
              onSubmit={handleSearchSubmit}
              className="glass-effect" 
              style={{
                display: 'flex',
                padding: '0.5rem 0.6rem',
                borderRadius: '24px',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-premium)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(15, 23, 42, 0.85)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, paddingLeft: '1.25rem' }}>
                <Search color="var(--primary)" size={22} />
                <input 
                  type="text" 
                  placeholder="Search movies by title, genre, language..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.05rem',
                    width: '100%',
                    outline: 'none',
                    padding: '0.6rem 0',
                    fontFamily: 'inherit'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      onSearch('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button 
                type="submit"
                id="search-button-hero"
                className="btn-primary" 
                style={{ 
                  padding: '0.9rem 1.85rem', 
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                Search Now
                <ChevronRight size={18} />
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showDropdown && searchQuery.trim() && matchingSuggestions.length > 0 && (
              <div 
                className="glass-effect"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  right: 0,
                  borderRadius: '20px',
                  padding: '0.75rem',
                  zIndex: 100,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 30px rgba(0,0,0,0.7)',
                  background: 'rgba(15, 23, 42, 0.96)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Quick Suggestions
                </div>
                {matchingSuggestions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSuggestionClick(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="suggestion-row"
                  >
                    <img 
                      src={m.posterUrl} 
                      alt={m.title} 
                      style={{ width: '40px', height: '55px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644ffb467?q=80&w=2600&auto=format&fit=crop';
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{m.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>{m.genre}</span>
                        <span>•</span>
                        <span>{m.language}</span>
                      </div>
                    </div>
                    {m.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Star size={12} fill="currentColor" />
                        {m.rating}
                      </div>
                    )}
                  </div>
                ))}
                <div 
                  onClick={() => handleSearchSubmit()}
                  style={{
                    padding: '0.6rem 0.75rem',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    marginTop: '0.4rem',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View all results for "{searchQuery}" →
                </div>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
            {[
              { label: 'Active Users', value: '10M+' },
              { label: 'Verified Theaters', value: '500+' },
              { label: 'Events/Year', value: '25K+' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .suggestion-row:hover {
          background: rgba(225, 29, 72, 0.15);
          transform: translateX(4px);
        }
        .hover-scale-sm:hover {
          background: rgba(225, 29, 72, 0.2) !important;
          border-color: var(--primary) !important;
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
};

export default Hero;
