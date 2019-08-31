import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SignUpForm extends Component {
    /*render() {
        return (
            <div className='FormCenter'>
                <form className='FormFields' onSubmit={this.handleSubmit}>

                    <div className='FormField'>
                        <label className='FormField__Label' htmlFor='name'>
                            Full Name
                </label>
                        <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="name" />
                    </div>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" />
                    </div>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                        <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" />
                    </div>

                    <div className="FormField">
                        <label className="FormField__CheckboxLabel">
                            <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" /> I agree all statements in <a href="" className="FormField__TermsLink">terms of service</a>
                        </label>
                    </div>

                    <div className="FormField">
                        <button className="FormField__Button mr-20">Sign Up</button> <Link to='/sign-in' className='FormField__Link'>I'm already a menber</Link>
                    </div>
                </form>
            </div>
        );
    };*/
    submitToServer = (event) => {
        this.clear();
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        event.preventDefault();
        var fullName = document.querySelector(`#name`).value;
        var email = document.querySelector(`#email`).value;
        var password = document.querySelector(`#password`).value;
        var cpassword = document.querySelector(`#cpassword`).value;

        if (cpassword === password && emailRegex.test(email) && password.length >= 6) {
            fetch('http://localhost:3001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    password: password,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data.problems === "email") {
                        document.querySelector(`.email1`).style.color = "red";
                        document.querySelector(`#pcalert1`).insertAdjacentHTML("beforeend", data.message);
                    } else if (data.problems === "password") {
                        document.querySelector(`.email1`).style.color = "red";
                        document.querySelector(`#pcalert1`).insertAdjacentHTML("beforeend", data.message);
                    } else {
                        document.querySelector('.register-screen').innerHTML = `Redirecting`;
                        this.props.history.push('login');
                    }
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        window.alert(error.message);
                    }
                });
        }

        if (!emailRegex.test(email)) {
            document.querySelector(`.email1`).style.color = "red";
            document.querySelector(`#pcalert1`).insertAdjacentHTML("beforeend", `Invalid email`);
        }

        if (password.length < 6) {
            document.querySelector(`.password1`).style.color = "red";
            document.querySelector(`#pcalert2`).insertAdjacentHTML("beforeend", `Password must contains more than 6 characters`);
        }

        if (cpassword != password) {
            document.querySelector(`.ctitle`).style.color = "red";
            document.querySelector(`#pcalert3`).insertAdjacentHTML("beforeend", `Passwords do not match`);
        }
    }

    clear = () => {
        document.querySelector(`#pcalert1`).innerHTML = ``;
        document.querySelector(`#pcalert2`).innerHTML = ``;
        document.querySelector(`#pcalert3`).innerHTML = ``;
        document.querySelector(`.ctitle`).style.color = "black";
        document.querySelector(`.password1`).style.color = "black";
        document.querySelector(`.email1`).style.color = "black";
    }

    render() {
        return (
            <div className="register-screen">
                <form onSubmit={this.submitToServer} id="submit-form" >
                    <div className="form-group">
                        <label>Full name</label>
                        <input type="text" maxLength="20" className="form-control" placeholder="Full Name" required id="name" onChange={this.clear} />
                    </div>
                    <div className="form-group email1">
                        <label>Email address</label>
                        <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" required id="email" onChange={this.clear} />
                        <small id='pcalert1' className="form - text text - muted"></small>
                    </div>
                    <div className="form-group password1">
                        <label>Password</label>
                        <input type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Password" required id="password" onChange={this.clear} />
                        <small id='pcalert2' className="form - text text - muted"></small>
                    </div>
                    <div className="form-group ctitle">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Confirm Password" required id="cpassword" onChange={this.clear} />
                        <small id='pcalert3' className="form - text text - muted"></small>
                    </div>
                    <div className="FormField">
                        <label className="FormField__CheckboxLabel">
                            <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" /> I agree all statements in <a href="" className="FormField__TermsLink">terms of service</a>
                        </label>
                    </div>

                    <div className="FormField">
                    <button type="submit" className="btn btn-primary">Sign-up</button> <Link to='/login' className='FormField__Link'>I'm already a menber</Link>
                    </div>
                </form>
            </div>
        );
    }
};

export default SignUpForm;