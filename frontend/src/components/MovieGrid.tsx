import React from 'react';
import MovieCard from './MovieCard';
import { Film, X, Search, Sparkles } from 'lucide-react';

interface MovieGridProps {
  title: string;
  movies: any[];
  searchQuery?: string;
  onClearSearch?: () => void;
  selectedGenre?: string;
  onSelectGenre?: (genre: string) => void;
  allGenres?: string[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  title, 
  movies,
  searchQuery = '',
  onClearSearch,
  selectedGenre = 'All',
  onSelectGenre,
  allGenres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller']
}) => {
  return (
    <section id="movies-section" className="container" style={{ padding: '4rem 0 6rem' }}>
      {/* Header & Category Filters */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              <Sparkles size={16} />
              <span>Blockbuster Releases</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', letterSpacing: '-1.5px', margin: 0 }}>{title}</h2>
          </div>

          {/* Search Query Pill if searching */}
          {searchQuery && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(225, 29, 72, 0.15)',
              border: '1px solid var(--primary)',
              padding: '0.5rem 1rem',
              borderRadius: '100px',
              fontSize: '0.9rem',
              color: '#fff'
            }}>
              <Search size={15} color="var(--primary)" />
              <span>
                Search: <strong>"{searchQuery}"</strong> ({movies.length} found)
              </span>
              {onClearSearch && (
                <button
                  onClick={onClearSearch}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Genre / Category Filter Pills */}
        {onSelectGenre && (
          <div style={{ 
            display: 'flex', 
            gap: '0.6rem', 
            overflowX: 'auto', 
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none'
          }}>
            {allGenres.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => onSelectGenre(genre)}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                    border: isActive ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  className="genre-pill"
                >
                  {genre}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {movies.length === 0 ? (
        <div 
          className="glass-effect"
          style={{
            padding: '4rem 2rem',
            borderRadius: '24px',
            textAlign: 'center',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <Film size={48} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>No Movies Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '1rem' }}>
            {searchQuery 
              ? `We couldn't find any movie matching "${searchQuery}". Try checking for typos or explore our full collection.`
              : 'No movies currently match the selected filter category.'}
          </p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem', borderRadius: '100px' }}
            >
              Reset Filters & View All
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '2.5rem'
        }}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <style>{`
        .genre-pill:hover {
          border-color: var(--primary) !important;
          color: #fff !important;
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default MovieGrid;
