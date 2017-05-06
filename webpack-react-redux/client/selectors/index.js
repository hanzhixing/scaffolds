import { createSelector } from 'reselect';

export const selectPipelines = createSelector(
    [
        state => state.entities.xyz,
        state => state.meta.sortedXyzIds,
    ],
    (entities, sortedIds) => (
        sortedIds.map((id) => ({
            ...entities[id],
        }))
    )
);
