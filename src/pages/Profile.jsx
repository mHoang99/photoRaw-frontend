import React from "react";

class Profile extends React.Component {
  state = {
    currentUser: {
      fullName: "",
      address: "",
      dob: "",
      avaUrl: "",
      email: "",
      city: "",
      country: "",
      message: "",
      phoneNumber: ""
    },
    imgSrc: "",
    imgUrl: "",
    imgFile: "",
    errorMessage: ""
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
            imgSrc: data.data.avaUrl
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

  submitChanges = event => {
    event.preventDefault();
    console.log("submiting");
    if (this.state.imgFile) {
      console.log("submiting");
      const formData = new FormData();
      formData.append("image", this.state.imgFile);
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
          if (document.querySelector("#full-name").value) {
            fullName = document.querySelector("#full-name").value;
          }

          if (document.querySelector("#dob").value) {
            dob = document.querySelector("#dob").value;
          }

          if (document.querySelector("#address").value) {
            address = document.querySelector("#address").value;
          }
          if (document.querySelector("#city").value) {
            city = document.querySelector("#city").value;
          }
          if (document.querySelector("#country").value) {
            country = document.querySelector("#country").value;
          }
          if (document.querySelector("#message").value) {
            message = document.querySelector("#message").value;
            console.log(message);
          }
          if (document.querySelector("#phoneNumber").value) {
            phoneNumber = document.querySelector("#phoneNumber").value;
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
      if (document.querySelector("#full-name").value) {
        fullName = document.querySelector("#full-name").value;
      }

      if (document.querySelector("#dob").value) {
        dob = document.querySelector("#dob").value;
      }

      if (document.querySelector("#address").value) {
        address = document.querySelector("#address").value;
      }
      if (document.querySelector("#city").value) {
        city = document.querySelector("#city").value;
      }
      if (document.querySelector("#country").value) {
        country = document.querySelector("#country").value;
      }
      if (document.querySelector("#message").value) {
        message = document.querySelector("#message").value;
        console.log(message);
      }
      if (document.querySelector("#phoneNumber").value) {
        phoneNumber = document.querySelector("#phoneNumber").value;
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
  };

  render() {
    console.log(this.state);
    return (
      <div className="container" style={{ marginTop: "20px" }}>
        <form className="row">
          <div className="form-group col-6">
            <label>Avatar</label>
            {this.state.imgSrc ? (
              <div>
                <img
                  src={this.state.imgSrc}
                  style={{
                    width: "200px",
                    height: "200px",
                    overflow: "true",
                    marginBottom: "10px"
                  }}
                />
              </div>
            ) : null}

            <input
              onChange={this.handleImageChange}
              type="file"
              className="form-control-file"
              id="ava-file"
            />
          </div>

          <div className="form-group col-6">
            <label for="inputEmail4">Message</label>
            <input
              type="text"
              className="form-control"
              id="message"
              placeholder="Message to display to other people"
              style={{ height: "250px" }}
              defaultValue={this.state.currentUser.message}
            />
          </div>

          <div className="form-group col-12">
            <label for="inputEmail4">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="full-name"
              placeholder="Name"
              defaultValue={this.state.currentUser.fullName}
            />
          </div>

          <div className="form-group col-12">
            <label for="inputAddress">Phone Number</label>
            <input
              type="number"
              className="form-control"
              id="phoneNumber"
              defaultValue={this.state.currentUser.phoneNumber}
              placeholder="Phone Number"
            />
          </div>

          <div className="form-group col-12">
            <label for="inputAddress">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              defaultValue={this.state.currentUser.address}
              placeholder="1234 Main St"
            />
          </div>

          <div className="form-group col-6">
            <label for="inputAddress">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              defaultValue={this.state.currentUser.city}
              placeholder="City"
            />
          </div>

          <div className="form-group col-6">
            <label for="inputAddress">Country</label>
            <input
              type="text"
              className="form-control"
              id="country"
              defaultValue={this.state.currentUser.country}
              placeholder="Country"
            />
          </div>

          <div className="form-group col-12">
            <label>Date of birth</label>
            <input
              defaultValue={this.state.currentUser.dob}
              id="dob"
              type="date"
              name="bday"
              max="2020-12-31"
              min="1900-01-01"
              className="form-control"
            />
          </div>
          <div className="col-1" />
          <button
            type="submit"
            className="btn btn-primary col-10"
            onClick={this.submitChanges}
          >
            Submit
          </button>
          <div className="col-1" />
        </form>
      </div>
    );
  }
}

export default Profile;
