import {
    mergeStateEntitiesSafely,
} from '../helpers';

import {
    FETCH_BRANCHES_SUCCESS,
} from '../../actions/types';

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BRANCHES_SUCCESS: {
            return mergeStateEntitiesSafely(state, action.payload.entities.branches);
        }
        default: {
            return state;
        }
    }
};
