import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Layout, LocaleProvider, message} from 'antd';
import NoMatch from './common/page-not-found';
import es_ES from 'antd/lib/locale-provider/es_ES';
import auth from './auth';
import 'moment/locale/es-do';
import DashboardEditor from './plugins/dashboards';

const { Header, Content, Sider, Footer } = Layout;

class AppLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            width: window.innerWidth,
            height: window.innerHeight,
            loggedIn: auth.loggedIn(),
            query: `{ hub (id: 1 ) { id name  } }`,
            hub: {id: 0, name: '',  }
        };
    }

    updateAuth = (loggedIn, newLogin) => {
        this.setState({
            loggedIn
        }, () => newLogin && message.success(`Bienvenido ${auth.getUser().email}`));
    };

    componentWillMount() {
        auth.onChange = this.updateAuth;
        this.setState({width: window.innerWidth, height: window.innerHeight});
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    };

    loadData = () => {
    };

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <LocaleProvider locale={es_ES}>
                <Layout style={{minHeight: this.state.height}}>
                    <Layout>
                        <Content>
                            <Switch>
                                <Route path="/hubs/:hubId/dashboards/:dashboardId" component={DashboardEditor}
                                       exact={true}/>
                                <Route component={NoMatch}/>
                            </ Switch>
                        </ Content>
                        <Footer style={{textAlign: 'center'}}>
                        </ Footer>
                    </ Layout>
                </ Layout>
            </ LocaleProvider>
        );
    }
}

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            auth.loggedIn() ? (
                <Component {...props} />
            ) : (
                <Component {...props} />
            )
        }
    />
);


export default class Router extends React.Component {

    render() {
        return (
<BrowserRouter >
  <Switch >
    <PrivateRoute component={AppLayout} />
  </ Switch>
</ BrowserRouter>
        );
    }
}