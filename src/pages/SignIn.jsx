
import { Link } from 'react-router-dom';

/*class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:'',
        };
    
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleChangeEmail(event) {
        let password=this.state.password;
        this.setState({
            email: event.target.value,
            password: password,
        });
      };

      handleChangePassword(event) {
        let email=this.state.email;
        this.setState({
            email: email,
            password: event.target.value,
        });
      }
    
      handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
      }
    
   



    render() {
        return (
            <div className='FormCenter'>
                <form className='FormFields' onSubmit={this.handleSubmit}>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                        <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChangeEmail}/>
                    </div>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChangePassword}/>
                    </div>



                    {/* <div className="FormField">
                        <label className="FormField__CheckboxLabel">
                            <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" /> I agree all statements in <a href="" className="FormField__TermsLink">terms of service</a>
                        </label>
                    </div> }

                    <div className="FormField">
                        <button className="FormField__Button mr-20">Sign In</button> <Link to='/sign-up' className='FormField__Link'>Create an account</Link>
                    </div>
                </form>
            </div>
        );
    };

};

export default SignInForm;*/

import React from 'react';

class SigninForm extends React.Component {
    state = {
        currentUser: {
            email: '',
            fullName: '',
        },
    };

    componentWillMount() {
        const email = window.localStorage.getItem('email');
        const fullName = window.localStorage.getItem('fullName');
        if (email && fullName) {
            this.setState({
                currentUser: {
                    email: email,
                    fullName: fullName,
                },
            });
        }
    }

    componentDidMount() {
        fetch('http://localhost:3001/users/current', {
            credentials: 'include',
            method: 'GET',
        })
            .then((res1) => {
                return res1.json();
            })
            .then((data1) => {
                console.log(data1.data);
                if (data1.data) {
                    window.location.href = 'http://localhost:3000/';
                }
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                    window.alert(error.message);
                }
            });
    }


    submitToServer = (event) => {
        event.preventDefault();
        var email = document.querySelector(`#email`).value;
        var password = document.querySelector(`#password`).value;
        console.log(document.querySelector('#keep').checked);
        fetch('http://localhost:3001/users/login', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                keepLogin: document.querySelector('#keep').checked,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.problems === "1" || data.problems === "2") {
                    document.querySelector(`#alert`).innerHTML="";
                    document.querySelector(`#alert`).style.color = "red";
                    document.querySelector(`#alert`).insertAdjacentHTML("beforeend", `${data.message}`);
                } else {
                    if (document.querySelector('#keep').checked) {
                        window.localStorage.setItem('email', data.data.email);
                        window.localStorage.setItem('fullName', data.data.fullName);
                    }
                    window.location.href = 'http://localhost:3000';
                }
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                    window.alert(error.message);
                }
            });
    }

    clear = () => {
        document.querySelector(`#alert`).innerHTML = ``;
    }

    render() {
        return (
            <div className="login-screen">
                <form onSubmit={this.submitToServer} id="submit-form" onChange={this.clear}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" required id="email" />

                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Password" required id="password" />
                    </div>
                    <div className="form-check">
                        <input id="keep" type="checkbox" className="form-check-input" />
                        <label className="form-check-label">Keep me login</label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{marginTop: "20px"}}>Login</button>
                    <Link to='/sign-up' className='FormField__Link' style={{marginLeft: "20px"}}>Create an account</Link>
                    <small id='alert' className="form - text text - muted row" style={{marginTop: "10px", marginLeft: "5px"}}></small>
                </form>
            </div>
        );
    }
}

export default SigninForm;