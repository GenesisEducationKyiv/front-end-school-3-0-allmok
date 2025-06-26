import React from 'react';
import { useFilterStore } from './hooks/useFilters';

interface TrackFiltersProps {
    availableGenres: string[];
    uniqueArtists: string[];
    disabled?: boolean; 
}

export const TrackFilters: React.FC<TrackFiltersProps> = ({
    availableGenres,
    uniqueArtists,
    disabled = false
}) => {
    const { 
        sort, order, genre, artist, search,
        setSort, setOrder, setGenre, setArtist, setSearch, resetFilters
    } = useFilterStore();

    const handleReset = () => {
        resetFilters();
    };
    return (
        <div>
            <div
                className="list-controls"
                data-testid="list-controls"
                aria-hidden={false} 
            >
                <div className="control-group search-group">
                    <label htmlFor="search-input">Search:</label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Name, artist, album..."
                        value={search}
                        onChange={e => setSearch(e.target.value)} 
                        data-testid="search-input"
                        disabled={disabled}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="sort-select">Sort by:</label>
                    <div className="sort-controls">
                        <select
                            id="sort-select"
                            value={sort} 
                            onChange={e => setSort(e.target.value)} 
                            data-testid="sort-select"
                            disabled={disabled}
                        >
                            <option value="createdAt">Date</option>
                            <option value="title">Name</option>
                            <option value="artist">Artist</option>
                            <option value="album">Album</option>
                        </select>
                        <select
                            value={order} 
                            onChange={e => setOrder(e.target.value as 'asc' | 'desc')}
                            aria-label="Sorting direction"
                            data-testid="sort-order"
                            disabled={disabled}
                        >
                            <option value="desc">Descending (↓)</option>
                            <option value="asc">Ascending (↑)</option>
                        </select>
                    </div>
                </div>

                <div className="control-group">
                    <label htmlFor="filter-genre">Genre:</label>
                    <select
                        id="filter-genre"
                        value={genre} 
                        onChange={e => setGenre(e.target.value)}
                        data-testid="filter-genre"
                        disabled={disabled || availableGenres.length === 0}
                    >
                        <option value="">All Genres</option>
                        {availableGenres.map(genreName => (
                          <option key={genreName} value={genreName}>{genreName}</option>
                        ))}
                    </select>
                </div>

                 <div className="control-group">
                    <label htmlFor="filter-artist">Artist:</label>
                    <select
                        id="filter-artist"
                        value={artist} 
                        onChange={e => setArtist(e.target.value)} 
                        data-testid="filter-artist"
                        disabled={disabled || uniqueArtists.length === 0}
                    >
                        <option value="">All Artists</option>
                        {uniqueArtists.map(artistName => (
                          <option key={artistName} value={artistName}>{artistName}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group reset-group">
                    <button
                        onClick={handleReset} 
                        className="reset-filters-button"
                        data-testid="reset-filters-button"
                        disabled={disabled}
                    >
                        Reset filters
                    </button>
                </div>
            </div>
        </div>
    );
};