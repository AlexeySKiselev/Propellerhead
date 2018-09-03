/**
 * Login Page React Component
 * Created by Alexey S. Kiselev on May 2017.
 */

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Button from './Button';
import axios from 'axios';

class LoginMain extends Component {
    constructor(props){
        super(props);
        this.state ={
            signin_email: '',
            signin_password: '',
            errormsg: '',
            errorvisible: 'hidden'
        };
        //this.submitSigninFrom = this.submitSigninFrom.bind(this);
        this.redirectToHome = this.redirectToHome.bind(this);
        this.errors = {
            empty: 'Please, enter Your e-mail and password',
            nouser: 'No users was found! Please, check login and password'
        };
    }

    redirectToHome(){
        window.location = '/';
    }

    handleInput(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitLogin(e) {
        e.preventDefault();
        if(this.state.signin_email !== '' && this.state.signin_password !== '') {
            axios.post('/api/login', {
                login: this.state.signin_email,
                password: this.state.signin_password
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if(response.data._id === 'error'){
                        this.setState({
                            errormsg: response.data.message,
                            errorvisible: 'visible'
                        });
                        return false;
                    } else {
                        window.location = '/';
                    }
                });
        } else {
            this.setState({
                errormsg: this.errors.empty,
                errorvisible: 'visible'
            });
        }
    }

    render(){
        return (
            <div className="login_wrapper">
                <div className="login_box">
                    <div className="login_info">
                        Propellerhead login
                    </div>
                    <div className={`login_error ${this.state.errorvisible}`}>
                        {this.state.errormsg}
                    </div>
                    <form id="login_form" className="login_form">
                        <label htmlFor="signin_email">E-mail:</label>
                        <input type="text" name="signin_email" placeholder="Enter e-mail" onChange={this.handleInput.bind(this)} />
                        <label htmlFor="signin_password">Password:</label>
                        <input type="password" name="signin_password" placeholder="Enter password" onChange={this.handleInput.bind(this)} />
                    </form>
                    <div className="login_button">
                        <Button label="Login" additionalClass="login_button_float" clickHandler={this.submitLogin.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDom.render(<LoginMain/>, document.getElementById('login_app'));
