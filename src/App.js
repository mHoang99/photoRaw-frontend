import React, { useImperativeHandle } from 'react';
import './App.css';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { Layout, Icon, Menu, Button, Input, Drawer, message, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import HomeScreen from './pages/HomeScreen';
import Searching from './pages/Search';
import Categories from './pages/Categories';
import PostScreen from './pages/PostScreen';
import Profile from './pages/Profile';
import AuthorPost from './pages/AuthorPost';
import Success from './pages/Success';
import SellScreen from './pages/SellScreen';
import BoughtScreen from './pages/BoughtScreen';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp'
import Post from './pages/Post';

import './pages/HomeScreen.css'


const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    visible: false,
    childrenDrawer: false,
    collapsed: false,
    loading: false,
    iconLoading: false,
    categories: 'all',
    color: 'all',
    logedin: false,
    placement: 'top'
  };

  componentWillMount() {
    fetch('http://localhost:3001/users/current', {
      credentials: 'include',
      method: 'GET',
    })
      .then((res1) => {
        return res1.json();
      })
      .then((data1) => {
        console.log(data1.data);
        if (data1.data) {
          this.setState({ logedin: true });
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });
  }

  showDrawer = (event) => {
    console.log("here");
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  enterLoading = () => {
    this.setState({ loading: true });
  };

  enterIconLoading = () => {
    this.setState({ iconLoading: true });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  selectCategories = (event) => {
    this.setState({
      categories: event.item.props.children
    })
    window.location.href = `http://localhost:3000/categories/${event.item.props.children}&${this.state.color}`;
  };

  selectColor = (event, color) => {
    this.setState({
      color: color
    })
    window.location.href = `http://localhost:3000/categories/${this.state.categories}&${color}`;
  }

  onChange = e => {
    this.setState({
      placement: e.target.value,
    });
  };

  handleLogOut = () => {
    fetch("http://localhost:3001/users/logout", {
      credentials: "include",
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        window.localStorage.removeItem("email");
        window.localStorage.removeItem("fullName");
        this.setState({
          currentUser: {
            email: "",
            fullName: ""
          }
        });
        window.location.href = "/login";
      })
      .catch(error => {
        if (error) {
          console.log(error);
          window.alert(error.message);
        }
      });
  };

  render() {
    return (
      <div>

        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
            <div className="logo" >
              {!this.state.collapsed ? (
                <a href="http://localhost:3000">
                  <img src="http://localhost:3001/upload/logo2" style={{ width: "80%", marginLeft: "10%", marginRight: "10%", marginTop: "20px", marginBottom: "5px" }} />
                </a>
              ) : (
                  <a href="http://localhost:3000">
                    <img src="http://localhost:3001/upload/logo" style={{ width: "80%", marginLeft: "10%", marginRight: "5%", marginTop: "20px", marginBottom: "5px" }} />
                  </a>
                )
              }
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >

              <Menu.Item value="Search" key="18" onClick={this.showDrawer}>
                <Icon type="search" />
                <span>Search</span>
              </Menu.Item>




              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Recommended</span>
              </Menu.Item>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="pie-chart" />
                    <span>Categories</span>
                  </span>
                }
              >
                <Menu.Item onClick={this.selectCategories} value="Landscape" key="10">Landscape</Menu.Item>
                <Menu.Item onClick={this.selectCategories} key="11">Portrait</Menu.Item>
                <Menu.Item onClick={this.selectCategories} key="12">Animals/Wildlife</Menu.Item>
                <Menu.Item onClick={this.selectCategories} key="13">Sports</Menu.Item>
                <Menu.Item onClick={this.selectCategories} key="14">Food and Drink</Menu.Item>
                <Menu.Item onClick={this.selectCategories} key="15">Architecture</Menu.Item>
              </SubMenu>

              {this.state.logedin ?
                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      <Icon type="shop" />
                      <span>Market</span>
                    </span>
                  }
                >
                  <Menu.Item key="6" onClick={() => { window.location.href = "http://localhost:3000/selling"; }}>Selling</Menu.Item>
                  <Menu.Item key="8" onClick={() => { window.location.href = "http://localhost:3000/bought"; }}>Bought</Menu.Item>
                </SubMenu> : null
              }

              {this.state.logedin ?
                <SubMenu
                  key="sub1"
                  title={
                    <span style={{ alignItems: "center" }}>
                      <Icon type="user" />
                      <span>User</span>
                    </span>
                  }
                >
                  <Menu.Item key="3" onClick={() => { window.location.href = "http://localhost:3000/profile"; }}>Info</Menu.Item>
                  <Menu.Item key="4" onClick={this.handleLogOut}>Logout</Menu.Item>
                </SubMenu> : null
              }
            </Menu>
          </Sider>

          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Row>
                <Col span={18} >
                  <Row type="flex" justify="start">
                    <Button shape="circle" onClick={(event) => { this.selectColor(event, "red") }} style={{ marginTop: "15px", marginLeft: "3%", backgroundColor: "#e81515", borderStyle: "solid" }} />
                    <Button shape="circle" onClick={(event) => { this.selectColor(event, "yellow") }} value="yellow" style={{ marginTop: "15px", marginLeft: "3%", backgroundColor: "#ebeb46" }} />
                    <Button shape="circle" onClick={(event) => { this.selectColor(event, "green") }} value="green" style={{ marginTop: "15px", marginLeft: "3%", backgroundColor: "#59eb46" }} />
                    <Button shape="circle" onClick={(event) => { this.selectColor(event, "blue") }} value="blue" style={{ marginTop: "15px", marginLeft: "3%", backgroundColor: "#46c2eb" }} />
                    <Button shape="circle" onClick={(event) => { this.selectColor(event, "purple") }} value="purple" style={{ marginTop: "15px", marginLeft: "3%", backgroundColor: "#b446eb" }} />
                    <Button shape="circle" onClick={(event) => { this.selectColor(event, "pink") }} value="pink" style={{ marginTop: "15px", marginLeft: "3%", backgroundColor: "#eb46db" }} />
                  </Row>
                </Col>
                <Col span={6}>
                  <Row type="flex" justify="end">
                    {this.state.logedin ? <BrowserRouter>
                      <Route path='/' component={Post} />
                    </BrowserRouter> : null}

                  </Row>
                </Col>
              </Row>
            </Header>
            <Content style={{ marginLeft: '10px', marginRight: '10px' }} className="row">
              <BrowserRouter>
                <Route path='/posts' component={PostScreen}></Route>
                <Route path='/' exact={true} component={HomeScreen} />
                <Route path='/categories' component={Categories} />
                <Route path='/sign-up' exact={true} component={SignUp} />
                <Route path='/login' exact={true} component={SignIn} />
                <Route path='/profile' component={Profile} />
                <Route path='/id' component={AuthorPost} />
                <Route path='/success' component={Success} />
                <Route path='/selling' component={SellScreen} />
                <Route path='/bought' component={BoughtScreen} />
              </BrowserRouter>
            </Content>
            <Footer style={{ textAlign: 'center' }}>PixieRaw ©2019</Footer>
          </Layout>
        </Layout>

        <Drawer
          title="Search"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          getContainer={true}
          style={{}}
        >
          <BrowserRouter>
            <Route path='/' component={Searching} />
          </BrowserRouter>
        </Drawer>

      </div >
    );
  }
}

export default App;
