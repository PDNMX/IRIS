import React from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import helpers from './helpers';
import auth from './auth';


class SiderMenu extends React.Component {
    
    state = {
        selected: undefined
    };
    
    componentWillReceiveProps(nextProps) {
      const { location } = nextProps,
          parts = location.pathname.split('/'),
          targetPart = 3;

      if (parts.length > targetPart) {
          this.setState({selected: parts[targetPart]});
      }
    }
    render() {
        return (
<Menu mode="inline" selectedKeys={ [this.state.selected] }>
  <Menu.Item key="profile">
    <Link to={`/hubs/1/users/${auth.getUser().id}`}>
      <Icon type="user" />
      <span className="nav-text">{helpers.userInfo(auth.getUser())}
      </ span>
    </ Link>
  </ Menu.Item>
  <Menu.Divider  />
  <Menu.Item key="users">
    <Link to="/hubs/1/users">
      <Icon type="team" />
      <span className="nav-text">Usuarios
      </ span>
    </ Link>
  </ Menu.Item>
  <Menu.Item key="sources">
    <Link to="/hubs/1/sources">
      <Icon type="shop" />
      <span className="nav-text">Fuentes
      </ span>
    </ Link>
  </ Menu.Item>
  <Menu.Item key="dataSets">
    <Link to="/hubs/1/dataSets">
      <Icon type="database" />
      <span className="nav-text">Datos
      </ span>
    </ Link>
  </ Menu.Item>
  <Menu.Item key="dashboards">
    <Link to="/hubs/1/dashboards">
      <Icon type="dashboard" />
      <span className="nav-text">Tableros
      </ span>
    </ Link>
  </ Menu.Item>
  <Menu.Item key="entities">
    <Link to="/hubs/1/entities">
      <Icon type="global" />
      <span className="nav-text">Entidades
      </ span>
    </ Link>
  </ Menu.Item>
  <Menu.Item key="keys">
    <Link to="/hubs/1/keys">
      <Icon type="key" />
      <span className="nav-text">Claves
      </ span>
    </ Link>
  </ Menu.Item>
</ Menu>
        );
    }
}
export default withRouter(SiderMenu);