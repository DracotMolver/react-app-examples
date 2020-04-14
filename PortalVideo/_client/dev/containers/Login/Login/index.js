/**
 * @author Diego Alberto Molina Vera
 * @copyright 2017 -2018
 */

// -========================== MODULES ==========================-
import React from 'react';
import SuperAgent from 'superagent';
import MD5 from 'js-md5';

// -========================== COMPONENTS ==========================-
import Login from 'Components/Login/Login';
import {
    TYPE_WARNING,
    USER_AND_PASS_ERROR,
    TYPE_ERROR,
    DEFAULT_ERROR_MESSAGE
} from 'Constants/Strings';
import {
    AUTH_URL,
    VIDEO_LIST_URL,
} from 'Constants/Paths';
import { USER_DATA } from 'Constants/Storage';

export default class LoginContainer extends React.Component {
    constructor(props) {
        super();

        this.state = {
            messageText: '',
            messageType: '',
            password: '',
            username: ''
        };

        this.handlerFocusInputs = this.handlerFocusInputs.bind(this);
        this.handlerBlurInputs = this.handlerBlurInputs.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setUsername = this.setUsername.bind(this);
    }

    // -============================ OWN EVENTS ============================-
    handleSubmitForm(event) {
        event.preventDefault();

        const {
            username,
            password
        } = this.state;

        if (password.length > 2 && username.length > 2) {
            // make a request to the API
            // http://localhost:3000/user/auth
            SuperAgent.post(AUTH_URL)
                .type('form') // Shorthand to use the content type as: application/x-www-form-urlencoded
                .send({
                    username,
                    'password': MD5(password) // Encrypt the password
                })
                .end((err, res) => {
                    if (err) {
                        this.setState({
                            messageText: DEFAULT_ERROR_MESSAGE,
                            messageType: TYPE_ERROR
                        });
                    } else {
                        // Save in sessionStorage the params returned by the server
                        // Just in case the user refresh the website
                        if (res.body.status === 'success') {
                            sessionStorage.setItem(
                                USER_DATA,
                                JSON.stringify(res.body)
                            );
                            this.props.history.push(VIDEO_LIST_URL);
                        } else {
                            this.setState({
                                messageText: res.body.error,
                                messageType: TYPE_ERROR
                            });
                        }
                    }
                });
        } else {
            this.setState({
                messageText: USER_AND_PASS_ERROR,
                messageType: TYPE_WARNING
            });
        }
    }

    setPassword(event) {
        this.setState({
            password: event.currentTarget.value
        });
    }

    setUsername(event) {
        this.setState({
            username: event.currentTarget.value
        });
    }

    // -============================ REACT LIFECYLE ============================-
    componentDidUpdate() {
        if (this.state.messageType !== '') {
            const time = setTimeout(() => {
                this.setState({
                    messageText: '',
                    messageType: ''
                });

                clearTimeout(time);
            }, 2600);
        }
    }

    render() {
        const {
            handlerBlurInputs,
            handleSubmitForm,
            setPassword,
            setUsername,
            state
        } = this;

        const {
            messageText,
            messageType,
        } = state;

        return (
            <Login
                // handlerFocusInputs={handlerFocusInputs}
                // handlerBlurInputs={handlerBlurInputs}
                handleSubmitForm={handleSubmitForm}
                messageText={messageText}
                messageType={messageType}
                setPassword={setPassword}
                setUsername={setUsername}
            />
        );
    }
}
