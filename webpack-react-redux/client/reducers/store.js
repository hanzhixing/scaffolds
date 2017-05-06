/**
 * 对外部屏蔽store的初始化细节
 *
 * rootReducer需要统一管理.
 * 不得乱用combineReducer, 因为这个行为可能会改变state路径.
 * 目前都是React组件mount到DOM的时候, 显式地分发Action的方式初始化需要的state数据, 就是组件自己负责.
 * 考虑到首屏加载速度, 将来preloadedState很有可能来自服务端(Server Rendering).
 * 尤其是从来没有访问过而Local Storage中没有数据的用户更是这样.
 */
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
// import callApiMiddleware from '../middlewares/redux/callApiMiddleware';
import rootReducer from './index';

let preloadedState = {};

// Local Storage
const LS = {
    key: 'MY_REDUX_STORE',
    content: null,
};

// window.localStorage.clear();

LS.content = window.localStorage.getItem(LS.key);

if (LS.content !== null) {
    LS.content = JSON.parse(LS.content);

    preloadedState = {
        ...preloadedState,
        session: LS.content.session,
    };
}

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
        applyMiddleware(
            ReduxThunk,
            // callApiMiddleware,
        ),
    ),
);

let current = {
    session: null,
};

const syncSessionStateToLocalStorage = () => {
    const previous = current;

    current = {
        session: store.getState().session,
    };

    if (previous.session !== current.session) {
        window.localStorage.setItem(LS.key, JSON.stringify(current));
    }
};

store.subscribe(syncSessionStateToLocalStorage);

export default store;
