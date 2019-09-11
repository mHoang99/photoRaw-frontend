import React from "react";
import { Result, Button } from "antd";

class Success extends React.Component {
  state = {
    paymentId: window.location.href
      .split("?")
      [window.location.href.split("?").length - 1].split("&")[0]
      .split("=")[1],
    token: window.location.href
      .split("?")
      [window.location.href.split("?").length - 1].split("&")[1]
      .split("=")[1],
    payerId: window.location.href
      .split("?")
      [window.location.href.split("?").length - 1].split("&")[2]
      .split("=")[1],
    postId: window.location.href.split("/")[
      window.location.href.split("/").length - 2
    ]
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

    fetch("http://localhost:3001/users/current", {
      credentials: "include",
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!window.localStorage.getItem("email") && !data.data) {
          window.location.href = "http://localhost:3000/login";
        } else if (window.localStorage.getItem("email") && !data.data) {
          fetch("http://localhost:3001/users/resession", {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: window.localStorage.getItem("email"),
              fullName: window.localStorage.getItem("fullName")
            })
          })
            .then(res1 => {
              return res1.json();
            })
            .then(data1 => {
              console.log("Keep login");
              console.log(data1.success);
              //this.pageRender();
            })
            .catch(err => {
              if (err) {
                console.log(err);
                window.alert(err.message);
              }
            });
        } else if (data.data) {
          this.setState({
            currentUser: {
              email: data.data.email,
              fullName: data.data.fullName
            }
          });
          console.log("Logged in");
        }
      })
      .catch(error => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });
  }

  componentDidMount() {
    fetch(`http://localhost:3001/users/updateBought`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.currentUser.email,
        id: this.state.postId
      })
    })
      .then(res1 => {
        return res1.json();
      })
      .then(data1 => {
        console.log("success ", data1.success);
        if (data1.updated) {
          fetch(`http://localhost:3001/posts/updateSold`, {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: this.state.postId
            })
          })
            .then(res2 => {
              return res2.json();
            })
            .then(data2 => {
              console.log("success ", data2.success);
            })
            .catch(err2 => {
              if (err2) {
                console.log(err2);
                window.alert(err2.message);
              }
            });
        }
      })
      .catch(err1 => {
        if (err1) {
          console.log(err1);
          window.alert(err1.message);
        }
      });
  }

  render() {
    return (
      <Result
        style={{ marginTop: "50px" }}
        status="success"
        title="Successfully Purchased"
        subTitle="Order number:  . Please check your bought items"
        extra={[
          <Button type="primary" key="console">
            <a href="http://localhost:3000">Go Home</a>
          </Button>
        ]}
      />
    );
  }
}

export default Success;
