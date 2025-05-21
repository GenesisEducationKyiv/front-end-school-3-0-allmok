
import { renderHook, act } from '@testing-library/react'; 
import { describe, it, expect } from 'vitest';
import { useBulkActions } from '../features/tracks/components/hooks/useBulkActions';


describe('useBulkActions', () => {
    const initialTrackIds = ['t1', 't2', 't3', 't4'];

    it('should initialize with an empty selection', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));

        expect(result.current.selectedTrackIds).toBeInstanceOf(Set);
        expect(result.current.selectedTrackIds.size).toBe(0);
        expect(result.current.selectionProps.isAllSelected).toBe(false);
    });

    it('handleSelectToggle should add an ID if not selected', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));
        act(() => {
            result.current.selectionProps.handleSelectToggle('t2');
        });

        expect(result.current.selectedTrackIds.size).toBe(1);
        expect(result.current.selectedTrackIds.has('t2')).toBe(true);
        expect(result.current.selectedTrackIds.has('t1')).toBe(false);
    });

    it('handleSelectToggle should remove an ID if already selected', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));

        // Select t2 first
        act(() => {
            result.current.selectionProps.handleSelectToggle('t2');
        });
        expect(result.current.selectedTrackIds.has('t2')).toBe(true);

        act(() => {
            result.current.selectionProps.handleSelectToggle('t2');
        });

        expect(result.current.selectedTrackIds.size).toBe(0);
        expect(result.current.selectedTrackIds.has('t2')).toBe(false);
    });

    it('handleSelectAllClick should select all available IDs when checked', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));

        // Select All checkbox
        const mockEvent = { target: { checked: true } } as React.ChangeEvent<HTMLInputElement>;
        act(() => {
            result.current.selectionProps.handleSelectAllClick(mockEvent);
        });

        expect(result.current.selectedTrackIds.size).toBe(initialTrackIds.length);
        expect(result.current.selectedTrackIds.has('t1')).toBe(true);
        expect(result.current.selectedTrackIds.has('t2')).toBe(true);
        expect(result.current.selectedTrackIds.has('t3')).toBe(true);
        expect(result.current.selectedTrackIds.has('t4')).toBe(true);
        expect(result.current.selectionProps.isAllSelected).toBe(true);
    });

    it('handleSelectAllClick should deselect all IDs when unchecked', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));

        // Select all first
        const mockCheckEvent = { target: { checked: true } } as React.ChangeEvent<HTMLInputElement>;
        act(() => {
            result.current.selectionProps.handleSelectAllClick(mockCheckEvent);
        });
        expect(result.current.selectedTrackIds.size).toBe(initialTrackIds.length);

        //  unchecking Select All checkbox
        const mockUncheckEvent = { target: { checked: false } } as React.ChangeEvent<HTMLInputElement>;
        act(() => {
            result.current.selectionProps.handleSelectAllClick(mockUncheckEvent);
        });

        expect(result.current.selectedTrackIds.size).toBe(0);
        expect(result.current.selectionProps.isAllSelected).toBe(false);
    });

    it('clearSelection should reset the selection', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));

        // Select some items
        act(() => {
            result.current.selectionProps.handleSelectToggle('t1');
            result.current.selectionProps.handleSelectToggle('t3');
        });
        expect(result.current.selectedTrackIds.size).toBe(2);

        // Clear the selection
        act(() => {
            result.current.clearSelection();
        });

        expect(result.current.selectedTrackIds.size).toBe(0);
    });

    it('isAllSelected should be true only when all available IDs are selected', () => {
        const { result } = renderHook(() => useBulkActions(initialTrackIds));

        act(() => { result.current.selectionProps.handleSelectToggle('t1'); });
        expect(result.current.selectionProps.isAllSelected).toBe(false);

        act(() => { result.current.selectionProps.handleSelectToggle('t2'); });
        expect(result.current.selectionProps.isAllSelected).toBe(false);

        act(() => { result.current.selectionProps.handleSelectToggle('t3'); });
        expect(result.current.selectionProps.isAllSelected).toBe(false);

        act(() => { result.current.selectionProps.handleSelectToggle('t4'); });
        expect(result.current.selectionProps.isAllSelected).toBe(true);

        act(() => { result.current.selectionProps.handleSelectToggle('t1'); });
        expect(result.current.selectionProps.isAllSelected).toBe(false);
    });

     it('should update isAllSelected when allAvailableIds changes', () => {
        const { result, rerender } = renderHook(
            ({ ids }) => useBulkActions(ids),
            { initialProps: { ids: ['t1', 't2'] } }
        );

         act(() => {
            result.current.selectionProps.handleSelectAllClick({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
        });
        expect(result.current.selectedTrackIds.size).toBe(2);
        expect(result.current.selectionProps.isAllSelected).toBe(true);

        rerender({ ids: ['t1', 't2', 't3'] });
        expect(result.current.selectedTrackIds.size).toBe(2); 
        expect(result.current.selectionProps.isAllSelected).toBe(false); 

        // Select the new ID
         act(() => {
            result.current.selectionProps.handleSelectToggle('t3');
        });
         expect(result.current.selectedTrackIds.size).toBe(3);
         expect(result.current.selectionProps.isAllSelected).toBe(true); 
    });

});