import React from "react";
import moment from "moment";

import {
  Button,
  Modal,
  Input,
  Upload,
  message,
  Icon,
  Form,
  Select,
  Meta,
  DatePicker,
  Row,
  Col
} from "antd";

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const { TextArea } = Input;
const { Option } = Select;

Array.prototype.remove = function() {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function onChange(date, dateString) {
  console.log(date, dateString);
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ProfileForm extends React.Component {
  state = {
    currentUser: {},
    imgSrc: "",
    imgFile: "",
    errorMessage: "",
    categories: "all",
    color: "all",
    pageNumber: 1,
    pageSize: 12,
    total: 0,
    data: [],
    confirmLoading: false,
    genreArray: [],
    loading: false
  };

  componentWillMount() {
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
              console.log("here1");
              console.log(data1.success);
              this.setState({
                currentUser: {
                  fullName: data1.data.fullName,
                  email: data1.data.email,
                  dob: data1.data.dob,
                  address: data1.data.address,
                  avaUrl: data1.data.avaUrl,
                  city: data1.data.city,
                  country: data1.data.country,
                  message: data1.data.message,
                  phoneNumber: data1.data.phoneNumber
                },
                imageUrl: data1.data.avaUrl
              });
            })
            .catch(err => {
              if (err) {
                console.log(err);
                window.alert(err.message);
              }
            });
        } else if (data.data) {
          console.log("here2");
          this.setState({
            currentUser: {
              fullName: data.data.fullName,
              email: data.data.email,
              dob: data.data.dob,
              address: data.data.address,
              avaUrl: data.data.avaUrl,
              city: data.data.city,
              country: data.data.country,
              message: data.data.message,
              phoneNumber: data.data.phoneNumber
            },
            imageUrl: data.data.avaUrl
          });
        }
      })
      .catch(error => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    console.log(file);
    this.setState({
      imageFile: file
    });
    return isJpgOrPng;
  };

  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };

  handleUpdate = event => {
    event.preventDefault();
    console.log("here");
    const { form } = this.props;
    console.log(form);
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);

      if (values.avatar) {
        console.log("submiting");
        const formData = new FormData();
        formData.append("image", values.avatar.file.originFileObj);
        console.log(this.state.imgFile);
        fetch("http://localhost:3001/upload/avatar", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          body: formData
        })
          .then(res2 => {
            return res2.json();
          })
          .then(data2 => {
            let avaUrl = data2
              ? data2.data.avaUrl
              : this.state.currentUser.avaUrl;

            let fullName = this.state.currentUser.fullName;
            let address = this.state.currentUser.address;
            let dob = this.state.currentUser.dob;
            let email = this.state.currentUser.email;
            let message = this.state.currentUser.message;
            let city = this.state.currentUser.city;
            let country = this.state.currentUser.country;
            let phoneNumber = this.state.currentUser.phoneNumber;
            console.log("submiting");
            if (values.fullName) {
              fullName = values.fullName;
            }
            if (values.birthday) {
              dob = values.birthday.format("DD-MM-YYYY");
            }

            if (values.address) {
              address = values.address;
            }
            if (values.city) {
              city = values.city;
            }
            if (values.country) {
              country = values.country;
            }
            if (values.message) {
              message = values.message;
              console.log(message);
            }
            if (values.phoneNumber) {
              phoneNumber = values.pageNumber;
            }
            console.log("submiting");
            this.setState({
              currentUser: {
                fullName: fullName,
                address: address,
                dob: dob,
                avaUrl: avaUrl,
                email: email,
                city: city,
                country: country,
                message: message,
                phoneNumber: phoneNumber
              }
            });
            setTimeout(() => {
              fetch("http://localhost:3001/users/update", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  fullName: fullName,
                  dob: dob,
                  address: address,
                  avaUrl: avaUrl,
                  email: email,
                  city: city,
                  country: country,
                  message: message,
                  phoneNumber: phoneNumber
                })
              })
                .then(res => {
                  return res.json();
                })
                .then(data => {
                  console.log(data);
                })
                .catch(error => {
                  if (error) {
                    console.log(error);
                    window.alert(error.message);
                  }
                });
              console.log("done2");
            }, 200);
          })
          .catch(error2 => {
            if (error2) {
              console.log(error2);
              window.alert(error2.message);
            }
          });
      } else {
        let avaUrl = this.state.currentUser.avaUrl;
        let fullName = this.state.currentUser.fullName;
        let address = this.state.currentUser.address;
        let dob = this.state.currentUser.dob;
        let email = this.state.currentUser.email;
        let message = this.state.currentUser.message;
        let city = this.state.currentUser.city;
        let country = this.state.currentUser.country;
        let phoneNumber = this.state.currentUser.phoneNumber;
        console.log("submiting");
        if (values.fullName) {
          fullName = values.fullName;
        }
        if (values.birthday) {
          dob = values.birthday.format("DD-MM-YYYY");
        }

        if (values.address) {
          address = values.address;
        }
        if (values.city) {
          city = values.city;
        }
        if (values.country) {
          country = values.country;
        }
        if (values.message) {
          message = values.message;
          console.log(message);
        }
        if (values.phoneNumber) {
          phoneNumber = values.pageNumber;
        }
        console.log("submiting");
        this.setState({
          currentUser: {
            fullName: fullName,
            address: address,
            dob: dob,
            avaUrl: avaUrl,
            email: email,
            city: city,
            country: country,
            message: message,
            phoneNumber: phoneNumber
          }
        });
        setTimeout(() => {
          fetch("http://localhost:3001/users/update", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fullName: fullName,
              dob: dob,
              address: address,
              avaUrl: avaUrl,
              email: email,
              city: city,
              country: country,
              message: message,
              phoneNumber: phoneNumber
            })
          })
            .then(res => {
              return res.json();
            })
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              if (error) {
                console.log(error);
                window.alert(error.message);
              }
            });
          console.log("done2");
        }, 200);
      }

      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  onChange = value => {
    console.log("changed", value);
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log(this.state.currentUser);
    return (
      <div>
        {this.state.currentUser.fullName ? (
          <Form layout="vertical" onSubmit={this.handleUpdate}>
            <Row
              style={{
                margin:"30px",
                marginTop:"50px",
                padding: "20px",
                paddingRight: "80px",
                backgroundColor: "white"
              }}
            >
              <Col lg={4} span={8}>
                <Form.Item label="Avatar">
                  {getFieldDecorator("avatar", {})(
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  )}
                </Form.Item>
              </Col>

              <Col lg={20} span={16}>
                <Form.Item label="Message">
                  {getFieldDecorator("message", {
                    initialValue: this.state.currentUser.message,
                    rules: [
                      {
                        message: "Please tell us your story"
                      }
                    ]
                  })(
                    <TextArea
                      onChange={this.onChange}
                      placeholder="Your story"
                      autosize={{ minRows: 5 }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}></Col>
              <Row style={{ width: "100%" }}>
                <Col xl={10} span={8} style={{ paddingRight: "20px" }}>
                  <Form.Item label="Name">
                    {getFieldDecorator("fullname", {
                      initialValue: this.state.currentUser.fullName,
                      rules: [
                        {
                          required: "true",
                          message: "Please input the title of collection!"
                        }
                      ]
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col xl={10} span={8} style={{ paddingRight: "20px" }}>
                  <Form.Item label="Email">
                    {getFieldDecorator("email", {
                      initialValue: this.state.currentUser.email
                    })(<Input disabled />)}
                  </Form.Item>
                </Col>

                <Col xl={4} span={8}>
                  <Form.Item label="Birthday:">
                    {getFieldDecorator("birthday", {
                      initialValue: moment(
                        this.state.currentUser.dob,
                        "DD-MM-YYYY"
                      )
                    })(<DatePicker onChange={onChange} format="DD-MM-YYYY" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item label="Address:">
                  {getFieldDecorator("address", {
                    initialValue: this.state.currentUser.address,
                    rules: [
                      {
                        message: "Please input the title of collection!"
                      }
                    ]
                  })(
                    <TextArea
                      placeholder="Your story"
                      autosize={{ minRows: 2 }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12} style={{ paddingRight: "20px" }}>
                <Form.Item label="City">
                  {getFieldDecorator("city", {
                    initialValue: this.state.currentUser.city,
                    rules: [
                      {
                        message: "Please input the title of collection!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Country:">
                  {getFieldDecorator("country", {
                    initialValue: this.state.currentUser.country,
                    rules: [
                      {
                        message: "Please input the title of collection!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Phone Number">
                  {getFieldDecorator("phone", {
                    initialValue: this.state.currentUser.phoneNumber,
                    rules: [
                      {
                        required: true,
                        message: "Please input your phone number!"
                      }
                    ]
                  })(
                    <Input
                      addonBefore={getFieldDecorator("prefix", {
                        initialValue: "84"
                      })(
                        <Select style={{ width: 70 }}>
                          <Option value="84">+84</Option>
                          <Option value="86">+86</Option>
                          <Option value="87">+87</Option>
                        </Select>
                      )}
                      style={{ width: "100%" }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Apply
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : null}
      </div>
    );
  }
}

const Profile = Form.create({})(ProfileForm);

export { Profile };

export default Profile;
