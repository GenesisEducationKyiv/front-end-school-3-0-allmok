// import { useState, useCallback, useMemo } from 'react';

// export const useBulkActions = (allAvailableIds: string[] = []) => {
//     const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());

//     const handleSelectToggle = useCallback((id: string) => {
//         setSelectedTrackIds(prevSelected => {
//             const newSelected = new Set(prevSelected);
//             if (newSelected.has(id)) {
//                 newSelected.delete(id);
//             } else {
//                 newSelected.add(id);
//             }
//             return newSelected;
//         });
//     }, []);

//     const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//         const isChecked = event.target.checked;
//         if (isChecked) {
//             setSelectedTrackIds(new Set(allAvailableIds)); 
//         } else {
//             setSelectedTrackIds(new Set());
//         }
//     }, [allAvailableIds]);

//     const clearSelection = useCallback(() => {
//         setSelectedTrackIds(new Set());
//     }, []);

//     const selectionProps = useMemo(() => ({
//         selectedTrackIds,
//         handleSelectToggle,
//         handleSelectAllClick,
//         isAllSelected: allAvailableIds.length > 0 && selectedTrackIds.size === allAvailableIds.length,
//     }), [selectedTrackIds, handleSelectToggle, handleSelectAllClick, allAvailableIds]);


//     return { selectedTrackIds, selectionProps, clearSelection };
// };