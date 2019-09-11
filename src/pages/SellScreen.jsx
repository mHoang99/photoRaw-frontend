import React from "react";
import { List, Avatar, Icon, Statistic, Row, Col, Progress, Card } from "antd";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class SellScreen extends React.Component {
  state = {
    listData: []
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
          //this.pageRender();
        }
      })
      .catch(error => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });

    fetch("http://localhost:3001/users/sold-information", {
      credentials: "include",
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data) {
          console.log(data);
          let total = 0;
          data.soldData.map((post, index) => {
            total += post.sold * post.price;
          });
          this.setState({ listData: data.soldData, total: total });
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
    console.log(this.state);
    return (
      <Row style={{ margin: "20px", backgroundColor: "white" }}>
        <Row gutter={16}>
          <Col span={24}>
            <Card style={{ padding: "30px" }}>
              <Statistic
                style={{ fontSize:"30px"}}
                title="You have earned:"
                value={this.state.total}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<Icon type="dollar" />}
                suffix="USD"
              />
            </Card>
          </Col>
        </Row>
        <Col span={24} style={{ padding: " 30px" }}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 6
            }}
            dataSource={this.state.listData}
            footer={<div></div>}
            renderItem={item => (
              <Col span={24} style={{ padding: "30px" }}>
                <List.Item
                  key={item.title}
                  actions={[
                    <IconText
                      type="shopping-cart"
                      text={item.sold}
                      key="list-vertical-star-o"
                    />,
                    <IconText
                      type="dollar"
                      text={item.price}
                      key="list-vertical-like-o"
                    />
                  ]}
                  extra={<img width={272} alt="logo" src={item.imageUrl} />}
                >
                  <List.Item.Meta
                    description={item.title}
                    title={
                      <Statistic
                        title="Total earned"
                        value={item.sold * item.price}
                        prefix={"$"}
                      />
                    }
                  />
                  {item.content}
                </List.Item>
              </Col>
            )}
          />
        </Col>
      </Row>
    );
  }
}

export default SellScreen;
