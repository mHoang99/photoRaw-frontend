import React from "react";

import { Input, AutoComplete, List, Avatar } from "antd";

const { Search } = Input;
const { Option } = AutoComplete;

function onSelect(value) {
  console.log("onSelect", value);
}

// function renderOption(item) {
//   return (
//     <Option key={item.category} text={item.category}>
//       <div className="global-search-item">
//         <span className="global-search-item-desc">
//           {item.data}
//           <a
//             href={`http://localhost:3000/id/${item.id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             {item.category}
//           </a>
//         </span>
//       </div>
//     </Option>
//   );
// }

function searchResult(query) {
  return new Array(query.length)
    .join(".")
    .split(".")
    .map((item, idx) => ({
      name: `${query[idx].fullName}`,
      id: `${query[idx]._id}`,
      avaUrl: `${query[idx].avaUrl}`,
      category: `${idx + 1}: ${query[idx].fullName}`
    }));
}

function searchPostResult(query) {
  return new Array(query.length)
    .join(".")
    .split(".")
    .map((item, idx) => ({
      title: `${query[idx].title}`,
      id: `${query[idx]._id}`,
      imageUrl: `${query[idx].imageUrl}`,
      category: `${idx + 1}: ${query[idx].title}`
    }));
}

class Searching extends React.Component {
  state = {
    searchValue: "",
    searchResults: [],
    searchPostResults: [],
    dataSource: [],
    display: true
  };

  // handleFormSubmit = event => {
  //   event.preventDefault();
  //   fetch(`http://localhost:3001/users/search-by-author-name`, {
  //     credentials: "include",
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ fullName: this.state.searchValue })
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //       console.log(this.state.searchValue);
  //       this.setState({
  //         searchResults: data,
  //         name: data.fullName
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       window.alert(err.message);
  //     });

  //   fetch(`http://localhost:3001/posts/search-by-post`, {
  //     credentials: "include",
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ title: this.state.searchValue })
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //       this.setState({
  //         searchPostResults: data
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       window.alert(err.message);
  //     });
  // };

  handleSearchValueChange = event => {
    this.setState({
      searchValue: event.target.value
    });
  };

  displayData = event => {
    // event.preventDefault();
    this.setState({
      display: true
    });
  };

  handleSearch = value => {
    fetch(`http://localhost:3001/users/search-by-author-name`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullName: value })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.data);
        if (data.data.length !== 0) {
          this.setState({
            dataSource: searchResult(data.data)
          });
        } else {
          this.setState({
            dataSource: []
          });
        }
      })
      .catch(err => {
        console.log(err);
        window.alert(err.message);
      });
    fetch(`http://localhost:3001/posts/search-by-post`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: value })
    })
      .then(res => res.json())
      .then(data => {
        if (data.data.length !== 0) {
          this.setState({
            dataPostSource: searchPostResult(data.data)
          });
        } else {
          this.setState({
            dataPostSource: []
          });
        }
        console.log(data);
      })
      .catch(err => {
        console.log(err);
        window.alert(err.message);
      });
  };

  render() {
    const { dataSource } = this.state;
    console.log(this.state);
    return (
      <div className="row">
        <div className="col-md-12 text-center">
          <form id="search">
            <div className="form-group">
              <AutoComplete
                className="global-search"
                size="large"
                style={{ width: "100%" }}
                // dataSource={dataSource.map(renderOption)}
                onSelect={onSelect}
                onSearch={this.handleSearch}
                optionLabelProp="text"
              >
                <Search
                  onSearch={this.displayData}
                  placeholder="input search text"
                  style={{ width: 200 }}
                />
              </AutoComplete>
              <br />
            </div>
          </form>
          {this.state.display ? (
            <div style={{ marginTop: "30px" }}>
              <h3>Authors</h3>
              <List
                itemLayout="horizontal"
                dataSource={this.state.dataSource}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avaUrl} />}
                      title={<a href={`http://localhost:3000/id/${item.id}`}>{item.name}</a>}
                    />
                  </List.Item>
                )}
              />
              <br/>
              <h3>Posts</h3>
              <List
                itemLayout="horizontal"
                dataSource={this.state.dataPostSource}
                renderItem={item => (
                  <List.Item
                    extra={
                      <img width={"100px"} alt="logo" src={item.imageUrl} />
                    }                  >
                    <List.Item.Meta
                      title={<a href={`http://localhost:3000/posts/${item.id}`}>{item.title}</a>}
                    />
                  </List.Item>
                )}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Searching;
