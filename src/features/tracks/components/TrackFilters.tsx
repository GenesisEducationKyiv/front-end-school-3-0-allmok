import React, { useState } from 'react';

interface TrackFiltersProps {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    filterGenre: string;
    filterArtist: string;
    searchQuery: string;
    handleSortChange: (value: string) => void;
    handleOrderChange: (value: 'asc' | 'desc') => void;
    handleGenreChange: (value: string) => void;
    handleArtistChange: (value: string) => void;
    handleSearchChange: (value: string) => void;
    handleResetFilters: () => void;
    availableGenres: string[];
    uniqueArtists: string[];
    disabled?: boolean; 
}

export const TrackFilters: React.FC<TrackFiltersProps> = ({
    sortBy, sortOrder, filterGenre, filterArtist, searchQuery,
    handleSortChange, handleOrderChange, handleGenreChange, handleArtistChange,
    handleSearchChange, handleResetFilters,
    availableGenres, uniqueArtists, disabled = false
}) => {
    const [isVisible] = useState(true);

    return (
        <div>

            <div
                className={`list-controls ${isVisible ? 'visible' : 'hidden'}`}
                data-testid="list-controls"
                aria-hidden={!isVisible}
            >

                <div className="control-group search-group">
                    <label htmlFor="search-input">Search:</label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Name, artist, album..."
                        value={searchQuery}
                        onChange={e => handleSearchChange(e.target.value)}
                        data-testid="search-input"
                        disabled={disabled}
                    />
                </div>


                <div className="control-group">
                    <label htmlFor="sort-select">Sort by:</label>
                    <div className="sort-controls">
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={e => handleSortChange(e.target.value)}
                            data-testid="sort-select"
                            disabled={disabled}
                        >
                            <option value="createdAt">Date</option>
                            <option value="title">Name</option>
                            <option value="artist">Artist</option>
                            <option value="album">Album</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={e => handleOrderChange(e.target.value as 'asc' | 'desc')}
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
                        value={filterGenre}
                        onChange={e => handleGenreChange(e.target.value)}
                        data-testid="filter-genre"
                        disabled={disabled || availableGenres.length === 0}
                    >
                        <option value="">All Genres</option>
                        {availableGenres.map(g => (
                        <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>


                 <div className="control-group">
                    <label htmlFor="filter-artist">Artist:</label>
                    <select
                        id="filter-artist"
                        value={filterArtist}
                        onChange={e => handleArtistChange(e.target.value)}
                        data-testid="filter-artist"
                        disabled={disabled || uniqueArtists.length === 0}
                    >
                        <option value="">All Artists</option>
                        {uniqueArtists.map(artist => (
                        <option key={artist} value={artist}>{artist}</option>
                        ))}
                    </select>
                </div>


                <div className="control-group reset-group">
                    <button
                        onClick={handleResetFilters}
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