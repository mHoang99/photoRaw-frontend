import React from "react";
import {
  DatePicker,
  message,
  Layout,
  Icon,
  Menu,
  Button,
  Modal,
  Input,
  InputNumber,
  Card,
  Select,
  Form
} from "antd";

const { Option } = Select;
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

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

class Post extends React.Component {
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
    ModalText: "Content of the modal",
    visible: false,
    confirmLoading: false,
    genreArray: []
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
            })
            .catch(err => {
              if (err) {
                console.log(err);
                window.alert(err.message);
              }
            });
        } else if (data.data) {
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

  handleImageChange = event => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(imageFile);
      fileReader.onloadend = data => {
        this.setState({
          imgSrc: data.currentTarget.result,
          imgFile: imageFile
        });
      };
      console.log(imageFile, this.state.imgFile);
    }
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: "The modal will be closed after two seconds",
      confirmLoading: true
    });
    const content = document.querySelector("#message-text").value;
    if (!this.state.imgFile || !content || this.state.genreArray.length === 0) {
      this.setState({
        visible: true,
        confirmLoading: false,
        errorMessage: "Please select image and input content"
      });
      document.querySelector(
        ".err"
      ).innerHTML = `<div class="alert alert-danger">Please select image and input content</div>`;
    } else {
      const formData = new FormData();
      formData.append("image", this.state.imgFile);
      console.log(this.state.imgFile);
      fetch("http://localhost:3001/upload/image", {
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
          if (data2) {
            console.log(data2);
          }
          fetch("http://localhost:3001/posts/create", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              content: content,
              imageUrl: data2.data.imageUrl,
              price: document.querySelector(".price").value,
              categories: this.state.genreArray
            })
          })
            .then(res => {
              return res.json();
            })
            .then(data => {
              if (data.success) {
                console.log(data.data._id);
                let id = data.data._id;
                fetch(`http://localhost:3001/posts/get/${id}`, {
                  method: "GET",
                  credentials: "include"
                })
                  .then(res1 => {
                    return res1.json();
                  })
                  .then(data1 => {})
                  .catch(err => {
                    if (err) {
                      console.log(err);
                      window.alert(err.message);
                    }
                  });
              }
            })
            .catch(error => {
              if (error) {
                console.log(error);
                window.alert(error.message);
              }
            });
        })
        .catch(error2 => {
          if (error2) {
            console.log(error2);
            window.alert(error2.message);
          }
        });
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false
        });
      }, 2000);
    }
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };

  onChange = value => {
    console.log("changed", value);
  };

  onTick = event => {
    let checkedValue = event.target.checked;
    let tmp = this.state.genreArray;
    console.log(checkedValue, event.target.name);
    if (checkedValue) {
      tmp.push(event.target.name);
      this.setState({
        genreArray: tmp
      });
    } else {
      tmp.remove(event.target.name);
      this.setState({
        genreArray: tmp
      });
    }
    console.log(this.state.genreArray);
  };

  render() {
    const { visible, confirmLoading, ModalText } = this.state;

    return (
      <div>
        <Button
          type="normal"
          style={{ marginTop: "15px", marginRight: "30px" }}
          onClick={this.showModal}
        >
          New Post
        </Button>
        <Modal
          title="Let's share with the world..."
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <form>
            <div className="form-group">
              <label for="recipient-name" className="col-form-label">
                Author
              </label>
              <input
                type="text"
                className="form-control"
                disabled
                id="recipient-name"
                value={this.state.currentUser.fullName}
              />
            </div>

            <div class="form-group">
              <label for="exampleFormControlFile1">Photo</label>
              <input
                onChange={this.handleImageChange}
                type="file"
                className="form-control-file"
                id="exampleFormControlFile1"
              />
            </div>
            {this.state.imgSrc ? (
              <div>
                <img
                  src={this.state.imgSrc}
                  style={{
                    width: "100%"
                  }}
                />
              </div>
            ) : null}

            <div className="form-group">
              <label for="message-text" className="col-form-label">
                Your story
              </label>
              <textarea
                className="form-control"
                id="message-text"
                placeholder="Type here ..."
                rows="8"
                maxLength="500"
              />
            </div>


            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="text"
                className="form-control price"
                aria-label="Amount (to the nearest dollar)"
              />
              <div className="input-group-append">
                <span className="input-group-text">.00</span>
              </div>
            </div>

            <div className="form-group">
              <label for="message-text" className="col-form-label">
                Categories
              </label>
              <div class="dropdown show">
                <a
                  class="btn btn-secondary dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Dropdown link
                </a>

                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <ul>
                    <input
                      type="checkbox"
                      name="Landscape"
                      value="1"
                      onChange={this.onTick}
                    />
                    Landscape
                    <br />
                    <input
                      type="checkbox"
                      name="Portrait"
                      value="1"
                      onChange={this.onTick}
                    />
                    Portrait
                    <br />
                    <input
                      type="checkbox"
                      name="Animals/Wildlife"
                      value="1"
                      onChange={this.onTick}
                    />
                    Animals/Wildlife
                    <br />
                    <input
                      type="checkbox"
                      name="Sports"
                      value="1"
                      onChange={this.onTick}
                    />
                    Sports
                    <br />
                    <input
                      type="checkbox"
                      name="Food and Drink"
                      value="1"
                      onChange={this.onTick}
                    />
                    Food and Drink
                    <br />
                    <input
                      type="checkbox"
                      name="Architecture"
                      value="1"
                      onChange={this.onTick}
                    />
                    Architecture
                    <br />
                  </ul>
                </div>
              </div>
            </div>
          </form>
          <div className="err"></div>
        </Modal>
      </div>
    );
  }
}

export default Post;
