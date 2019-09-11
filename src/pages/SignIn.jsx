import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Checkbox , message} from "antd";

import React from "react";

class WrappedNormalLoginForm extends React.Component {
  state = {
    currentUser: {
      email: "",
      fullName: ""
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
      console.log(values.remember);
      fetch("http://localhost:3001/users/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: values.username,
          password: values.password,
          keepLogin: values.remember
        })
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data.problems === "1" || data.problems === "2") {
            document.querySelector(`#alert`).innerHTML = "";
            document.querySelector(`#alert`).style.color = "red";
            document
              .querySelector(`#alert`)
              .insertAdjacentHTML("beforeend", `${data.message}`);
          } else {
            if (values.remember) {
              window.localStorage.setItem("email", data.data.email);
              window.localStorage.setItem("fullName", data.data.fullName);
            }
            message.success("Loged in successfully. Redirecting to PixieRaw",2)
            window.location.href = "http://localhost:3000";
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

  componentWillMount() {
    const email = window.localStorage.getItem("email");
    const fullName = window.localStorage.getItem("fullName");
    if (email && fullName) {
      this.setState({
        currentUser: {
          email: email,
          fullName: fullName
        }
      });
    }
  }

  componentDidMount() {
    fetch("http://localhost:3001/users/current", {
      credentials: "include",
      method: "GET"
    })
      .then(res1 => {
        return res1.json();
      })
      .then(data1 => {
        console.log(data1.data);
        if (data1.data) {
          window.location.href = "http://localhost:3000/";
        }
      })
      .catch(error => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-screen">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="/sign-up">register now!</a>
            <small
              id="alert"
              className="form - text text - muted row"
              style={{ marginTop: "10px", marginLeft: "5px" }}
            ></small>
          </Form.Item>
        </Form>
        {/* <form
          onSubmit={this.submitToServer}
          id="submit-form"
          onChange={this.clear}
        >
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              required
              id="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              aria-describedby="passwordHelp"
              placeholder="Password"
              required
              id="password"
            />
          </div>
          <div className="form-check">
            <input id="keep" type="checkbox" className="form-check-input" />
            <label className="form-check-label">Keep me login</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "20px" }}
          >
            Login
          </button>
          <Link
            to="/sign-up"
            className="FormField__Link"
            style={{ marginLeft: "20px" }}
          >
            Create an account
          </Link>
          <small
            id="alert"
            className="form - text text - muted row"
            style={{ marginTop: "10px", marginLeft: "5px" }}
          ></small>
        </form> */}
      </div>
    );
  }
}

const SigninForm = Form.create({ name: "normal_login" })(
  WrappedNormalLoginForm
);

export default SigninForm;
