import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Pagination,
  Card,
  Icon,
  Modal,
  Button,
  Descriptions,
  Drawer,
  List,
  Avatar,
  Divider,
  Col,
  Row,
  Comment,
  Tooltip,
  Input,
  Form,
  Typography,
  Statistic,
  Carousel
} from "antd";
const { Meta } = Card;
const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const pStyle = {
  fontSize: 16,
  color: "rgba(0,0,0,0.85)",
  lineHeight: "24px",
  display: "block",
  marginBottom: 16
};

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={props => <Comment style={{ width: "100%" }} {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

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

class PostScreen extends React.Component {
  state = {
    currentUser: {},
    id: window.location.href.split("/")[
      window.location.href.split("/").length - 1
    ],
    total: 0,
    author: {},
    imgSrc: "",
    imgFile: "",
    errorMessage: "",
    data: {},
    visible: false,
    comments: [],
    submitting: false,
    value: "",
    data1: []
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

    fetch(`http://localhost:3001/posts/updateViews`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.state.id
      })
    })
      .then(res1 => {
        return res1.json();
      })
      .then(data1 => {
        console.log("success ", data1.success);
      })
      .catch(err1 => {
        if (err1) {
          console.log(err1);
          window.alert(err1.message);
        }
      });

    fetch("http://localhost:3001/users/currentFind", {
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
              this.setState({
                currentUser: {
                  ...data1.data
                }
              });
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
              ...data.data
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

  handleSubmitPay = event => {
    event.preventDefault();

    fetch(`http://localhost:3001/posts/pay`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        price: this.state.data.price,
        content: this.state.data.content,
        id: this.state.data._id
        // createdAt:  this.state.data.createdAt,
      })
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        window.location.href = `${data.data}`;
      })
      .catch(err => {
        if (err) {
          console.log(err);
          window.alert(err.message);
        }
      });
  };

  componentDidMount() {
    fetch(`http://localhost:3001/posts/comment/${this.state.id}`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data.data);
        data.data.map((cmt, index) => {
          this.setState({
            comments: [
              {
                author: cmt.author.fullName,
                avatar: cmt.author.avaUrl,
                content: <p style={{ width: "100%" }}>{cmt.content}</p>,
                datetime: moment(cmt.createdAt).fromNow()
              },
              ...this.state.comments
            ]
          });
        });
      })
      .catch(err => {
        if (err) {
          console.log(err);
          window.alert(err.message);
        }
      });
  }

  pageRender = () => {
    fetch(`http://localhost:3001/posts/get/${this.state.id}`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data.data);
        this.setState({ data: data.data });
        fetch(`http://localhost:3001/users/click-update`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recommendColor: data.data.mainColor,
            recommendCategory: data.data.categories
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
      })
      .catch(err => {
        if (err) {
          console.log(err);
          window.alert(err.message);
        }
      });
  };

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true
    });

    fetch(`http://localhost:3001/posts/comment/${this.state.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: this.state.value
      })
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        if (err) {
          console.log(err);
          window.alert(err.message);
        }
      });

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: "",
        comments: [
          {
            author: this.state.currentUser.fullName,
            avatar: this.state.currentUser.avaUrl,
            content: <p style={{ width: "100%" }}>{this.state.value}</p>,
            datetime: moment().fromNow()
          },
          ...this.state.comments
        ]
      });
    }, 1000);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  checkOwned = () => {
    let id = this.state.id;
    if (
      this.state.currentUser.bought.find(function(item) {
        return item === id;
      }) === id
    ) {
      return true;
    } else return false;
  };

  render() {
    const { comments, submitting, value } = this.state;
    const id = this.state.id;
    console.log(this.state.data.author);
    {
      if (this.state.data1.length === 0 && this.state.data.author) {
        console.log("here");
        fetch(
          `http://localhost:3001/posts/id?id=${this.state.data.author._id}&pageNumber=1
      &pageSize=4`,
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
            this.setState({ data1: data.data });
          })
          .catch(err => {
            if (err) {
              console.log(err);
              window.alert(err.message);
            }
          });
      }
    }

    return (
      <h3 className="container">
        {this.state.data.author ? (
          <Row type="flex" justify="space-around" style={{ marginTop: "30px" }}>
            <Col xl={10} span={24} style={{ padding: "30px" }}>
              <img
                style={{
                  width: "100%"
                }}
                src={this.state.data.imageUrl}
              />
              <Row gutter={16} style={{ padding: "30px" }}>
                <Col span={12}>
                  <Statistic
                    title="Price (USD)"
                    value={"$" + this.state.data.price}
                  />
                </Col>
                <Col span={12}>
                  {this.state.currentUser.email !=
                    this.state.data.author.email && !this.checkOwned() ? (
                    <form onSubmit={this.handleSubmitPay}>
                      <input
                        style={{ backgroundColor: "blue" }}
                        type="submit"
                        value="Paypal"
                      />
                    </form>
                  ) : this.checkOwned() ? (
                    <h2>Owned</h2>
                  ) : null}

                  {this.state.currentUser.email ===
                  this.state.data.author.email ? (
                    <Statistic
                      valueStyle={{ color: "#3f8600" }}
                      precision={2}
                      title="Income"
                      value={this.state.data.price * this.state.data.sold}
                      prefix={<Icon type="dollar" />}
                    />
                  ) : null}
                </Col>
              </Row>
            </Col>
            <Col
              xl={10}
              span={24}
              style={{ paddingTop: "30px", padding: "30px" }}
            >
              <Row type="flex" justify="space-around">
                <Typography
                  style={{
                    backgroundColor: "#cad6eb",
                    padding: "30px",
                    width: "100%"
                  }}
                >
                  <Title style={{ width: "100%" }}>
                    {this.state.data.title}
                  </Title>
                  <Divider />
                  <Paragraph
                    style={{ minHeight: "100px", width: "100%" }}
                    ellipsis={{ rows: 3, expandable: true }}
                  >
                    {this.state.data.content}
                  </Paragraph>
                </Typography>
              </Row>
              <Row
                Row
                type="flex"
                justify="space-around"
                style={{ paddingTop: "30px" }}
              >
                <Col span={24}>
                  <List
                    dataSource={[
                      {
                        name: this.state.data.author.fullName
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
                          avatar={
                            <Avatar src={this.state.data.author.avaUrl} />
                          }
                          title={
                            <a
                              href={`http://localhost:3000/id/${this.state.data.author._id}`}
                            >
                              {item.name}
                            </a>
                          }
                          description="Photograper"
                        />
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Col>
            <Col xl={4} span={0}></Col>

            <Col
              xl={20}
              span={24}
              style={{ paddingLeft: "30px", paddingRight: "30px" }}
            >
              {this.state.data1.length != 0 ? (
                <Carousel
                  autoplay
                  style={{
                    width: "100%",
                    height: "400px",
                    overflow: "hidden",
                    border: "2px solid #ddd",
                    borderRadius: "4px"
                    // padding: "5px"
                  }}
                >
                  {this.state.data1.map((post, index) => {
                    return (
                      <div>
                        <img
                          src={post.imageUrl}
                          style={{
                            // position: "absolute",
                            width: "100%",
                            height: "auto",
                            transform: "translate(0%, -25%)"
                          }}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              ) : null}
            </Col>
            <Col xl={4} span={0}></Col>

            <Col
              xl={20}
              span={24}
              style={{ paddingLeft: "30px", paddingRight: "30px" }}
            >
              <Title>Comments</Title>
              <Divider />
            </Col>
            <Col xl={4} span={0}></Col>
            <Col xl={20} span={24} style={{ padding: "30px" }}>
              {comments.length > 0 && <CommentList comments={comments} />}
              <Comment
                avatar={
                  <Avatar
                    src={this.state.currentUser.avaUrl}
                    alt={this.state.currentUser.fullName}
                  />
                }
                content={
                  <Editor
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    submitting={submitting}
                    value={value}
                  />
                }
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
                      content={this.state.data.author.fullName}
                    />{" "}
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Account"
                      content={this.state.data.author.email}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="City"
                      content={this.state.data.author.city}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Country"
                      content={this.state.data.author.country}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Birthday"
                      content={this.state.data.author.dateOfBirth}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Message"
                      content={this.state.data.author.message}
                    />
                  </Col>
                </Row>
                <Divider />

                <p style={pStyle}>Contacts</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="Email"
                      content={this.state.data.author.email}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Phone Number"
                      content={this.state.data.author.phoneNumber}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Address"
                      content={this.state.data.author.address}
                    />
                  </Col>
                </Row>
              </Drawer>
            </Col>
            <Col xl={4} span={0}></Col>
          </Row>
        ) : null}
      </h3>
    );
  }
}

export default PostScreen;
