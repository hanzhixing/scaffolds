import { combineReducers } from 'redux';
import api from './api';
import entities from './entities';
import meta from './meta';
import session from './session';
import ui from './ui';

export default combineReducers({
    api,
    entities,
    meta,
    session,
    ui,
});
