import React from 'react';
import DashboardViewer from './viewer';
import { Switch, Route } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {store} from './store';
import {Provider} from 'react-redux';
import {Layout} from 'antd';

const { Content } = Layout;

export default DragDropContext(HTML5Backend)(
    class extends React.Component {

        render() {
            return(
                <Provider store={store}>
                    <Layout style={{height: '100%'}}>
                        <Content style={{height: '100%'}}>
                            <Switch>
                                <Route exact path={'/hubs/1/dashboards/:dashboardId'} component={DashboardViewer}/>
                                <Route exact path={'/hubs/1/dashboards/:dashboardId/view'} component={DashboardViewer}/>
                                <Route exact path={'/view/:dashboardId'} component={DashboardViewer} />
                                <Route exact path={'/hubs/1/dashboardeditor/view/:dashboardId'} component={DashboardViewer} />
                            </Switch>
                        </Content>
                    </Layout>
                </Provider>
            );
        }
    }
)
