import React from 'react';
import {Tooltip, Card, message, Tabs, Button, Icon, Dropdown, Menu, Result, Divider} from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import ChartWrapper from '../chart-wrapper';
import _ from 'lodash';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './styles.css';
import rp from 'request-promise';
import auth from '../../../auth';
import {connect} from 'react-redux';
import { SizeMe } from 'react-sizeme'
import {addFilter, removeFilter, initFilters, removePaneFilters, setPaneFilters} from '../store/actions';
import DownloadModal from '../download-modal';
import htmlToImage from 'html-to-image';
import FileSaver from 'file-saver';
import moment from 'moment';
import {Global} from 'viser-react';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { TabPane } = Tabs;

export default connect(filters => ({filters}), {addFilter, removeFilter, initFilters, removePaneFilters, setPaneFilters})(
    class extends React.Component {
        state = {
            columnWidth: 0,
            rowHeight: 12,
            activePaneId: 0,
            loading: true,
            showDownloadModal: false
        };

        async componentDidMount() {
            const { dashboardId } = this.props.match.params;

            await this.setState({loading: true});

            if (!!dashboardId) {
                await this.handleLoadDashboard(dashboardId);
            }

            await this.setState({loading: false});
        }

        async componentDidUpdate() {
            if (!_.isEqual(this.props.filters, this.state.filters)) {
                console.log('#ds-filters', this.props.filters);
                await this.setState({filters: this.props.filters});
            }
        }

        handleLoadDashboard = async (dashboardId) => {
            try {
                const chart = await rp({
                    method: 'GET',
                    uri: `${auth.getHost()}/dashboards/${dashboardId}`,
                    json: true
                });

                if (!!chart) {
                    const {panes, breakpoints, activePaneId, _id, createdAt, theme} = chart,
                        filters = !!chart.filters ? JSON.parse(chart.filters) : {};

                    if (this.props.initFilters instanceof Function) {
                        // console.log('filters loaded', filters);
                        this.props.initFilters(filters);
                    }

                    if (!!theme) {
                        Global.registerTheme('theme', theme);
                        Global.setTheme('theme');
                        window.less
                            .modifyVars({'@primary-color': theme.defaultColor})
                            .then(() => {})
                            .catch(error => {
                                message.error('Failed to update theme');
                            });
                    }

                    panes.forEach(pane =>
                        _.forEach(pane.layouts, layout =>
                            layout.map(item =>
                                item.static = true
                            )
                        )
                    );

                    await this.setState({
                        panes,
                        breakpoints,
                        activePaneId: !!activePaneId ? activePaneId : 0,
                        filters,
                        dashboardId,
                        breakpoint: 'lg',
                        _id,
                        createdAt
                    });
                }
                else {
                    await this.setState({
                        dashboardId
                    });
                }
            }
            catch (e) {
                console.log(e);
            }
        };

        getElementLayout = (key, item) => {
            const { breakpoint, panes } = this.state,
                activePane = panes[item.paneId],
                { layouts } = activePane;

            let element;

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

        goToPane = ({paneId}, value=undefined) => {
            if (paneId >= 0 && paneId < this.state.panes.length) {
                // console.log('go to pane', paneId);

                this.setState({activePaneId: paneId});
            }
            else {
                message.error(`El panel ${paneId} no existe.`);
            }
        };

        setFilter = ({ dataSetId, field, paneId }, value=undefined) => {
            if (paneId >= 0 && paneId < this.state.panes.length) {
                // console.log('setFilter', dataSetId, field, paneId);

                const { panes } = this.state,
                    targetPane = panes[paneId],
                    { items } = targetPane;

                _.forEach(
                    _.pickBy(
                        items,
                        item => item.dataSetId === dataSetId && item.chartType === 'filter' && item.field === field
                    ),
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
                message.error(`El panel ${paneId} no existe.`);
            }
        };

        clonePaneFilters = ({ sourcePaneId, targetPaneId }, value=undefined) => {
            const numPanes = this.state.panes.length;

            if (targetPaneId >= 0 && targetPaneId < numPanes) {
                const { panes, filters } = this.state,
                    targetPane = panes[targetPaneId],
                    items = _.pickBy(targetPane.items, item => item.chartType === 'filter');

                // console.log(filters, items);

                if (!!filters && !_.isEmpty(items)) {
                    const sourceFilters = filters[sourcePaneId];

                    console.log(sourcePaneId, sourceFilters);

                    if (!!sourceFilters && !_.isEmpty(sourceFilters)) {
                        let newFilters = {};

                        // console.log('#before', newFilters);

                        _.forEach(sourceFilters, (dateSet, dataSetId) => {
                            _.forEach(dateSet, (item, itemId) => {
                                _.forEach(item, (filter, field) => {
                                    // console.log(dataSetId, itemId, field, filter);

                                    if (!(dataSetId in newFilters)) {
                                        newFilters[dataSetId] = {};
                                    }

                                    _.forEach(
                                        _.pickBy(items, item => item.dataSetId === dataSetId && item.field === field),
                                        (t_item, t_itemId) => {
                                            // console.log(dataSetId, t_itemId, [field], filter);

                                            if (t_itemId in newFilters[dataSetId]) {
                                                newFilters[dataSetId][t_itemId] = {
                                                    ...newFilters[dataSetId][t_itemId],
                                                    [field]: filter
                                                };
                                                // console.log('a', dataSetId, t_itemId, [field], filter);
                                            }
                                            else {
                                                newFilters[dataSetId][t_itemId] = {
                                                    [field]: filter
                                                };
                                                // console.log('b', dataSetId, t_itemId, [field], filter);
                                            }
                                        }
                                    );
                                });
                            })
                        });

                        // console.log('#after', newFilters);

                        if (this.props.setPaneFilters instanceof Function) {
                            this.props.setPaneFilters({paneId: targetPaneId, filters: newFilters});
                        }
                    }
                }
            }
            else {
                message.error(`El panel ${targetPaneId} no existe.`);
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
                case 'button':
                    return value => this.executeCommands(formatter.actions, value);
                default:
                    return value => value;
            }
        };

        downloadChart = (item, itemId) => {
            htmlToImage.toPng(
                document.getElementById(itemId),
                {backgroundColor: 'white'}
            ).then(url =>
                fetch(url).then(res => res.blob()).then(blob =>
                    FileSaver.saveAs(
                        blob,
                        `${!!item.title? item.title: itemId}_${moment().format('YYYY_MM_DD_hh_mm_ss')}.png`
                    )
                )
            );
        };

        getChartMenu = (item, key) => {
            return (
                <Menu>
                    <Menu.Item onClick={() => this.setState({showDownloadModal: true, selectedItem: {...item, itemId: key}})}>
                        <Icon type={'download'}/> Datos
                    </Menu.Item>
                    <Menu.Item onClick={() => this.downloadChart(item, key)}>
                        <Icon type={'camera'}/> Imagen
                    </Menu.Item>
                </Menu>
            );
        };

        getDropdown = (item, key) => {
            return (
                <span>
                    {this.getListenButton(item)}
                    <Dropdown overlay={this.getChartMenu(item, key)}>
                    <Button
                        size={'small'}
                        type={'link'}
                        icon={'ellipsis'} />
                    </Dropdown>
                </span>
            );
        };

        getListenButton = (item) => {
            if (!item.options) {
                return null;
            }

            const { options } = item,
                { config } = options,
                listen = (!config || !config.listen) || (!!config && !!config.listen && config.listen.value);

            return !listen && (
                <span>
                    <Tooltip title={'El gráfico no escucha los filtros'} placement={'bottom'}>
                        <Icon type={'filter'} style={{color: '#8C8C8C'}}/>
                    </Tooltip>
                    <Divider type={'vertical'}/>
                </span>
            );
        };

        createBorderLessElement = (item, key, element) => {
            return (
                <div key={key} style={{width: '100%', height: '100%'}}>
                    <SizeMe
                        monitorWidth={true}
                        monitorHeight={true}
                        render={({size}) =>
                            <div style={{width: '100%', height: '100%'}}>
                                <ChartWrapper
                                    dashboardId={this.state.dashboardId}
                                    size={size}
                                    data={item}
                                    makeFormatter={this.handleMakeFormatter}
                                    element={element}/>
                            </div>
                        }
                    />
                </div>
            );
        };

        createElement = (item, key) => {
            const element = this.getElementLayout(key, item);

            if (['divider', 'button'].includes(item.chartType)) {
                return this.createBorderLessElement(item, key, element);
            }

            return (
                <Card
                    key={key}
                    size={'small'}
                    title={
                        !!item.title &&
                        <div style={{textAlign: 'left', paddingLeft: 12}}>
                            {item.title}
                        </div>
                    }
                    bodyStyle={{height: !!item.title? 'calc(100% - 40px)': '100%', width: '100%'}}
                    extra={!!item.title && this.getDropdown(item, key)}>
                    {
                        (!item.title && item.chartType !== 'filter') &&
                        <div className={'item-title'}>
                            {this.getDropdown(item)}
                        </div>
                    }
                    <SizeMe
                        monitorWidth={true}
                        monitorHeight={true}
                        render={({size}) =>
                            <div id={key} style={{width: '100%', height: '100%'}}>
                                <ChartWrapper
                                    dashboardId={this.state.dashboardId}
                                    size={size}
                                    data={item}
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
            console.log('onBreakpointChange', breakpoint, cols);

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

                this.setState({ panes });
            }
        };

        onWidthChange =(containerWidth, margin, cols) => {
            // console.log(containerWidth, cols);
            this.setState({columnWidth: containerWidth / cols});
        };

        onChange = activePaneId => {
            this.setState({ activePaneId: parseInt(activePaneId) });
        };

        handleRemovePaneFilters = (paneId) => {
            if (this.props.removePaneFilters instanceof Function) {
                this.props.removePaneFilters(paneId);
            }
        };

        getTabBarActions = () => {
            const { filters } = this.props,
                { activePaneId, panes } = this.state;
            let disabled = true;

            if (!!filters && !_.isEmpty(filters[activePaneId])) {
                disabled = false;
            }

            return (
                <span>
                    <Tooltip title={'Capturar'} placement={'bottom'}>
                        <Button
                            type={'link'}
                            icon={'camera'}
                            onClick={() => this.downloadChart(panes[activePaneId], `pane-${activePaneId}`)}/>
                    </Tooltip>
                     <Divider type={'vertical'}/>
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
                dashboardId,
                rowHeight,
                panes,
                activePaneId,
                breakpoints,
                loading,
                showDownloadModal,
                selectedItem,
                filters
            } = this.state;

            return (
                <div style={{height: '100%'}}>
                    {
                        !loading &&
                        <div>
                            {
                                !!panes?
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
                                                    tab={<span><Icon
                                                        type={!!pane.icon ? pane.icon : 'appstore'}/> {pane.title}</span>}
                                                    key={i.toString()}>
                                                    <div id={`pane-${i}`}>
                                                        <ResponsiveReactGridLayout
                                                            className={'grid-layout'}
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
                                    </Tabs>:
                                    <Result
                                        status={'404'}
                                        title={'El tablero que buscas no existe'}
                                        subTitle={`Lo sentimos, el tablero '${dashboardId}' no existe.`}/>
                            }
                        </div>
                    }
                    <DownloadModal
                        visible={showDownloadModal}
                        item={selectedItem}
                        filters={!!filters && filters[activePaneId]}
                        onClose={() => this.setState({showDownloadModal: false})}/>
                </div>
            );
        }
    }
)