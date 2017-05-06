import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import isolates from './index';

const IsolateDashboard = isolates.IsolateDashboard;

const render = (Component) => {
    ReactDOM.render(
        <Component
            module="baidu/agile/pipeline"
            language="en-US"
        />,
        document.getElementById('root'),
    );
};

render(IsolateDashboard);

if (module.hot) {
    module.hot.accept('./index', () => {
        render(isolates.IsolateDashboard);
    });
}
