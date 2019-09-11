import React, { Component } from "react";
import { Link } from "react-router-dom";

// class SignUpForm extends Component {
//     submitToServer = (event) => {
//         this.clear();
//         const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         event.preventDefault();
//         var fullName = document.querySelector(`#name`).value;
//         var email = document.querySelector(`#email`).value;
//         var password = document.querySelector(`#password`).value;
//         var cpassword = document.querySelector(`#cpassword`).value;

//         if (cpassword === password && emailRegex.test(email) && password.length >= 6) {
//             fetch('http://localhost:3001/users/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     fullName: fullName,
//                     email: email,
//                     password: password,
//                 }),
//             })
//                 .then((res) => {
//                     return res.json();
//                 })
//                 .then((data) => {
//                     if (data.problems === "email") {
//                         document.querySelector(`.email1`).style.color = "red";
//                         document.querySelector(`#pcalert1`).insertAdjacentHTML("beforeend", data.message);
//                     } else if (data.problems === "password") {
//                         document.querySelector(`.email1`).style.color = "red";
//                         document.querySelector(`#pcalert1`).insertAdjacentHTML("beforeend", data.message);
//                     } else {
//                         document.querySelector('.register-screen').innerHTML = `Redirecting`;
//                         this.props.history.push('login');
//                     }
//                 })
//                 .catch((error) => {
//                     if (error) {
//                         console.log(error);
//                         window.alert(error.message);
//                     }
//                 });
//         }

//         if (!emailRegex.test(email)) {
//             document.querySelector(`.email1`).style.color = "red";
//             document.querySelector(`#pcalert1`).insertAdjacentHTML("beforeend", `Invalid email`);
//         }

//         if (password.length < 6) {
//             document.querySelector(`.password1`).style.color = "red";
//             document.querySelector(`#pcalert2`).insertAdjacentHTML("beforeend", `Password must contains more than 6 characters`);
//         }

//         if (cpassword != password) {
//             document.querySelector(`.ctitle`).style.color = "red";
//             document.querySelector(`#pcalert3`).insertAdjacentHTML("beforeend", `Passwords do not match`);
//         }
//     }

//     clear = () => {
//         document.querySelector(`#pcalert1`).innerHTML = ``;
//         document.querySelector(`#pcalert2`).innerHTML = ``;
//         document.querySelector(`#pcalert3`).innerHTML = ``;
//         document.querySelector(`.ctitle`).style.color = "black";
//         document.querySelector(`.password1`).style.color = "black";
//         document.querySelector(`.email1`).style.color = "black";
//     }

//     render() {
//         return (
//             <div className="register-screen">
//                 <form onSubmit={this.submitToServer} id="submit-form" >
//                     <div className="form-group">
//                         <label>Full name</label>
//                         <input type="text" maxLength="20" className="form-control" placeholder="Full Name" required id="name" onChange={this.clear} />
//                     </div>
//                     <div className="form-group email1">
//                         <label>Email address</label>
//                         <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" required id="email" onChange={this.clear} />
//                         <small id='pcalert1' className="form - text text - muted"></small>
//                     </div>
//                     <div className="form-group password1">
//                         <label>Password</label>
//                         <input type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Password" required id="password" onChange={this.clear} />
//                         <small id='pcalert2' className="form - text text - muted"></small>
//                     </div>
//                     <div className="form-group ctitle">
//                         <label>Confirm Password</label>
//                         <input type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Confirm Password" required id="cpassword" onChange={this.clear} />
//                         <small id='pcalert3' className="form - text text - muted"></small>
//                     </div>
//                     <div className="FormField">
//                         <label className="FormField__CheckboxLabel">
//                             <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" /> I agree all statements in <a href="" className="FormField__TermsLink">terms of service</a>
//                         </label>
//                     </div>

//                     <div className="FormField">
//                     <button type="submit" className="btn btn-primary">Sign-up</button> <Link to='/login' className='FormField__Link'>I'm already a menber</Link>
//                     </div>
//                 </form>
//             </div>
//         );
//     }
// };

import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message
} from "antd";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  clear = () => {
    document.querySelector(`#pcalert1`).innerHTML = ``;
    document.querySelector(`#pcalert2`).innerHTML = ``;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
      if (
        values.fullname &&
        values.email &&
        values.password &&
        values.confirm &&
        values.agreement
      )
        fetch("http://localhost:3001/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName: values.fullname,
            email: values.email,
            password: values.password
          })
        })
          .then(res => {
            return res.json();
          })
          .then(data => {
            if (data.problems) {
              this.clear();
              if (data.problems === "email") {
                message.error(data.message);
              }
              if (data.problems === "password") {
                message.error(data.message);
              }
            } else {
              window.location.href = "http://localhost:3000/login";
            }
          })
          .catch(error => {
            if (error) {
              console.log(error);
              window.alert(error.message);
            }
          });
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Full Name">
          {getFieldDecorator("fullname", {
            rules: [
              {
                required: true,
                message: "Please input your name"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <small id="pcalert1" className="form - text text - muted"></small>

        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <small id="pcalert2" className="form - text text - muted"></small>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator("agreement", {
            valuePropName: "checked",
            rules: [
              {
                required: true,
                message: "Please tick here"
              }
            ]
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const SignUpForm = Form.create({ name: "register" })(RegistrationForm);

export default SignUpForm;
