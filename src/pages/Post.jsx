import React from "react";
import {
  Button,
  Modal,
  Input,
  Upload,
  message,
  Icon,
  Form,
  Select,
  Meta
} from "antd";

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

const children = [];
{
  children.push(<Option key="Landscape">Landscape</Option>);
  children.push(<Option key="Portrait">Portrait</Option>);
  children.push(<Option key="Animals and Wildlife">Animals/Wildlife</Option>);
  children.push(<Option key="Sports">Sports</Option>);
  children.push(<Option key="Food and Drink">Food and Drink</Option>);
  children.push(<Option key="Architecture">Architecture</Option>);
}

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

var file = [];
var check = true;

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class Collection extends React.Component {
    state = {
      currentUser: {},
      imgSrc: "",
      imgFile: "",
      errorMessage: "",
      categories: [],
      data: [],
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      genreArray: [],
      loading: false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      check: true
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

    beforeUpload = file => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/JPEG/PNG file!");
        check = false;
      } else {
        check =true;
        console.log(file);
        this.setState({
          imageFile: file
        });
      }
      return isJpgOrPng;
    };

    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true
      });
    };

    // handleChange = info => {
    //   if (info.file.status === "uploading") {
    //     this.setState({ loading: true });
    //     return;
    //   }
    //   if (info.file.status === "done") {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, imageUrl =>
    //       this.setState({
    //         imageUrl,
    //         loading: false
    //       })
    //     );
    //   }
    // };

    handleChangeCategories = value => {
      this.setState({
        categories: value
      });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handleChange = ({ fileList }) => {
      if (check) {
        file = fileList;
        this.setState({ fileList });
      } else {
        file = [];
        this.setState({ fileList: []});
      }
    };

    render() {
      const { previewVisible, previewImage, fileList } = this.state;
      console.log(this.state.categories);
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { imageUrl } = this.state;
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      console.log(fileList);
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Photo">
              {getFieldDecorator("photo", {
                rules: [
                  {
                    required: true,
                    message: "Please choose a photo"
                  }
                ]
              })(
                <div>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    fileList={fileList}
                    //showUploadList={false}
                    onPreview={this.handlePreview}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                    {/* {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )} */}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
              )}
            </Form.Item>
            <Form.Item label="Title">
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "Please input the title of collection!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description", {
                rules: [
                  {
                    required: true,
                    message: "Please tell us your story"
                  }
                ]
              })(
                <TextArea
                  onChange={this.onChange}
                  placeholder="Your story"
                  autosize={{ minRows: 3 }}
                />
              )}
            </Form.Item>

            <Form.Item label="Price">
              {getFieldDecorator("price", {
                rules: [
                  {
                    required: true,
                    message: "Please set a price"
                  }
                ]
              })(<Input type="number" prefix="$" suffix="USD" />)}
            </Form.Item>
            <Form.Item label="Categories">
              {getFieldDecorator("categories", {
                rules: [
                  {
                    required: true,
                    message: "Please pick your photo's categories"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={this.handleChangeCategories}
                >
                  {children}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class Post extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
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
    genreArray: [],
    loading: false
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

  handleCreate = () => {
    const { form } = this.formRef.props;
    this.setState({
      ModalText: "The modal will be closed after two seconds",
      confirmLoading: true
    });
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      const formData = new FormData();
      formData.append("image", file[0].originFileObj);
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
              title: values.title,
              content: values.description,
              imageUrl: data2.data.imageUrl,
              price: values.price,
              categories: values.categories
            })
          })
            .then(res => {
              return res.json();
            })
            .then(data => {
              if (data.success) {
                console.log(data.data._id);
                let id = data.data._id;
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

      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
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
          type="dashed"
          onClick={this.showModal}
          style={{ marginTop: "15px", marginRight: "30px" }}
        >
          New Post
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default Post;
