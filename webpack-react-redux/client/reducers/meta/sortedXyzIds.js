import {
    FETCH_BRANCHES_SUCCESS,
} from '../../actions/types';

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BRANCHES_SUCCESS: {
            return [
                ...action.payload.result,
            ];
        }
        default: {
            return state;
        }
    }
};
