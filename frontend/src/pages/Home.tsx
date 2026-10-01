import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Footer from '../components/Footer';
import { MovieAPI } from '../services/api';
import { Shield, Zap, Heart } from 'lucide-react';
import { useCity } from '../context/CityContext';

const DEFAULT_FALLBACK_MOVIES = [
  { id: 1, title: 'Pushpa 2: The Rule', genre: 'Action/Thriller', rating: 9.2, language: 'Telugu', posterUrl: 'https://image.tmdb.org/t/p/original/bhxZj3y59cK7JtGdV285dhDRaMe.jpg' },
  { id: 2, title: 'Stree 2', genre: 'Horror/Comedy', rating: 8.5, language: 'Hindi', posterUrl: 'https://image.tmdb.org/t/p/original/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg' },
  { id: 3, title: 'Kalki 2898 AD', genre: 'Sci-Fi/Action', rating: 8.1, language: 'Telugu', posterUrl: 'https://image.tmdb.org/t/p/original/4P3K5medethmTlsuN7UN5bmnATq.jpg' },
  { id: 4, title: 'Jawan', genre: 'Action/Thriller', rating: 7.8, language: 'Hindi', posterUrl: 'https://image.tmdb.org/t/p/original/gTV8RAYEKDcRwn4TFbUZfRk5Nsj.jpg' },
  { id: 5, title: 'Animal', genre: 'Action/Drama', rating: 7.6, language: 'Hindi', posterUrl: 'https://image.tmdb.org/t/p/original/14zedCaF044yj3at1TJ2uHpaNQD.jpg' },
  { id: 6, title: 'RRR', genre: 'Action/Drama', rating: 8.7, language: 'Telugu', posterUrl: 'https://image.tmdb.org/t/p/original/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg' },
  { id: 7, title: 'Baahubali 2: The Conclusion', genre: 'Action/Drama', rating: 8.8, language: 'Telugu', posterUrl: 'https://image.tmdb.org/t/p/original/21sC2assImQIYCEDA84Qh9d1RsK.jpg' },
  { id: 8, title: 'K.G.F: Chapter 2', genre: 'Action/Thriller', rating: 8.4, language: 'Kannada', posterUrl: 'https://image.tmdb.org/t/p/original/au6Nq6kVr9NFICzpmYtMSyDA3Gi.jpg' },
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const { selectedCity } = useCity();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await MovieAPI.getAll();
        if (data && Array.isArray(data) && data.length > 0) {
          setMovies(data);
        } else {
          setMovies(DEFAULT_FALLBACK_MOVIES);
        }
      } catch (error) {
        console.error('Error fetching movies from backend:', error);
        setMovies(DEFAULT_FALLBACK_MOVIES);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Smooth scroll down to movies grid
    const element = document.getElementById('movies-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedGenre('All');
  };

  // Filter movies by search query and genre
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = !searchQuery.trim() || 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (movie.genre && movie.genre.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (movie.language && movie.language.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesGenre = selectedGenre === 'All' || 
        (movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchQuery, selectedGenre]);

  return (
    <main>
      <Navbar />
      
      <Hero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        movies={movies}
      />
      
      <div style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        <MovieGrid 
          title={selectedCity ? `Now Showing in ${selectedCity.name}` : 'Now Showing'} 
          movies={filteredMovies} 
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
      </div>
      
      {/* Value Proposition */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, transparent, rgba(225, 29, 72, 0.05))' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>The Ultimate Cinema Experience</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
              From IMAX to 4DX, explore the most immersive ways to watch your favorite movies {selectedCity ? `in ${selectedCity.name}` : ''}. 
              Exclusive offers, seamless bookings, and the best seats in the house.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Shield, title: 'Verified Theaters', desc: 'Handpicked partner cinemas across major cities with certified audiovisual quality.' },
              { icon: Zap, title: 'Instant Confirmation', desc: 'Get your m-ticket QR code instantly on your phone with zero wait time.' },
              { icon: Heart, title: 'Exclusive Rewards', desc: 'Earn BMS points on every booking and unlock premier discounts and concessions.' },
            ].map((feature, i) => (
              <div key={i} className="glass-effect" style={{ padding: '2.5rem', borderRadius: '24px', transition: 'var(--transition)' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white'
                }}>
                  <feature.icon size={30} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
