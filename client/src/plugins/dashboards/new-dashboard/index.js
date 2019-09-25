import React from "react";
import {Tooltip, Card, Icon, Layout, message, Divider, Typography, Tabs, Popover, Input, Button} from 'antd';
import { WidthProvider, Responsive } from "react-grid-layout";
import ChartWrapper from '../chart-wrapper';
import _ from "lodash";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './styles.css';
import rp from 'request-promise';
import auth from '../../../auth';
import {connect} from 'react-redux';
import { SizeMe } from 'react-sizeme'
import {addFilter, removeFilter, initFilters, removePaneFilters} from "../store/actions";
import { VERSION } from '../charts/utils';

const queryString = require('query-string');

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Content } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;

export default connect(filters => ({filters}), {addFilter, removeFilter, initFilters, removePaneFilters})(
    class extends React.Component {
        state = {
            showNewChartModal: false,
            showNewFilterModal: false,
            showNewImageModal: false,
            columnWidth: 0,
            rowHeight: 12,
            activePaneId: 0,
            viewControls: false,
            loading: true
        };

        async componentDidMount() {
            //const values = queryString.parse(this.props.location.search);
            // console.log(values);
            const { dashboardId } = this.props.match.params;

            await this.setState({loading: true});

            if (!!dashboardId) {
                await this.handleLoadDashboard(dashboardId);
            }
            else {
                await this.emptyDashboard();
            }
        }

        handleLoadDashboard = async (dashboardId) => {
            try {
                const chart = await rp({
                    method: 'GET',
                    uri: `${auth.getHost()}/dashboards/${dashboardId}`,
                    json: true
                });
                // console.log(chart);
                const { panes, breakpoints, activePaneId, _id, createdAt } = chart,
                    filters = !!chart.filters? JSON.parse(chart.filters): {};

                if (this.props.initFilters instanceof Function) {
                    // console.log('filters loaded', filters);
                    this.props.initFilters(filters);
                }

                await this.setState({
                    panes,
                    breakpoints,
                    activePaneId: !!activePaneId? activePaneId: 0,
                    filters,
                    dashboardId,
                    breakpoint: 'lg',
                    loading: false,
                    _id,
                    createdAt
                });
            }
            catch (e) {
                console.log(e);
            }
        };

        emptyDashboard = async () => {
            await this.setState({
                panes: [
                    {
                        icon: 'appstore',
                        title: `Página 1`,
                        layouts: {lg: [], md: [], sm: [], xs: [], xxs: []},
                        closable: false,
                        items: {}
                    }
                ],
                loading: false,
            });

            await this.setState({ breakpoints: { lg: 18, md: 12, sm: 10, xs: 6, xxs: 2}});
        };

        getElementLayout = (key, item) => {
            const { breakpoint, panes } = this.state,
                activePane = panes[item.paneId],
                { layouts } = activePane;

            let element;

            // console.log('get item', key, 'from', activePaneId);

            if (!!layouts) {
                for (let i = 0; i < layouts[breakpoint].length; i++) {
                    if (layouts[breakpoint][i].i === key) {
                        element = layouts[breakpoint][i];
                        break;
                    }
                }
            }

            return element;
        };

        handleChangeStatic = async (key, value) => {
            let { panes, activePaneId } = this.state,
                activePane = panes[activePaneId],
                { layouts } = activePane;

            if (!!layouts) {
                _.forEach(layouts, layout => {
                    for (let i = 0; i < layout.length; i++) {
                        if (layout[i].i === key) {
                            layout[i].static = value;
                            break;
                        }
                    }
                });

                panes[activePaneId] = { ...activePane, layouts };

                await this.setState({ panes });
            }
        };

        handleUpdateItem = (key, item) => {
            let { panes, activePaneId } = this.state,
                activePane = panes[activePaneId];

            activePane.items[key] = item;
            panes[activePaneId] = activePane;

            this.setState({ panes });
        };

        goToPane = ({paneId}, value=undefined) => {
            if (paneId >= 0 && paneId < this.state.panes.length) {
                // console.log('go to pane', paneId);

                this.setState({activePaneId: paneId});
            } else {
            }
        };

        setFilter = ({ dataSetId, field, paneId }, value=undefined) => {
            if (paneId >= 0 && paneId < this.state.panes.length) {
                // console.log('setFilter', dataSetId, field, paneId);

                const { panes } = this.state,
                    targetPane = panes[paneId],
                    { items } = targetPane;

                _.forEach(
                    _.pickBy(items, item => item.dataSetId === dataSetId && item.chartType === 'filter'),
                    (item, itemId) => {
                        const { field } = item;

                        if (this.props.addFilter instanceof Function) {
                            this.props.addFilter({
                                itemId,
                                dataSetId,
                                paneId,
                                filter: { [field]: value }
                            });
                        }
                    }
                );
            }
            else {
            }
        };

        executeCommands = (commands, value) => {
            commands.forEach(command => {
                const f = this[command.name];

                if (f instanceof Function) {
                    f(command.args, value);
                }
            });
        };

        handleMakeFormatter = (formatter, args={}) => {
            switch (formatter.name) {
                case 'linkTo':
                    return value => <a onClick={() => this.executeCommands(formatter.args.onClick, value)}>{value}</a>;
                case 'eventHandler':
                    if (args.event === 'onClick') {
                        return value => this.executeCommands(formatter.args.onClick, value);
                    }
                    else {
                        return value => value;
                    }
                default:
                    return value => value;
            }
        };

        createElement = (item, key) => {
            const { viewControls } = this.state,
                element = this.getElementLayout(key, item);
            return (
                <Card
                    key={key}
                    size={'small'}
                    title={
                        !!item.title &&
                        <div style={{textAlign: 'left', paddingLeft: 12}}>
                            <Text>{item.title}</Text>
                        </div>
                    }
                    bodyStyle={{height: '100%', width: '100%'}}>

                    <SizeMe
                        monitorWidth={true}
                        monitorHeight={true}
                        render={({size}) =>
                            <div style={{width: '100%', height: '100%'}}>
                                <ChartWrapper
                                    dashboardId={this.state.dashboardId}
                                    size={size}
                                    data={item}
                                    onChange={updatedItem => this.handleUpdateItem(key, updatedItem)}
                                    changeStatic={async value => await this.handleChangeStatic(key, value)}
                                    makeFormatter={this.handleMakeFormatter}
                                    element={element}/>
                            </div>
                        }
                    />
                </Card>
            );
        };

        // We're using the cols coming back from this to calculate where to add new items.
        onBreakpointChange = (breakpoint, cols) => {
            //console.log('onBreakpointChange', breakpoint, cols);

            this.setState({
                breakpoint,
                cols
            });
        };

        onLayoutChange = (layout, layouts, targetKey) => {
            const { activePaneId } = this.state;

            if (targetKey === activePaneId) {
                let { panes } = this.state,
                    targetPane = panes[targetKey];

                panes[targetKey] = {...targetPane, layouts};

                this.setState({panes});
            }
        };


        onWidthChange = (containerWidth, margin, cols) => {
            // console.log(containerWidth, cols);
            this.setState({columnWidth: containerWidth / cols});
        };


        onChange = activePaneId => {
            this.setState({activePaneId: parseInt(activePaneId)});
        };


        remove = targetKey => {
            let {panes} = this.state;
            const index = parseInt(targetKey);

            panes.splice(index, 1);
            this.setState({ panes, activePaneId: Math.max(0, index - 1) });
        };


        handleRemovePaneFilters = (paneId) => {
            if (this.props.removePaneFilters instanceof Function) {
                this.props.removePaneFilters(paneId);
            }
        };

        swapPanes = (x, y) => {
            let { panes } = this.state;
            [panes[x], panes[y]] = [panes[y], panes[x]];
            this.setState({panes});
        };

        getTabBarActions = () => {
            const { filters } = this.props,
                { activePaneId, panes, viewControls } = this.state,
                n = panes.length;
            let disabled = true;

            // console.log(activePaneId, filters);

            if (!!filters && !_.isEmpty(filters[activePaneId])) {
                disabled = false;
            }

            return (
                <span>
                    {
                        viewControls &&
                        <span>
                            {
                                (activePaneId > 0 && n > 1) &&
                                <span>
                                    <Tooltip title={'Izquierda'} placement={'bottom'}>
                                        <Button
                                            type={'link'}
                                            icon={'left'}
                                            onClick={() => this.swapPanes(activePaneId, activePaneId - 1)}/>
                                    </Tooltip>
                                    <Divider type={'vertical'}/>
                                </span>
                            }
                            {
                                activePaneId < (n - 1) &&
                                <span>
                                    <Tooltip title={'Derecha'} placement={'bottom'}>
                                        <Button
                                            type={'link'}
                                            icon={'right'}
                                            onClick={() => this.swapPanes(activePaneId, activePaneId + 1)}/>
                                    </Tooltip>
                                    < Divider type={'vertical'}/>
                                </span>
                            }
                        </span>
                    }
                    <Tooltip title={'Limpiar filtros'} placement={'left'}>
                        <Button
                            type={'link'}
                            icon={'filter'}
                            disabled={disabled}
                            onClick={() => this.handleRemovePaneFilters(activePaneId)}/>
                    </Tooltip>
                </span>
            );
        };

        render() {
            const {
                rowHeight,
                panes,
                activePaneId,
                breakpoints,
                breakpoint,
                loading
            } = this.state;

            return (
                <Layout style={{height: '100%'}}>
                    <Content style={{height: '100%'}}>
                        <div style={{height: '100%'}}>
                            {
                                panes.length > 1 ? (
                                    !loading &&
                                    <Tabs
                                        tabBarExtraContent={this.getTabBarActions()}
                                        tabBarStyle={{marginLeft: 12, marginRight: 12, marginTop: 12, marginBottom: 0}}
                                        type={'line'}
                                        activeKey={activePaneId.toString()}
                                        onChange={this.onChange}>
                                        {
                                            panes.map((pane, i) =>
                                                <TabPane
                                                    forceRender={true}
                                                    tab={
                                                        <span>
                                                            <Icon type={!!pane.icon ? pane.icon : 'appstore'}/>
                                                            <Text>
                                                                {pane.title}
                                                            </Text>
                                                        </span>
                                                    }
                                                    key={i.toString()}
                                                    closable={false}>
                                                    <div className={'pane-content'}>
                                                        <ResponsiveReactGridLayout
                                                            className={`grid-layout`}
                                                            cols={breakpoints}
                                                            rowHeight={rowHeight}
                                                            layouts={JSON.parse(JSON.stringify(pane.layouts))}
                                                            onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts, i)}
                                                            onBreakpointChange={this.onBreakpointChange}
                                                            onWidthChange={this.onWidthChange}>
                                                            {
                                                                _.map(pane.items, (item, key) => this.createElement(item, key))
                                                            }
                                                        </ResponsiveReactGridLayout>
                                                    </div>
                                                </TabPane>
                                            )
                                        }
                                    </Tabs>

                                ) : (
                                    <div className={'pane-content'}>
                                        <ResponsiveReactGridLayout
                                            className={`grid-layout`}
                                            cols={breakpoints}
                                            rowHeight={rowHeight}
                                            layouts={JSON.parse(JSON.stringify(panes[0].layouts))}
                                            onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts, "i")}
                                            onBreakpointChange={this.onBreakpointChange}
                                            onWidthChange={this.onWidthChange}>
                                            {
                                                _.map(panes[0].items, (item, key) => this.createElement(item, key))
                                            }
                                        </ResponsiveReactGridLayout>
                                    </div>
                                )
                            }
                        </div>
                    </Content>
                </Layout>
            );
        }
    }
)