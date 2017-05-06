import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import localeEnUS from '../locale/en-US';
import localeZhCN from '../locale/zh-CN';
import store from '../reducers/store';
import Dashboard from '../containers/Dashboard';

export default class IsolateDashboard extends Component {
    static propTypes = {
        language: PropTypes.string
    }

    static defaultProps = {
        language: undefined
    }

    constructor(props) {
        super(props);

        let language;

        if (props.language !== undefined) {
            language = props.language;
        } else {
            language = navigator.language || navigator.userLanguage;
        }

        this.locale = /^en-/.test(language) ? localeEnUS : localeZhCN;

        this.store = store;
    }

    render() {
        return (
            <IntlProvider locale={this.locale.lang} messages={this.locale.messages}>
                <Provider store={this.store}>
                    <Dashboard {...this.props} />
                </Provider>
            </IntlProvider>
        );
    }
}
