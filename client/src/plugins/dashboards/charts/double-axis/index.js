import React from 'react';
import {Axis, Chart, Legend, Bar, Point, Tooltip, Line} from "viser-react";
import {Skeleton} from "antd";
import getData from '../data';
import helpers from '../../../../helpers';
import _ from "lodash";


export default class extends React.Component {
    state = {
        documents: [],
        loading: true,
        minValues: 0,
        maxValues: 0
    };

    async componentDidMount() {
        // await this.loadData();
    }

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options,
            { bars, lines, axis } = fields;

        await this.setState({loading: true});

        let documents = await getData('doubleAxis', dataSet.id, fields, match);

        documents.forEach(d => d[`_id_${axis.value.name}`] = d['_id']);

        const minValues = _.min(documents.map(d => Math.min(d[bars.value.name], d[lines.value.name]))),
            maxValues = _.max(documents.map(d => Math.max(d[bars.value.name], d[lines.value.name])));

        // console.log(documents);

        this.setState({documents, minValues, maxValues, loading: false});
    };

    getXScale = (axis) => {
        switch (axis.value.type) {
            case 'numeric':
                return 'linear';
            case 'float':
                return 'linear';
            case 'int':
                return 'linear';
            case 'datetime':
                return 'timeCat';
            case 'string':
                return 'cat';
            default:
                return 'cat'
        }
    };

    getYScale = (axis) => {
        switch (axis.value.type) {
            case 'numeric':
                return 'linear';
            case 'float':
                return 'linear';
            case 'int':
                return 'linear';
            case 'datetime':
                return 'timeCat';
            case 'string':
                return 'linear';
            default:
                return 'linear'
        }
    };

    render() {
        const
            { width, height } = this.props,
            { documents, loading, maxValues, minValues } = this.state,
            { config } = this.props.options,
            { axis, bars, lines } = this.props.options.fields,
            sharedScale = !!config && !!config.scaleType && !!config.scaleType.value && config.scaleType.value === 'shared';

        let axisScale = {
                dataKey: `_id_${axis.value.name}`,
                type: this.getXScale(axis)
            },
            barsScale = {
                dataKey: bars.value.name,
                type: this.getYScale(bars),
                // min: minValues,
                // max: maxValues
            },
            linesScale = {
                dataKey: lines.value.name,
                type: this.getYScale(lines),
                // min: minValues,
                // max: maxValues
            },
            barsProps = {
                position: `_id_${axis.value.name}*${bars.value.name}`
            },
            linesProps = {
                position: `_id_${axis.value.name}*${lines.value.name}`
            };

        let barsLabel = [`${bars.value.name}`],
            barsLabelOptions = {},
            linesLabel = [`${lines.value.name}`],
            linesLabelOptions = {};

        if (!!bars.formatter) {
            barsScale.formatter = helpers[bars.formatter];
            barsLabelOptions.formatter = helpers[bars.formatter];
            // barsProps.label = [`${bars.value.name}`, {density: 0.3, formatter: helpers[bars.formatter]}];
        }

        if (!!lines.formatter) {
            linesLabelOptions.formatter = helpers[lines.formatter];
            linesScale.formatter = helpers[lines.formatter];
            // linesProps.label = [`${lines.value.name}`, {density: 0.3, formatter: helpers[lines.formatter]}];
        }

        if (!!config && !!config.density && !!config.density.value) {
            barsLabelOptions.density = config.density.value;
            linesLabelOptions.density = config.density.value;
        }

        if (sharedScale) {
            linesScale.min = minValues;
            linesScale.max = maxValues;
            barsScale.min = minValues;
            barsScale.max = maxValues;
        }

        if (!_.isEmpty(barsLabelOptions)) {
            barsLabel.push(barsLabelOptions);
        }

        if (!_.isEmpty(linesLabelOptions)) {
            linesLabel.push(linesLabelOptions);
        }

        if (!!bars.alias) {
            barsScale.alias = bars.alias;
        }

        if (!!lines.alias) {
            linesScale.alias = lines.alias;
        }

        barsProps.label = barsLabel;
        linesProps.label = linesLabel;

        return (
            <Skeleton loading={loading} active>
                <Chart
                    forceFit={!width}
                    width={width}
                    height={height}
                    data={documents}
                    padding={[20, sharedScale? 20: 80, 95, 80]}
                    scale={[axisScale, barsScale, linesScale]}>
                    <Tooltip/>
                    <Axis dataKey={bars.value.name} show={true} position={'left'}/>
                    <Axis dataKey={lines.value.name} show={!sharedScale}/>
                    <Legend
                        custom
                        allowAllCanceled
                        items={[
                            {
                                value: !!bars.alias? bars.alias: bars.value.name,
                                marker: {
                                    symbol: 'square', fill: '#34b3eb', radius: 5
                                }
                            },
                            {
                                value: !!lines.alias? lines.alias: lines.value.name,
                                marker: {
                                    symbol: 'hyphen', stroke: '#ffe01b', radius: 5, lineWidth: 2
                                }
                            }
                        ]}
                        onClick={(ev, chart) => {
                            const item = ev.item;
                            const value = item.value;
                            const checked = ev.checked;
                            const geoms = chart.getAllGeoms();

                            for (let i = 0; i < geoms.length; i++) {
                                const geom = geoms[i];
                                if (geom.getYScale().field === value) {
                                    if (checked) {
                                        geom.show();
                                    } else {
                                        geom.hide();
                                    }
                                }
                            }
                        }}/>
                    <Bar {...barsProps} color={'#34b3eb'}/>
                    <Line {...linesProps} size={2} color={'#ffe01b'}/>
                    <Point
                        position={`_id_${axis.value.name}*${lines.value.name}`}
                        shape={'circle'}
                        size={3}
                        color={'#ffe01b'}
                        style={{ stroke: '#fff', lineWidth: 1 }}/>
                </Chart>
            </Skeleton>
        );
    }
}
