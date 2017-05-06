import path from 'path';
import fetch from 'isomorphic-fetch';
import { normalize, schema } from 'normalizr';
import { createAction } from 'redux-actions';
import RestApi from './helpers/RestApi';
import {
    FETCH_XYZ_REQUEST,
    FETCH_XYZ_SUCCESS,
    FETCH_XYZ_FAILURE,
} from './types';
import Config from '../config';

// 怎么链式dispatch多个异步Action? 看https://github.com/reactjs/redux/issues/1676

export const fetchXYZ = (args) => (dispatch, getState) => {
    dispatch(createAction(FETCH_XYZ_REQUEST)(args));

    const {
        name = undefined,
        field = undefined,
        offset = 0,
        count = 5,
    } = args;

    let query = {};

    if (name) {
        query.name = name;
    }

    if (field) {
        query.field = field;
    }

    query = {
        ...query,
        _offset: offset,
        _limit: count,
    };

    return (new RestApi(Config.api.v1))
        .resources('/xyz')
        .get(query)
        .then((response) => response.json())
        .then((json) => {
            const buildsSchema = new schema.Entity('abc', {}, {
                idAttribute: (value, parent, key) => (value.abc.id),
                processStrategy: (value, parent, key) => {
                    const entity = {
                        id: value.abc.id,
                        name: value.abc.name,
                    };

                    return entity;
                },
            });
            dispatch(createAction(FETCH_XYZ_SUCCESS)(
                normalize(json, new schema.Array(buildsSchema))
            ));
        })
        .catch((error) => {
            const payload = (error instanceof Error) ? error : new Error(error);
            dispatch(createAction(FETCH_XYZ_FAILURE)(payload));
        });
};
