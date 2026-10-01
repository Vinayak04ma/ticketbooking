import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserAPI } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await UserAPI.login({ email, password });
      localStorage.setItem('user', JSON.stringify(user));
      // Dispatch an event to notify the Navbar that user logged in
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        background: 'radial-gradient(circle at top right, rgba(225, 29, 72, 0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(225, 29, 72, 0.05), transparent 40%)'
      }}>
        <div className="glass-effect animate-fade" style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: '3rem', 
          borderRadius: '32px',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(225, 29, 72, 0.15)', 
              border: '1px solid var(--primary)', 
              color: '#fda4af', 
              padding: '1rem', 
              borderRadius: '16px', 
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 3.5rem', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '16px', 
                    color: 'white',
                    outline: 'none',
                    transition: 'var(--transition)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Password</label>
                <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1rem 1rem 3.5rem', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '16px', 
                    color: 'white',
                    outline: 'none',
                    transition: 'var(--transition)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ 
                width: '100%', 
                marginTop: '1rem', 
                borderRadius: '16px', 
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-glass" style={{ flex: 1, borderRadius: '16px', padding: '0.75rem' }}>
              <User size={18} />
              GitHub
            </button>
            <button className="btn-glass" style={{ flex: 1, borderRadius: '16px', padding: '0.75rem' }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
              Google
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
