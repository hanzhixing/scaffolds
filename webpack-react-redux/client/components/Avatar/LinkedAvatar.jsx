import React, { Component } from 'react'
import PropTypes from 'prop-types';

class LinkedAvatar extends React.Component {
    static propTypes = {
        username: PropTypes.string.isRequired,
        realname: PropTypes.string,
        url: PropTypes.string,
        target: PropTypes.string,
        onClick: PropTypes.func,
        className: PropTypes.string,
    }

    constructor(props) {
        super(props)

        this.state = {
            src: Config.paths.avatar.base + '/' + props.username + '.jpg',
        }

        this.onError = this.onError.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            src: Config.paths.avatar.base + '/' + nextProps.username + '.jpg',
        })
    }

    onError(event) {
        event.preventDefault()

        this.setState({
            src: Config.paths.avatar.onerror,
        })
    }

    render () {
        let element

        if (this.props.onClick) {
            element = (
                <img src={this.state.src}
                    onError={(event) => this.onError(event)}
                    onClick={this.props.onClick}
                    title={this.props.realname || this.props.username}
                    className={this.props.className}
                    alt="avatar"
                />
            )
        } else {
            element = (
                <img src={this.state.src}
                    onError={(event) => this.onError(event)}
                    title={this.props.realname || this.props.username}
                    className={this.props.className}
                    alt="avatar"
                />
            )
        }

        if (this.props.url) {
            const target = this.props.target ? this.props.target : '_self'

            element = (
                <a href={linkUrl}
                    target={target}
                    title={this.props.realname || this.props.username}
                    className={this.props.className}
                >
                    {element}
                </a>
            )
        }

        return element
    }
}

export default Avatar
