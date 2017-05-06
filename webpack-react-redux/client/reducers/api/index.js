import { combineReducers } from 'redux';
import Errio from 'errio';
import {
    FETCH_XYZ_REQUEST,
    FETCH_XYZ_SUCCESS,
    FETCH_XYZ_FAILURE,
} from '../../actions/types';

const initialState = {};

export default (state = initialState, action) => {
    if ([
        FETCH_XYZ_REQUEST,
        FETCH_XYZ_SUCCESS,
        FETCH_XYZ_FAILURE,
    ].indexOf(action.type) === -1) {
        return state;
    }

    const tokens = action.type.split('_');
    const statusToken = tokens.pop();
    const typeToken = tokens.join('_');

    switch (statusToken) {
        case 'REQUEST': {
            return {
                ...state,
                [typeToken]: {
                    ...state[typeToken],
                    isFetching: true,
                    lastUpdated: Date.now(),
                    payload: action.payload,
                },
            };
        }
        case 'SUCCESS': {
            return {
                ...state,
                [typeToken]: {
                    ...state[typeToken],
                    isFetching: false,
                    isFailed: false,
                    lastUpdated: Date.now(),
                    payload: action.payload,
                },
            };
        }
        case 'FAILURE': {
            Errio.setDefaults({
                stack: true,
            });

            return {
                ...state,
                [typeToken]: {
                    ...state[typeToken],
                    isFetching: false,
                    isFailed: true,
                    lastUpdated: Date.now(),
                    payload: JSON.parse(Errio.stringify(action.payload)),
                },
            };
        }
        default: {
            return state;
        }
    }
};
