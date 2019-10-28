import React from 'react';
import Sheet from './sheet';
import TimeLine from './time-line';
import Cartesian from './catersian';
import DoubleAxis from './double-axis';
import Pie from './pie';
import TreeMap from './tree-map';
import Gauges from './gauges';
import Radar from './radar';
import Statistic from './statistic';
import Description from './description';
import Map from './map/scatter';
import HeatMap from './map/heat-map';
import GeoJsonPolygons from './map/geo-json-polygons';
import Text from './text';
import Image from './image';
import KnotButton from './button';
import KnotDivider from './divider';
import Filter from '../filters';
import { Tag, Icon } from 'antd';
import {connect} from 'react-redux';
import {mapStateToProps} from './utils';
import _ from 'lodash';
import {Global} from "viser-react";


const Listener = connect(mapStateToProps)(
    class extends React.Component {
        static defaultProps = {
            filters: {}
        };

        state = {
            filters: {}
        };

        constructor(props) {
            super(props);
            this.itemRef = React.createRef();
        }

        async componentDidMount() {
            const { dashboardId } = this.props;
            
            if (!dashboardId) {
                await this.itemRef.current.loadData(this.getMatch());
            }
            else if (!!dashboardId && _.isEmpty(this.state.filters)) {
                await this.itemRef.current.loadData(this.getMatch());
            }
            
            /*
            const { dashboardId, options } = this.props,
                { config } = options;
            
            if (!!config && !!config.interval && typeof config.interval.value === 'number') {
                setInterval(
                    async () => {
                        if (!!this.itemRef && !!this.itemRef.current) {
                            await this.itemRef.current.loadData(this.getMatch(), false)
                        }
                    },
                    config.interval.value
                );
            }
            */
        }

        getMatch = () => {
            const { filters, options } = this.props,
                { config } = options,
                optionsFilters = !!options.filters && JSON.parse(options.filters);

            let values = {};

            if ((!config || !config.listen) || (!!config && !!config.listen && config.listen.value)) {
                // console.log('#listen', config.listen.value);

                _.forEach(filters, item =>
                    _.forEach(item, (value, field) => {
                        if (!!value) {
                            values = {...values, [field]: value};
                        }
                    })
                );
            }

            let match = !_.isEmpty(values)? { $match: values }: undefined;

            if (!!optionsFilters && !_.isEmpty(optionsFilters)) {
                if (!!match && !!match.$match) {
                    match.$match = {...match.$match, ...optionsFilters};
                }
                else {
                    match = { $match: optionsFilters };
                }
            }

            return match;
        };

        async componentDidUpdate() {
            // console.log('prevProps', prevProps.filters);
            // console.log('props', this.props.filters);
            // console.log('prevState', prevState.filters);
            // console.log('state', this.state.filters);
            // console.log('--------------------------');
            const { options } = this.props,
                { config } = options,
                listen = (!config || !config.listen) || (!!config && !!config.listen && config.listen.value);

            if (listen) {
                if (!_.isEqual(this.state.filters, this.props.filters)) {
                    // console.log('#updated by filters changed!');
                    await this.setState({filters: this.props.filters});
                    await this.itemRef.current.loadData(this.getMatch());
                }
                else if (_.isEmpty(this.props.filters)) {
                    // await this.setState({filters: this.props.filters});
                    // console.log('#updated by empty filters!', this.props.filters, this.state.filters);
                    await this.itemRef.current.loadData(this.getMatch());
                }
            }
        }

        render() {
            const { chartType } = this.props,
                chartProps = this.props;

            switch (chartType) {
                case 'sheet':
                    return <Sheet {...chartProps}  ref={this.itemRef}/>;
                case 'time':
                    return <TimeLine {...chartProps}  ref={this.itemRef}/>;
                case 'lines':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'bars':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'area':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'stackBar':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'stackArea':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'points':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'linesAndPoints':
                    return <Cartesian {...chartProps} chartType={chartType}  ref={this.itemRef}/>;
                case 'doubleAxis':
                    return <DoubleAxis {...chartProps} ref={this.itemRef}/>;
                case 'pie':
                    return <Pie {...chartProps} ref={this.itemRef}/>;
                case 'treeMapDiagram':
                    return <TreeMap {...chartProps} ref={this.itemRef}/>;
                case 'gauges':
                    return <Gauges {...chartProps} ref={this.itemRef}/>;
                case 'radar':
                    return <Radar {...chartProps} ref={this.itemRef}/>;
                case 'statistic':
                    return <Statistic {...chartProps} ref={this.itemRef}/>;
                case 'description':
                    return <Description {...chartProps} ref={this.itemRef}/>;
                case 'mapScatterPlot':
                    return <Map {...chartProps} ref={this.itemRef}/>;
                case 'heatMap':
                    return <HeatMap {...chartProps} ref={this.itemRef}/>;
                case 'geoJsonPolygons':
                    return <GeoJsonPolygons {...chartProps} ref={this.itemRef}/>;
                default:
                    return <div></div>;
            }
        }
    }
);

const renderFilterValue = (value) => {
    return JSON.stringify(value);
};

const getTagColor = () => {
    if (!!Global && !!Global.colors && Global.colors.length > 1) {
        return Global.colors[1];
    }
    else {
        return 'black';
    }
};

export default (itemId, data, dimensions, changeStatic, onChange=undefined, makeFormatter=undefined, dashboardId=undefined) => {
    const { dataSet, chartType, paneId, options, calculations } = data,
        filters = (!!options && !!options.filters) && JSON.parse(options.filters),
        showFilters = !!filters && !_.isEmpty(filters);

    if (showFilters) {
        dimensions = {...dimensions, height: dimensions.height - 20};
    }

    switch (chartType) {
        case 'text':
            return <Text {...dimensions} data={data} changeStatic={changeStatic} onChange={onChange}/>;
        case 'image':
            return <Image {...dimensions} data={data}/>;
        case 'button':
            return <KnotButton {...dimensions} data={data} makeFormatter={makeFormatter}/>;
        case 'divider':
            return <KnotDivider {...dimensions} data={data} makeFormatter={makeFormatter}/>;
        case 'filter':
            return <Filter itemId={itemId} filter={data} dimensions={dimensions} dataSetId={data.dataSetId} dashboardId={dashboardId}/>;
        default:
            return (
                <div style={{textAlign: 'right'}}>
                    <div >
                        <Listener
                            {...dimensions}
                            calculations={calculations}
                            dashboardId={dashboardId}
                            itemId={itemId}
                            makeFormatter={makeFormatter}
                            paneId={paneId}
                            dataSetId={dataSet.id}
                            dataSet={dataSet}
                            options={options}
                            chartType={chartType}/>
                    </div>
                    {
                        showFilters &&
                        _.map(
                            filters,
                            (filter, name) => (
                                <Tag
                                    key={name}
                                    color={getTagColor()}>
                                    <Icon type={'filter'}/> {name}: {renderFilterValue(filter)}
                                </Tag>
                            )
                        )
                    }
                </div>
            );
    }
}