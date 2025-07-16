import React, { useState } from 'react';
import { useFilterStore } from './hooks/useFilters';
import { FilterDialog } from './../../../components/FilterDialog';
import { MdOutlinedSelect, MdOutlinedTextField, MdMenuItem} from './../../../components/MaterialWrappers'; 


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


    const handleValueChange = (setter: (value: string) => void) => (e: Event) => {
        const target = e.target as HTMLInputElement; 
        if (target) {
            setter(target.value);
        }
    };
    
    const handleSortChange = handleValueChange(setSort);
    const handleSearchInput = handleValueChange(setSearch);

    return (
        <>
            <div className="list-controls" data-testid="list-controls">
                <div className="control-group search-group">
                    <MdOutlinedTextField
                        label="Search..."
                        value={search}
                        onInput={handleSearchInput}
                        data-testid="search-input"
                        disabled={disabled}
                    >
                        <md-icon slot="leading-icon">search</md-icon>
                    </MdOutlinedTextField>
                </div>
                
                <div className="control-group">
                    <MdOutlinedSelect
                        label="Sort by"
                        value={sort}
                        onChange={handleSortChange} 
                        data-testid="sort-select"
                        disabled={disabled}
                    >
                        <MdMenuItem value="createdAt">Date</MdMenuItem>
                        <MdMenuItem value="title">Name</MdMenuItem>
                        <MdMenuItem value="artist">Artist</MdMenuItem>
                        <MdMenuItem value="album">Album</MdMenuItem>
                    </MdOutlinedSelect>
                    
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