import React from "react";
import {
  Pagination,
  Card,
  Icon,
  Avatar,
  Modal,
  Button,
  Row,
  Col,
  Statistic
} from "antd";
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
    pageSize: 32,
    total: 0,
    data: []
  };
  handleOpenPost = (event, index) => {
    event.preventDefault();
    console.log(index);
    let id = this.state.data[index]._id;
    console.log(id);
    window.location.href = `http://localhost:3000/posts/${id}`;
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
          this.setState({
            currentUser: {
              email: data.data.email,
              fullName: data.data.fullName
            }
          });
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
      `http://localhost:3001/posts?categories=${this.state.categories}&color=${this.state.color}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,
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
        `http://localhost:3001/posts?categories=${this.state.categories}&color=${this.state.color}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,
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
        `http://localhost:3001/posts?categories=${this.state.categories}&color=${this.state.color}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,

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
        <Row type="flex" justify="space-around">
          <Col xl={5} md={10} span={22}>
            {this.state.data.map((post, index) => {
              if (index % 4 === 0) {
                let tmp = "/posts/" + post._id;
                console.log(tmp);
                return (
                  <Card
                    hoverable
                    id={post._id}
                    style={{ margin: "0", marginTop: "20px", padding: 0 }}
                    cover={
                      <img
                        onClick={event => {
                          this.handleOpenPost(event, index);
                        }}
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.views}
                        prefix={<Icon type="eye" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.comment}
                        prefix={<Icon type="message" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.sold}
                        prefix={<Icon type="shopping-cart" />}
                      />
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
          </Col>
          <Col xl={5} md={10} span={22}>
            {this.state.data.map((post, index) => {
              if (index % 4 === 1) {
                let tmp = "/posts/" + post._id;
                console.log(tmp);
                return (
                  <Card
                    hoverable
                    id={post._id}
                    style={{ margin: "0", marginTop: "20px", padding: 0 }}
                    cover={
                      <img
                        onClick={event => {
                          this.handleOpenPost(event, index);
                        }}
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.views}
                        prefix={<Icon type="eye" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.comment}
                        prefix={<Icon type="message" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.sold}
                        prefix={<Icon type="shopping-cart" />}
                      />
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
          </Col>
          <Col xl={5} md={10} span={22}>
            {this.state.data.map((post, index) => {
              if (index % 4 === 2) {
                let tmp = "/posts/" + post._id;
                console.log(tmp);
                return (
                  <Card
                    hoverable
                    id={post._id}
                    style={{ margin: "0", marginTop: "20px", padding: 0 }}
                    cover={
                      <img
                        onClick={event => {
                          this.handleOpenPost(event, index);
                        }}
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.views}
                        prefix={<Icon type="eye" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.comment}
                        prefix={<Icon type="message" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.sold}
                        prefix={<Icon type="shopping-cart" />}
                      />
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
          </Col>
          <Col xl={5} md={10} span={22}>
            {this.state.data.map((post, index) => {
              if (index % 4 === 3) {
                let tmp = "/posts/" + post._id;
                console.log(tmp);
                return (
                  <Card
                    hoverable
                    id={post._id}
                    style={{ margin: "0", marginTop: "20px", padding: 0 }}
                    cover={
                      <img
                        onClick={event => {
                          this.handleOpenPost(event, index);
                        }}
                        alt="example"
                        src={this.state.data[index].imageUrl}
                      />
                    }
                    actions={[
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.views}
                        prefix={<Icon type="eye" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.comment}
                        prefix={<Icon type="message" />}
                      />,
                      <Statistic
                        valueStyle={{ fontSize: "16px" }}
                        value={post.sold}
                        prefix={<Icon type="shopping-cart" />}
                      />
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
          </Col>
        </Row>

        {this.state.data.length != 0 ? (
          <Row>
            <Pagination
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
          </Row>
        ) : (
          <Row>
            <p>NO DATA</p>
          </Row>
        )}
      </div>
    );
  }
}

export default Categories;
