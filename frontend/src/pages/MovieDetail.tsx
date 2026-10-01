import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MovieAPI, ShowAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCity } from '../context/CityContext';
import { Calendar, Clock, Play, Star, ChevronLeft, ThumbsUp, Share2, MapPin, Building2 } from 'lucide-react';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [shows, setShows] = useState<any[]>([]);
  const [showsLoading, setShowsLoading] = useState(false);
  const { selectedCity, openCityModal, ensureCitySelected } = useCity();
  const navigate = useNavigate();

  const getNextThreeDates = () => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      let label = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Tomorrow';

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayVal = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayVal}`;

      list.push({
        label,
        day: d.toLocaleDateString('en-US', { day: '2-digit' }),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isoString: dateStr // YYYY-MM-DD in local time
      });
    }
    return list;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const dates = useMemo(() => getNextThreeDates(), []);

  // Set initial selected date to today on mount
  useEffect(() => {
    if (dates.length > 0) {
      setSelectedDate(dates[0].isoString);
    }
  }, [dates]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovie = async () => {
      try {
        const data = await MovieAPI.getById(Number(id));
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        // Mock fallback
        setMovie({
          id: id,
          title: 'Pushpa 2: The Rule',
          description: "Pushpa Raj, who is now the ruler of the red sandalwood syndicate, must face his sworn enemy, SP Bhanwar Singh Shekhawat, in an epic showdown that will determine the fate of his empire and his legacy.",
          genre: 'Action/Thriller',
          rating: 9.6,
          durationMinutes: 175,
          language: 'Telugu',
          releaseDate: '2024-12-05',
          posterUrl: 'https://image.tmdb.org/t/p/original/bhxZj3y59cK7JtGdV285dhDRaMe.jpg'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Fetch shows dynamically when selectedDate changes
  useEffect(() => {
    if (selectedDate && id) {
      const fetchShows = async () => {
        setShowsLoading(true);
        try {
          const data = await ShowAPI.getByMovieAndDate(Number(id), selectedDate);
          setShows(data || []);
        } catch (error) {
          console.error('Error fetching shows:', error);
          // Fallback mock shows
          setShows([
            {
              id: 101,
              startTime: '10:00:00',
              ticketPrice: 350,
              screen: {
                name: 'IMAX 1',
                theater: { name: 'PVR Phoenix', city: { name: 'Mumbai' } }
              }
            },
            {
              id: 102,
              startTime: '14:30:00',
              ticketPrice: 400,
              screen: {
                name: 'Screen 2',
                theater: { name: 'PVR Phoenix', city: { name: 'Mumbai' } }
              }
            },
            {
              id: 103,
              startTime: '18:00:00',
              ticketPrice: 450,
              screen: {
                name: 'Screen A',
                theater: { name: 'AMB Cinemas', city: { name: 'Hyderabad' } }
              }
            },
            {
              id: 104,
              startTime: '21:30:00',
              ticketPrice: 380,
              screen: {
                name: 'Main House',
                theater: { name: 'PVR Director\'s Cut', city: { name: 'Delhi' } }
              }
            }
          ]);
        } finally {
          setShowsLoading(false);
        }
      };
      fetchShows();
    }
  }, [selectedDate, id]);

  const handleBookingClick = (e: React.MouseEvent, showId: number) => {
    e.preventDefault();
    ensureCitySelected(() => {
      navigate(`/book/${showId}`);
    });
  };

  // Filter shows by selected city if available
  const cityFilteredShows = useMemo(() => {
    if (!selectedCity) return shows;
    const cityName = selectedCity.name.toLowerCase();
    const filtered = shows.filter(show => {
      const theaterCity = show.screen?.theater?.city?.name?.toLowerCase() || 
                          show.screen?.theater?.address?.toLowerCase() || '';
      return theaterCity.includes(cityName);
    });

    // If no backend shows have city matching exactly, fallback gracefully to show available shows
    return filtered.length > 0 ? filtered : shows;
  }, [shows, selectedCity]);

  if (loading || !movie) return (
    <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  );

  const cast = [
    { name: 'Allu Arjun', role: 'Pushpa Raj', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop' },
    { name: 'Rashmika Mandanna', role: 'Srivalli', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop' },
    { name: 'Fahadh Faasil', role: 'Bhanwar Singh', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop' },
    { name: 'Dhanunjay', role: 'Jolly Reddy', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2570&auto=format&fit=crop' },
  ];

  return (
    <main>
      <Navbar />
      
      {/* Dynamic Hero Section */}
      <div style={{ position: 'relative', width: '100%', minHeight: '80vh', display: 'flex', alignItems: 'flex-end', paddingTop: '100px' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to top, var(--bg-dark) 0%, rgba(2, 6, 23, 0.6) 50%, rgba(2, 6, 23, 0.4) 100%), url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(0px)',
          zIndex: -1
        }}></div>

        <div className="container" style={{ paddingBottom: '4rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', opacity: 0.8, fontWeight: 500 }} className="hover-push">
            <ChevronLeft size={20} /> Back to Movies
          </Link>
          
          <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'flex-end' }} className="movie-header">
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="animate-fade"
                style={{ 
                  width: '300px', 
                  borderRadius: '20px', 
                  boxShadow: 'var(--shadow-premium)', 
                  border: '1px solid var(--glass-border)',
                  aspectRatio: '2/3',
                  objectFit: 'cover'
                }} 
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                right: '15px', 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800
              }}>
                ULTRA HD
              </div>
            </div>

            <div style={{ paddingBottom: '1rem', flex: 1 }} className="animate-fade">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {movie.genre?.split('/').map((g: string) => (
                  <span key={g} style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>{g}</span>
                ))}
              </div>
              <h1 style={{ fontSize: '4.5rem', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>{movie.title}</h1>
              
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--accent)', color: 'var(--bg-dark)', padding: '4px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '1.1rem' }}>
                    <Star size={14} fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    {movie.rating}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>(12.4K Reviews)</span>
                </div>
                
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}><Clock size={20} className="text-primary" /> {Math.floor((movie.durationMinutes || 150) / 60)}h {(movie.durationMinutes || 150) % 60}m</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}><Calendar size={20} className="text-primary" /> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2024'}</span>
                <span style={{ fontSize: '1.1rem', background: 'var(--glass)', padding: '4px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>{movie.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '5rem', padding: '6rem 0' }}>
        <div className="animate-fade">
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Synopsis</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              {movie.description}
            </p>
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2.25rem', letterSpacing: '-1px' }}>Cast & Crew</h2>
              <button style={{ color: 'var(--primary)', background: 'none', fontWeight: 600 }}>View All</button>
            </div>
            
            <div style={{ display: 'flex', gap: '2.5rem', overflowX: 'auto', paddingBottom: '1.5rem' }}>
              {cast.map((person, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    marginBottom: '1rem',
                    border: '1px solid var(--glass-border)'
                   }}>
                    <img src={person.img} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{person.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{person.role}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div className="glass-effect" style={{ 
            padding: '2.5rem', 
            borderRadius: '32px', 
            height: 'fit-content', 
            position: 'sticky', 
            top: '120px',
            boxShadow: 'var(--shadow-premium)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.6rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Select Date & Shift
              </h3>
              <button
                onClick={openCityModal}
                style={{
                  background: 'rgba(225, 29, 72, 0.15)',
                  border: '1px solid rgba(225, 29, 72, 0.4)',
                  color: 'var(--primary)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
                title="Change city"
              >
                <MapPin size={12} />
                {selectedCity ? selectedCity.name : 'Select City'}
              </button>
            </div>

            {/* If no city is selected, show helper banner */}
            {!selectedCity && (
              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: '#fef3c7'
              }}>
                <span>📍 Please choose your city for local cinemas</span>
                <button
                  onClick={openCityModal}
                  style={{
                    background: 'var(--accent)',
                    color: '#000',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Choose
                </button>
              </div>
            )}
            
            {/* Date Selector Row */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {dates.map((dateObj) => {
                const isActive = selectedDate === dateObj.isoString;
                return (
                  <button
                    key={dateObj.isoString}
                    onClick={() => setSelectedDate(dateObj.isoString)}
                    style={{
                      flex: 1,
                      minWidth: '75px',
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? 'none' : '1px solid var(--glass-border)',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.25rem' }}>{dateObj.label}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{dateObj.day}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{dateObj.month}</span>
                  </button>
                );
              })}
            </div>

            {/* Showtime shifts */}
            {showsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : (
              (() => {
                // Group shows by theater
                const showsByTheater = cityFilteredShows.reduce((acc: any, show: any) => {
                  const theaterName = show.screen?.theater?.name || 'PVR Cinemas';
                  if (!acc[theaterName]) {
                    acc[theaterName] = [];
                  }
                  acc[theaterName].push(show);
                  return acc;
                }, {});

                const theaters = Object.keys(showsByTheater);

                if (theaters.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                      <Building2 size={32} style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '0 0 0.25rem' }}>
                        No shows found {selectedCity ? `in ${selectedCity.name}` : ''} for this date.
                      </p>
                      <p style={{ fontSize: '0.8rem', margin: '0 0 1rem' }}>
                        Try picking another date or switch to a nearby city.
                      </p>
                      <button
                        onClick={openCityModal}
                        className="btn-glass"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '100px' }}
                      >
                        Change City
                      </button>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {theaters.map((theaterName) => (
                      <div key={theaterName} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', opacity: 0.9 }}>{theaterName}</h4>
                          {selectedCity && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedCity.name}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {showsByTheater[theaterName].map((show: any) => (
                            <button
                              key={show.id}
                              onClick={(e) => handleBookingClick(e, show.id)}
                              style={{
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                background: 'rgba(225, 29, 72, 0.1)',
                                border: '1px solid rgba(225, 29, 72, 0.3)',
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                              }}
                              className="hover-showtime-btn"
                              title={`Book for ${formatTime(show.startTime)} (₹${show.ticketPrice || 350})`}
                            >
                              {formatTime(show.startTime)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}

            <button className="btn-glass" style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', marginTop: '2rem' }}>
              Watch Trailer <Play size={18} fill="currentColor" />
            </button>

            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button className="btn-glass" style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%' }}>
                <ThumbsUp size={16} /> 24K
              </button>
              <button className="btn-glass" style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%' }}>
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <style>{`
        .movie-header {
          @media (max-width: 968px) {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .text-primary { color: var(--primary); }
        .hover-push:hover { transform: translateX(-5px); }
        .hover-showtime-btn:hover {
          background: var(--primary) !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
        }
      `}</style>
    </main>
  );
};

export default MovieDetail;
