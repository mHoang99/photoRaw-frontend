import React from "react";
import {
  Pagination,
  Card,
  Icon,
  Avatar,
  Modal,
  Button,
  Col,
  Row,
  Statistic,
  List,
  Drawer,
  Typography,
  Divider
} from "antd";
const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

const pStyle = {
  fontSize: 16,
  color: "rgba(0,0,0,0.85)",
  lineHeight: "24px",
  display: "block",
  marginBottom: 16
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)"
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)"
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

class AuthorPost extends React.Component {
  state = {
    currentUser: {},
    imgSrc: "",
    imgFile: "",
    errorMessage: "",
    id: window.location.href
      .split("/")
      [window.location.href.split("/").length - 1].split("&")[0],
    pageNumber: 1,
    pageSize: 32,
    total: 0,
    data: [],
    author: {},
    visible: false
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
      `http://localhost:3001/posts/id?id=${this.state.id}&pageNumber=${event.target.innerText}
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
        `http://localhost:3001/posts/id?id=${this.state.id}&pageNumber=${tmp}
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
        `http://localhost:3001/posts/id?id=${this.state.id}&pageNumber=${tmp}
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
        })
        .catch(err => {
          if (err) {
            console.log(err);
            window.alert(err.message);
          }
        });
    }
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  pageRender = () => {
    console.log(this.state.categories, this.state.color);
    fetch(
      `http://localhost:3001/posts/id?id=${this.state.id}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`,
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
        this.setState({
          total: data.total,
          data: data.data,
          author: data.data[0].author
        });
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
        {this.state.author ? (
          <Row style={{padding: "30px"}}>
            <Col style={{width: "400px"}}>
              <List
                dataSource={[
                  {
                    name: this.state.author.fullName
                  }
                ]}
                bordered
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <a onClick={this.showDrawer} key={`a-${item.id}`}>
                        View Profile
                      </a>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={this.state.author.avaUrl} />}
                      title={item.name}
                      description="Photograper"
                    />
                  </List.Item>
                )}
              />
              <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
              >
                <p style={{ ...pStyle, marginBottom: 24 }}>User Profile</p>
                <p style={pStyle}>Personal</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="Full Name"
                      content={this.state.author.fullName}
                    />{" "}
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Account"
                      content={this.state.author.email}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="City"
                      content={this.state.author.city}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Country"
                      content={this.state.author.country}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Birthday"
                      content={this.state.author.dateOfBirth}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Message"
                      content={this.state.author.message}
                    />
                  </Col>
                </Row>
                <Divider />

                <p style={pStyle}>Contacts</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="Email"
                      content={this.state.author.email}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Phone Number"
                      content={this.state.author.phoneNumber}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Address"
                      content={this.state.author.address}
                    />
                  </Col>
                </Row>
              </Drawer>
            </Col>
          </Row>
        ) : null}
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

export default AuthorPost;
