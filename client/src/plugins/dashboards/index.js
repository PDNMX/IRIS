import React from 'react';
import DashboardViewer from './viewer';
import { Switch, Route } from 'react-router-dom';
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {Global} from 'viser-react';
import theme from './theme';
import {store} from "./store";
import {Provider} from "react-redux";

export default DragDropContext(HTML5Backend)(
    class extends React.Component {
        componentDidMount() {
            Global.registerTheme('pdn', theme);
            Global.setTheme('pdn');
        }

        render() {
            return(
                <Provider store={store}>
                    <Switch>
                        <Route exact path={'/hubs/1/dashboards/:dashboardId'} component={DashboardViewer}/>
                        <Route exact path={'/hubs/1/dashboards/:dashboardId/view'} component={DashboardViewer}/>
                    </Switch>
                </Provider>
            );
        }
    }
)
