import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { UserAPI } from '../services/api';
import { useCity } from '../context/CityContext';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { selectedCity, openCityModal } = useCity();

  const checkUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    
    // Custom storage listener to respond to local page actions
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await UserAPI.logout();
    } catch (err) {
      console.error("Failed to logout on server:", err);
    }
    localStorage.removeItem('user');
    setUser(null);
    // Dispatch a storage event so other open tabs/components can update
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <nav className="glass-effect" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ 
            fontSize: '1.75rem', 
            fontWeight: 900, 
            color: 'var(--text-main)', 
            letterSpacing: '-1.5px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            BOOK<span style={{ color: 'var(--primary)' }}>MY</span>SHOW
          </Link>

          {/* City Selector Button in Navbar */}
          <button
            onClick={openCityModal}
            className="navbar-city-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '100px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to change city"
          >
            <MapPin size={15} color="var(--primary)" />
            <span style={{ maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedCity ? selectedCity.name : 'Select City'}
            </span>
            <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem' }} className="nav-links">
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', opacity: 0.8 }}>Movies</Link>
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', opacity: 0.8 }}>Theaters</Link>
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', opacity: 0.8 }}>Events</Link>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', opacity: 0.95, fontWeight: 600 }}>
                  Hi, {user.name}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="btn-glass" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '100px', 
                    fontSize: '0.85rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', textDecoration: 'none' }}>
                <User size={18} />
                Login
              </Link>
            )}
            <button style={{ background: 'none', color: 'white', display: 'none' }} className="mobile-menu">
              <Menu />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .navbar-city-btn:hover {
          background: rgba(225, 29, 72, 0.15) !important;
          border-color: rgba(225, 29, 72, 0.4) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
