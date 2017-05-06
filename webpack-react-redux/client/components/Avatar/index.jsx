import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { etuiClassName } from '../helpers/etui';
import defaultImage from './images/default.png';
import './style.less';

export default class Avatar extends React.Component {
    static propTypes = {
        basepath: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        realname: PropTypes.string,
        size: PropTypes.string,
        className: PropTypes.string,
    }

    static defaultProps = {
        realname: '',
        size: 'm',
        className: etuiClassName('avatar'),
    }

    constructor(props) {
        super(props);

        this.state = {
            src: `${props.basepath}/${props.username}.jpg`,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            src: `${nextProps.basepath}/${nextProps.username}.jpg`,
        });
    }

    onError = (e) => {
        e.preventDefault();

        this.setState({
            src: defaultImage,
        });
    }

    sizeClassName = (size) => {
        switch (size) {
            case 'xs':
            case 's':
            case 'l':
            case 'xl':
                return size;
            case 'm':
            default:
                return 'm';
        }
    }

    render() {
        const {
            src,
        } = this.state;

        const {
            username,
            realname,
            size,
            className,
        } = this.props;

        return (
            <img
                src={src}
                onError={this.onError}
                title={realname || username}
                className={`${className} size-${this.sizeClassName(size)}`}
                alt="avatar"
            />
        );
    }
}
