import React, { useState } from 'react';
import { useFilterStore } from './hooks/useFilters';
import { FilterDialog } from './../../../components/FilterDialog'; 

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
    
    const [isGenreDialogOpen, setGenreDialogOpen] = useState(false);
    const [isArtistDialogOpen, setArtistDialogOpen] = useState(false);

    const handleReset = () => {
        resetFilters();
    };
    
    const toggleOrder = () => {
        setOrder(order === 'asc' ? 'desc' : 'asc');
    };

    return (
        <>
            <div className="list-controls" data-testid="list-controls">
                <div className="control-group search-group">
                    <md-outlined-text-field
                        label="Search..."
                        value={search}
                        onInput={(e: any) => setSearch(e.target.value)}
                        data-testid="search-input"
                        disabled={disabled}
                    >
                        <md-icon slot="leading-icon">search</md-icon>
                    </md-outlined-text-field>
                </div>

                 <div className="control-group">
                    <md-outlined-select
                        label="Sort by"
                        value={sort}
                        onInput={(e: any) => setSort(e.target.value)}
                        data-testid="sort-select"
                        disabled={disabled}
                    >
                        <md-menu-item value="createdAt">Date</md-menu-item>
                        <md-menu-item value="title">Name</md-menu-item>
                        <md-menu-item value="artist">Artist</md-menu-item>
                        <md-menu-item value="album">Album</md-menu-item>
                    </md-outlined-select>
                    <md-icon-button onClick={toggleOrder} disabled={disabled}>
                        <md-icon>{order === 'asc' ? 'arrow_upward' : 'arrow_downward'}</md-icon>
                    </md-icon-button>
                </div>


                <div className="control-group">
                    <md-outlined-button onClick={() => setGenreDialogOpen(true)} disabled={disabled || availableGenres.length === 0}>
                        Genre: {genre || 'All'}
                    </md-outlined-button>
                </div>

                <div className="control-group">
                    <md-outlined-button onClick={() => setArtistDialogOpen(true)} disabled={disabled || uniqueArtists.length === 0}>
                        Artist: {artist || 'All'}
                    </md-outlined-button>
                </div>
                <div className="control-group reset-group">
                    <md-text-button onClick={handleReset} disabled={disabled}>
                        <md-icon slot="icon">refresh</md-icon>
                        Reset
                    </md-text-button>
                </div>
            </div>

            <FilterDialog
                open={isGenreDialogOpen}
                onClose={() => setGenreDialogOpen(false)}
                title="Filter by Genre"
                items={availableGenres}
                selectedValue={genre}
                onConfirm={setGenre}
            />

            <FilterDialog
                open={isArtistDialogOpen}
                onClose={() => setArtistDialogOpen(false)}
                title="Filter by Artist"
                items={uniqueArtists}
                selectedValue={artist}
                onConfirm={setArtist}
            />
        </>
    );
};