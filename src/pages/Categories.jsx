import React from "react";
import { Pagination, Card, Icon, Avatar, Modal, Button } from "antd";
const { Meta } = Card;

class Categories extends React.Component {
  state = {
    currentUser: {},
    imgSrc: "",
    imgFile: "",
    errorMessage: "",
    categories: window.location.href
      .split("/")
      [window.location.href.split("/").length - 1].split("&")[0],
    color: window.location.href
      .split("/")
      [window.location.href.split("/").length - 1].split("&")[1],
    pageNumber: 1,
    pageSize: 12,
    total: 0,
    data: []
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
          this.props.history.push("login");
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
          console.log("Logged in");
          //this.pageRender();
        }
      })
      .catch(error => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });
    this.pageRender();
  }

  handlePaginationClick = event => {
    console.log(event.target.innerText);
    const gotoPage = event.target.innerText;
    this.setState({
      pageNumber: Number(event.target.innerText)
    });

    fetch(
      `http://localhost:3001/posts?pageNumber=${event.target.innerText}
    &pageSize=${this.state.pageSize}`,
      {
        credentials: "include",
        method: "GET"
      }
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState({ total: data.total });
        this.pageRender();
        for (let i = 0; i < data.data.length; i++) {
          document
            .querySelector(`#exampleModalLong${data.data[i]._id}`)
            .addEventListener("click", () => {
              fetch(`http://localhost:3001/posts/updateViews`, {
                credentials: "include",
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  id: data.data[i]._id
                })
              })
                .then(res => {
                  return res.json();
                })
                .then(data => {
                  console.log("success ", data.success);
                })
                .catch(err => {
                  if (err) {
                    console.log(err);
                    window.alert(err.message);
                  }
                });
            });
        }
      })
      .catch(err => {
        if (err) {
          console.log(err);
          window.alert(err.message);
        }
      });
  };

  handleNextPage = event => {
    if (
      Math.ceil(this.state.total / this.state.pageSize) ===
      this.state.pageNumber
    ) {
      event.preventDefault();
    } else {
      let tmp = this.state.pageNumber + 1;
      this.setState({
        pageNumber: tmp
      });

      fetch(
        `http://localhost:3001/posts?pageNumber=${tmp}
      &pageSize=${this.state.pageSize}`,
        {
          credentials: "include",
          method: "GET"
        }
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data);
          this.setState({ total: data.total });
          this.pageRender();
          for (let i = 0; i < data.data.length; i++) {
            document
              .querySelector(`#exampleModalLong${data.data[i]._id}`)
              .addEventListener("click", () => {
                fetch(`http://localhost:3001/posts/updateViews`, {
                  credentials: "include",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    id: data.data[i]._id
                  })
                })
                  .then(res => {
                    return res.json();
                  })
                  .then(data => {
                    console.log("success ", data.success);
                  })
                  .catch(err => {
                    if (err) {
                      console.log(err);
                      window.alert(err.message);
                    }
                  });
              });
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
            window.alert(err.message);
          }
        });
    }
  };

  handlePreviousPage = event => {
    if (1 === this.state.pageNumber) {
      event.preventDefault();
    } else {
      let tmp = this.state.pageNumber - 1;
      this.setState({
        pageNumber: tmp
      });

      fetch(
        `http://localhost:3001/posts?pageNumber=${tmp}
      &pageSize=${this.state.pageSize}`,
        {
          credentials: "include",
          method: "GET"
        }
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data);
          this.setState({ total: data.total });
          this.pageRender();
          for (let i = 0; i < data.data.length; i++) {
            document
              .querySelector(`#exampleModalLong${data.data[i]._id}`)
              .addEventListener("click", () => {
                fetch(`http://localhost:3001/posts/updateViews`, {
                  credentials: "include",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    id: data.data[i]._id
                  })
                })
                  .then(res => {
                    return res.json();
                  })
                  .then(data => {
                    console.log("success ", data.success);
                  })
                  .catch(err => {
                    if (err) {
                      console.log(err);
                      window.alert(err.message);
                    }
                  });
              });
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
            window.alert(err.message);
          }
        });
    }
  };

  pageRender = () => {
    console.log(this.state.categories, this.state.color);
    fetch(
      `http://localhost:3001/posts?categories=${this.state.categories}&color=${this.state.color}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,
      {
        method: "GET",
        credentials: "include"
      }
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState({ total: data.total, data: data.data });
      })
      .catch(err => {
        if (err) {
          console.log(err);
          window.alert(err.message);
        }
      });
  };

  render() {
    return (
      <div className="content">
        <div className="row" style={{}}>
          <div className="col-lg-3 col-md-6 col-12">
            {this.state.data.map((post, index) => {
              if (index % 4 === 0) {
                return (
                  <Card
                    style={{ margin: "auto", marginTop: "20px", padding: 0 }}
                    //style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Icon type="setting" key="setting" />,
                      <Icon type="edit" key="edit" />,
                      <Icon type="ellipsis" key="ellipsis" />
                    ]}
                  >
                    <Meta
                      style={{ width: "18rem", height: "auto" }}
                      avatar={
                        <Avatar src={this.state.data[index].author.avaUrl} />
                      }
                      title={`${this.state.data[index].author.fullName}`}
                      description={`${this.state.data[index].content}`}
                    />
                  </Card>
                );
              }
            })}
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            {this.state.data.map((post, index) => {
              if (index % 4 === 2) {
                return (
                  <Card
                    style={{ margin: "auto", marginTop: "20px", padding: 0 }}
                    //style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Icon type="setting" key="setting" />,
                      <Icon type="edit" key="edit" />,
                      <Icon type="ellipsis" key="ellipsis" />
                    ]}
                  >
                    <Meta
                      style={{ width: "18rem", height: "auto" }}
                      avatar={
                        <Avatar src={this.state.data[index].author.avaUrl} />
                      }
                      title={`${this.state.data[index].author.fullName}`}
                      description={`${this.state.data[index].content}`}
                    />
                  </Card>
                );
              }
            })}
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            {this.state.data.map((post, index) => {
              if (index % 4 === 1) {
                return (
                  <Card
                    style={{ margin: "auto", marginTop: "20px", padding: 0 }}
                    //style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Icon type="setting" key="setting" />,
                      <Icon type="edit" key="edit" />,
                      <Icon type="ellipsis" key="ellipsis" />
                    ]}
                  >
                    <Meta
                      style={{ width: "18rem", height: "auto" }}
                      avatar={
                        <Avatar src={this.state.data[index].author.avaUrl} />
                      }
                      title={`${this.state.data[index].author.fullName}`}
                      description={`${this.state.data[index].content}`}
                    />
                  </Card>
                );
              }
            })}
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            {this.state.data.map((post, index) => {
              if (index % 4 === 3) {
                return (
                  <Card
                    style={{ margin: "auto", marginTop: "20px", padding: 0 }}
                    cover={
                      <img
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Icon type="setting" key="setting" />,
                      <Icon type="edit" key="edit" />,
                      <Icon type="ellipsis" key="ellipsis" />
                    ]}
                  >
                    <Meta
                      style={{ width: "18rem", height: "auto" }}
                      avatar={
                        <Avatar src={this.state.data[index].author.avaUrl} />
                      }
                      title={`${this.state.data[index].author.fullName}`}
                      description={`${this.state.data[index].content}`}
                    />
                  </Card>
                );
              }
            })}
          </div>
        </div>

        <Pagination
          className="row"
          total={Math.ceil(this.state.total / this.state.pageSize) * 10}
          onClick={this.handlePaginationClick}
          itemRender={(current, type, originalElement) => {
            if (type === "prev") {
              return <a onClick={this.handlePreviousPage}>Previous</a>;
            }
            if (type === "next") {
              return <a onClick={this.handleNextPage}>Next</a>;
            }
            return originalElement;
          }}
        />
      </div>
    );
  }
}

export default Categories;
