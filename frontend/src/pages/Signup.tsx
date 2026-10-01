import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserAPI } from '../services/api';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError('Please fill in all fields.');
      return;
    }
    if (!termsAccepted) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Send OTP to email first
      await UserAPI.sendOtp(email);
      setShowOtpModal(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to send OTP email. Please verify your email and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the verification code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Register with all details including OTP
      const user = await UserAPI.register({ name, email, password, phone, otp });
      localStorage.setItem('user', JSON.stringify(user));
      // Notify components about user changes
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'OTP verification failed. Please try again.'
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
          maxWidth: '500px', 
          padding: '3rem', 
          borderRadius: '32px',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', letterSpacing: '-1px' }}>
              {showOtpModal ? 'Verify Email' : 'Create Account'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {showOtpModal ? `Verification OTP sent to ${email}` : 'Join thousands of cinema lovers today'}
            </p>
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

          {!showOtpModal ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="tel" 
                    placeholder="9876543210" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Password</label>
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} 
                />
                <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  I agree to the <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms of Service</Link> and <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</Link>
                </label>
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
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Please check your email and enter the 6-digit OTP code below. 
                (If SMTP is not configured, check your backend console logs for the code).
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>One-Time Password (OTP)</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '1rem 1rem 1rem 3.5rem', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '16px', 
                      color: 'white',
                      outline: 'none',
                      fontSize: '1.1rem',
                      letterSpacing: '4px',
                      textAlign: 'center',
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
                {loading ? 'Creating Account...' : 'Verify & Register'}
                <ArrowRight size={18} />
              </button>

              <button 
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                  textDecoration: 'underline'
                }}
              >
                Back to Registration
              </button>
            </form>
          )}

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OR SIGN UP WITH</span>
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
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
