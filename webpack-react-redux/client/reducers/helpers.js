export const mergeStateEntitiesSafely = (state, entities) => {
    const existingIds = [];
    const newItems = {};
    const updatedItems = {};

    Object.keys(entities).forEach((id) => {
        if (state[id]) {
            existingIds.push(id);
        } else {
            newItems[id] = entities[id];
        }
    });

    existingIds.forEach((id) => {
        updatedItems[id] = {
            ...state[id],
            ...entities[id],
        };
    });

    return {
        ...state,
        ...updatedItems,
        ...newItems,
    };
};

export const someFunction = () => {
};
