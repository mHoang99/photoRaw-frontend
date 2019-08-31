import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { DatePicker, message, Layout, Icon, Menu, Button, Modal, Input, InputNumber } from 'antd';
import 'antd/dist/antd.css';
import HomeScreen from './pages/HomeScreen';
import Categories from './pages/Categories';
import Post from './pages/Post';

import './pages/HomeScreen.css'

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false,
    loading: false,
    iconLoading: false,
    categories: 'all',
    color: 'all',
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

  selectColor = (event) => {
    this.setState({
      color: event.item.props.children
    })
    window.location.href = `http://localhost:3000/categories/${this.state.categories}&${event.item.props.children}`;
  }

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
            <div className="logo" >
              {!this.state.collapsed ? (

                <h2 style={{ color: "white", font: "Roboto", fontFamily: "Times New Roman, Roboto, Times, serif", textAlign: "center", marginTop: "15px" }}>PhotoRAW</h2>

              ) : (
                  <img src="http://localhost:3001/upload/logo" style={{ width: "80%", marginLeft: "10%", marginRight: "10%", marginTop: "10px", marginBottom: "5px" }} />
                )
              }
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
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
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    <span>User</span>
                  </span>
                }
              >
                <Menu.Item key="3">Info</Menu.Item>
                <Menu.Item key="4">Logout</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="shop" />
                    <span>Market</span>
                  </span>
                }
              >
                <Menu.Item key="6">Selling</Menu.Item>
                <Menu.Item key="8">Bought</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header className="row" style={{ background: '#fff', padding: 0, justifyContent: "flex-end" }}>
              <BrowserRouter>
                <Route path='/' exact={true} component={Post} />
                <Route path='/categories' component={Post} />
              </BrowserRouter>

            </Header>
            <Content style={{ marginLeft: '10px', marginRight: '10px' }} className="row">
              <BrowserRouter>
                <Route path='/' exact={true} component={HomeScreen} />
                <Route path='/categories' component={Categories} />
              </BrowserRouter>
            </Content>
            <Footer style={{ textAlign: 'center' }}>PhotoRaw ©2019</Footer>
          </Layout>
        </Layout>
      </div >
    );
  }
}

export default App;
