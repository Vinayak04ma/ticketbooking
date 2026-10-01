import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Armchair, ChevronLeft, CreditCard, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShowAPI, SeatAPI, BookingAPI } from '../services/api';

const SeatSelection: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [show, setShow] = useState<any>(null);
  const [allSeats, setAllSeats] = useState<any[]>([]);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const showData = await ShowAPI.getById(Number(showId));
        setShow(showData);
        
        const seatsData = await SeatAPI.getByScreen(showData.screen.id);
        setAllSeats(seatsData);

        const availableData = await BookingAPI.getAvailable(Number(showId));
        setAvailableSeats(availableData);
      } catch (err) {
        console.error('Error loading seat selection data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (showId) {
      loadData();
    }
  }, [showId]);

  const handleCheckout = async () => {
    if (bookingLoading) return;
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert('Please login/signup to book seats.');
      navigate('/login');
      return;
    }
    const user = JSON.parse(userJson);
    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    
    setBookingLoading(true);
    try {
      const res = await BookingAPI.create({
        userId: user.id,
        showId: Number(showId),
        seatIds: selectedSeats
      });
      setPaymentData(res);
      setShowPaymentModal(true);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      alert(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      setPaymentError('Please fill in all credit card fields.');
      return;
    }
    setPaymentProcessing(true);
    setPaymentError('');
    try {
      await BookingAPI.confirm(paymentData.bookingId, paymentData.clientSecret);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        navigate('/');
      }, 2500);
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      setPaymentError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const toggleSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Group seats by row
  const seatsByRow = allSeats.reduce((acc: any, seat: any) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});
  
  // Sort seats in each row by col
  Object.keys(seatsByRow).forEach(row => {
    seatsByRow[row].sort((a: any, b: any) => a.col - b.col);
  });
  
  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <main style={{ background: 'var(--bg-dark)', minHeight: '100vh', paddingBottom: '10rem' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <button onClick={() => navigate(-1)} style={{ color: 'white', background: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, opacity: 0.8 }}>
            <ChevronLeft size={20} /> Back
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>{show?.movie?.title || 'Pushpa 2: The Rule'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {show ? `${show.screen?.theater?.name || 'PVR Phoenix'} - ${show.screen?.name || 'Screen'} | ${show.showDate} at ${show.startTime}` : 'PVR Phoenix | Today, 07:30 PM'}
            </p>
          </div>
          
          <div style={{ width: '80px' }}></div> {/* Spacer */}
        </div>

        {/* Screen */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div style={{
            width: '85%',
            height: '8px',
            background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
            boxShadow: '0 15px 30px rgba(225, 29, 72, 0.5)',
            margin: '0 auto 1.5rem',
            borderRadius: '100%'
          }}></div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 600 }}>SCREEN THIS WAY</span>
        </div>

        {/* Seat Grid */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          alignItems: 'center',
          padding: '2rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '32px',
          border: '1px solid var(--glass-border)'
        }}>
          {sortedRows.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No seats available for this screen.</p>
          ) : (
            (() => {
              let lastType = "";
              return sortedRows.map(row => {
                const currentType = seatsByRow[row][0]?.seatType;
                const showHeader = currentType !== lastType;
                lastType = currentType;
                
                return (
                  <React.Fragment key={row}>
                    {showHeader && (
                      <div style={{ 
                        width: '100%', 
                        padding: '1.5rem 0 0.5rem', 
                        borderBottom: '1px solid rgba(255,255,255,0.05)', 
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        letterSpacing: '1px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>{currentType} SEATS - ₹{show?.ticketPrice || 350}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ width: '2rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>{row}</span>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {seatsByRow[row].map((seat: any) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          const isOccupied = !availableSeats.some((s: any) => s.id === seat.id);

                          return (
                            <React.Fragment key={seat.id}>
                              {/* Aisles: space after column 3 and column 12 */}
                              {(seat.col === 4 || seat.col === 13) && (
                                <div style={{ width: '2.5rem' }} />
                              )}
                              <button
                                disabled={isOccupied}
                                onClick={() => toggleSeat(seat.id)}
                                title={`${seat.seatNumber} (${seat.seatType})`}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  background: isOccupied ? '#1e293b' : isSelected ? 'var(--primary)' : 'transparent',
                                  border: isOccupied ? 'none' : isSelected ? 'none' : '1px solid var(--glass-border)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'var(--transition)',
                                  cursor: isOccupied ? 'not-allowed' : 'pointer',
                                  transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                                }}
                                className={!isOccupied ? "hover-scale" : ""}
                              >
                                <Armchair size={18} color={isOccupied ? '#475569' : (isSelected ? 'white' : 'var(--text-muted)')} />
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '5rem' }}>
          {[
            { label: 'Available', color: 'transparent', border: '1px solid var(--glass-border)' },
            { label: 'Selected', color: 'var(--primary)', border: 'none' },
            { label: 'Occupied', color: '#1e293b', border: 'none' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: item.color, border: item.border }}></div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          <Info size={14} />
          <span>Tickets once booked cannot be cancelled or refunded.</span>
        </div>
      </div>

      {/* Summary Footer bar */}
      {selectedSeats.length > 0 && (
        <div className="glass-effect animate-fade" style={{
          position: 'fixed',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 800px)',
          padding: '1.25rem 2.5rem',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-premium)',
          zIndex: 1001,
          border: '1px solid rgba(225, 29, 72, 0.3)'
        }}>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{selectedSeats.length} Seats</div>
              <div style={{ maxHeight: '40px', overflowX: 'auto', display: 'flex', gap: '0.5rem', color: 'white', fontWeight: 600 }}>
                {selectedSeats.map(id => allSeats.find(s => s.id === id)?.seatNumber).join(', ')}
              </div>
            </div>
            <div style={{ height: '40px', width: '1px', background: 'var(--glass-border)' }}></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>₹{selectedSeats.length * (show?.ticketPrice || 280)}</div>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout} 
            disabled={bookingLoading}
            className="btn-primary" 
            style={{ 
              padding: '1rem 3rem', 
              fontSize: '1.1rem', 
              borderRadius: '16px',
              opacity: bookingLoading ? 0.7 : 1,
              cursor: bookingLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {bookingLoading ? 'Processing...' : 'Proceed to Pay'}
            <CreditCard size={20} />
          </button>
        </div>
      )}
      
       {/* Payment Gateway Modal */}
      {showPaymentModal && paymentData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem'
        }}>
          <div className="glass-effect animate-fade" style={{
            width: '100%',
            maxWidth: '550px',
            padding: '2.5rem',
            borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'var(--shadow-premium)',
            position: 'relative'
          }}>
            {!paymentSuccess ? (
              <>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-1px' }}>Secure Payment</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
                  Complete your booking payment via Stripe
                </p>

                {/* 3D Animated Flipping Card */}
                <div className="card-container">
                  <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                    <div className="card-front">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 600, opacity: 0.8 }}>CREDIT CARD</span>
                        <div style={{ width: '40px', height: '24px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ fontSize: '1.25rem', letterSpacing: '3px', fontWeight: 700, margin: '1.5rem 0', fontFamily: 'monospace' }}>
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '2px' }}>Card Holder</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>{cardName || 'JOHN DOE'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '2px' }}>Expires</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cardExpiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="card-back">
                      <div style={{ background: 'black', height: '35px', margin: '0 -1.5rem 1rem', width: 'calc(100% + 3rem)' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7, marginRight: '0.5rem' }}>CVV</span>
                        <div style={{ background: 'white', color: 'black', padding: '4px 10px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px' }}>
                          {cardCvc || '•••'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid var(--primary)', color: '#fda4af', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {paymentError}
                  </div>
                )}

                {/* Receipt invoice breakdowns */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Tickets ({selectedSeats.length} seats)</span>
                    <span style={{ color: 'white', fontWeight: 600 }}>₹{paymentData.baseAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>GST (18%)</span>
                    <span style={{ color: 'white', fontWeight: 600 }}>₹{paymentData.gst.toFixed(2)}</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700 }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)' }}>₹{paymentData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                      onFocus={() => setIsFlipped(false)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4111 1111 1111 1111"
                      value={cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                      onFocus={() => setIsFlipped(false)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Expiration</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                        onFocus={() => setIsFlipped(false)}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                        onFocus={() => setIsFlipped(true)}
                        onBlur={() => setIsFlipped(false)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentModal(false);
                        setPaymentError('');
                      }}
                      className="btn-glass"
                      style={{ padding: '0.8rem', borderRadius: '12px', fontSize: '0.95rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={paymentProcessing}
                      className="btn-primary"
                      style={{ padding: '0.8rem', borderRadius: '12px', fontSize: '0.95rem', opacity: paymentProcessing ? 0.7 : 1, cursor: paymentProcessing ? 'not-allowed' : 'pointer' }}
                    >
                      {paymentProcessing ? 'Verifying...' : `Pay ₹${paymentData.totalAmount.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', textAlign: 'center' }}>
                <div className="checkmark-wrapper">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '2rem', marginTop: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Payment Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Your seats have been booked and your tickets have been sent to your email.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .hover-scale:hover {
          background: var(--primary-muted) !important;
          border-color: var(--primary) !important;
          transform: scale(1.15) translateY(-2px);
        }
        
        /* 3D Card Animation Styles */
        .card-container {
          perspective: 1000px;
          width: 100%;
          max-width: 320px;
          height: 180px;
          margin: 0 auto 1.5rem;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          color: white;
        }
        .card-back {
          transform: rotateY(180deg);
          justify-content: center;
        }

        /* Success Checkmark Animation Styles */
        .checkmark-wrapper {
          width: 80px;
          height: 80px;
        }
        .checkmark__circle {
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #10b981;
          fill: none;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #10b981;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s unique;
        }
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 40px #10b981;
          }
        }
      `}</style>
    </main>
  );
};

export default SeatSelection;
