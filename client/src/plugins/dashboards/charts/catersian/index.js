import React from 'react';
import {Axis, Chart, Legend, Line, Bar, StackBar, Point, StackArea, Area, Tooltip, View} from "viser-react";
import { Skeleton } from "antd";
import getData from '../data';
import _ from 'lodash';
import helpers from '../../../../helpers';

const DataSet = require('@antv/data-set');


export default class extends React.Component {
    state = {
        documents: [],
        loading: true,
        minValues: 0,
        maxValues: 0
    };

    async componentDidMount() {
        // await this.setState({ options: this.props.options });
        // await this.loadData();
    }

    getCumulativeComparator = c => {
        switch (c) {
            case 'lt':
                return (a, b) => a < b;
            case 'lte':
                return (a, b) => a <= b;
            case 'gt':
                return (a, b) => a > b;
            case 'gte':
                return (a, b) => a >= b;
            default:
                return (a, b) => a >= b;
        }
    };

    loadData = async (match=undefined) => {
        const { dataSet, options } = this.props;
        let { fields, config } = options,
            { axis, values, color } = fields,
            chartFields = { axis, values, color },
            minValues = 0,
            maxValues = 0;

        await this.setState({loading: true});

        // console.log('filters', filters);

        if (values.value instanceof Array) {
            const n = values.value.length;

            if (n === 1) {
                const value = values.value[0];
                chartFields.values = {
                    ...value,
                    value
                };
            }
            else if (n > 1) {
                delete fields.color;
            }
        }

        // console.log('data fields', values.value);

        let documents = await getData(
            'cartesian',
            dataSet.id,
            fields,
            match,
            config
        );

        // console.log('#documents:', documents);

        if (!!config && !!config.formula && !!config.formula.value) {
            const { formula } = config;
            // console.log('#func', `{${values.value.map(v => v.name).join(', ')}}`, `return ${formula.value};`);
            const func = new Function(`{${values.value.map(v => v.name).join(', ')}}`, `return ${formula.value};`);
            const formulaData = documents.map(d => {
                d['__formula'] = func(d);
                return d;
            });
            // console.log('formulaData', formulaData);
            this.setState({formulaData});
        }

        // console.log(documents);
        const withAnalytic = !!config && !!config.analytic && !!config.analytic.value;

        if (
            (values.value instanceof Array && values.value.length > 1) ||
            (
                withAnalytic &&
                values.value instanceof Array && values.value.length === 1
            )
        ) {
            documents.forEach(d => d[`_id_${axis.value.name}`] = d['_id']);

            const dv = new DataSet.View().source(documents),
                fields = withAnalytic?
                    [values.value[0].name, `${values.value[0].name}_${config.analytic.value}`]:
                    values.value.map(field => field.name);

            dv.transform({
                type: 'fold',
                fields,
                key: '_id_variable',
                value: 'value'
            });

            const data = dv.rows,
                targetValueFormatter = _.find(values.value, v => !!v.formatter),
                targetValueColor = _.find(values.value, v => !!v.alias);

            let newValues = {
                    value: {
                        name: 'value',
                        type: 'numeric'
                    },
                    type: 'numeric'
                },
                newColor = {
                    value: {
                        name: 'variable',
                        type: 'string'
                    },
                    type: 'string'
                };

            if (!!targetValueFormatter) {
                newValues.formatter = targetValueFormatter.formatter;
            }

            if (!!targetValueColor) {
                newColor.formatter = targetValueColor.formatter;
            }

            chartFields = {
                ...options.fields,
                color: newColor,
                values: newValues
            };

            documents = data;

            const valueArray = documents.map(d => d.value);
            minValues = _.min(valueArray);
            maxValues = _.max(valueArray);
        }
        else {
            if (!!color && !!color.value && color.value.name !== axis.value.name) {
                documents.forEach(d => {
                    d[`_id_${axis.value.name}`] = d['_id'][axis.value.name];
                    d[`_id_${color.value.name}`] = d['_id'][color.value.name];
                });
            } else {
                documents.forEach(d => d[`_id_${axis.value.name}`] = d['_id']);
            }

            const valueArray = documents.map(d => d[values.value[0].name]);
            minValues = _.min(valueArray);
            maxValues = _.max(valueArray);

            if (!!config && !!config.cumulative && !!config.cumulative.value) {
                const cmp = this.getCumulativeComparator(config.cumulative.value),
                    an = `_id_${axis.value.name}`,
                    vn = values.value[0].name,
                    cvn = `${values.value[0].name}_cumulative`;

                // console.log(an, vn, cvn, config.cumulative.value, cmp);

                documents.forEach(dc => {
                   dc[cvn] = documents
                       .filter(dt => cmp(dt[an], dc[an]))
                       .map(dt => dt[vn])
                       .reduce((a, b) => a + b, 0);
                });
            }
        }

        // console.log('chartFields', chartFields);
        // console.log('#documents: ', documents);

        await this.setState({ documents, chartFields, minValues, maxValues, loading: false });
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
                // todo: add other operators
                if (!!axis.operator && axis.operator === 'year') {
                    return 'linear';
                }
                else {
                    return 'timeCat';
                }
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

    renderChart = () => {
        const { chartType } = this.props,
            { chartFields } = this.state,
            { axis, values, color } = chartFields,
            position = `_id_${axis.value.name}*${values.value.name}`,
            { config } = this.props.options;

        // console.log(config);

        let label = [`${values.value.name}`],
            labelOptions = {};

        labelOptions.formatter = !!values.formatter? helpers[values.formatter]: v => v;

        if (!!config && !!config.density && !!config.density.value) {
            labelOptions.density = config.density.value;
        }

        if (!_.isEmpty(labelOptions)) {
            label.push(labelOptions);
        }

        // console.log('label', label);

        let props = { position, label };

        if (!!color && !!color.value) {
            props.color = `_id_${color.value.name}`;
        }

        switch (chartType) {
            case 'lines':
                return <Line {...props}/>;
            case 'bars':
                // todo: filter dodge
                if (!!color && axis.value.type !== 'float' && axis.value.type !== 'int') {
                    props.adjust = [{type: 'dodge', marginRatio: 1 / 32}];
                }
                return <Bar {...props}/>;
            case 'stackBar':
                return <StackBar {...props}/>;
            case 'stackArea':
                return (
                    <div>
                        <Line {...props} size={2} adjust={'stack'}/>
                        <Point {...props} size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape={'circle'} adjust={'stack'}/>
                        <StackArea {...props}/>
                    </div>
                );
            case 'area':
                return (
                    <div>
                        <Line {...props} size={2}/>
                        <Point {...props} size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape={'circle'}/>
                        <Area {...props}/>
                    </div>
                );
            case 'points':
                return <Point {...props} size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape={'circle'}/>;
            case 'linesAndPoints':
                return (
                    <div>
                        <Line {...props}/>
                        <Point {...props} size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape={'circle'}/>
                    </div>
                );
            default:
                return <Line {...props}/>;
        }
    };

    renderAnalytic = (valuesScale) => {
        const { chartFields, minValues, maxValues } = this.state,
            { axis, values } = chartFields,
            { config } = this.props.options;

        let analytic;

        if (!!config && !!config.analytic && !!config.analytic.value) {
            let valuesAux, formatter;

            if (values.value instanceof Array) {
                if (values.value.length === 1) {
                    valuesAux = { value: values.value[0] };
                    formatter = values.value[0].formatter;
                }
            }
            else {
                valuesAux = values;
                formatter = values.formatter;
            }

            if (!!valuesAux) {
                const { value } = config.analytic,
                    { documents } = this.state,
                    x = `_id_${axis.value.name}`,
                    yp = `${valuesAux.value.name}_${value}`,
                    y = valuesAux.value.name,
                    scale = [
                        {
                            dataKey: y,
                            type: this.getXScale(valuesAux),
                            alias: `${value.toUpperCase()}(${valuesAux.value.name})`,
                            min: minValues,
                            max: maxValues,
                            formatter: !! formatter && helpers[formatter]
                        }
                    ];
                analytic = (
                    <View
                        data={documents.map(d => ({[x]: d[x], [y]: d[yp]}))}
                        scale={valuesScale}>
                        <Axis dataKey={y} show={false}/>
                        <Line
                            position={`${x}*${y}`}
                            style={{stroke: '#969696', lineDash: [3, 3]}}
                            color={'#969696'}/>
                        <Point
                            position={`${x}*${y}`}
                            size={4}
                            style={{ stroke: '#fff', lineWidth: 1 }}
                            shape={'circle'}
                            color={'#969696'}/>
                    </View>
                );
            }
        }

        return analytic;
    };

    chartWithFormula = () => {
        const { config } = this.props.options;
        return !!config && !!config.formula && !!config.formula.value;
    };

    renderFormula = () => {
        const { config } = this.props.options;
        let formula;

        if (this.chartWithFormula()) {
            const { formulaData, chartFields } = this.state,
                { axis } = chartFields,
                scale = {
                    dataKey: '__formula',
                    alias: config.formula.value,
                    formatter: v => v.toFixed(2)
                };

            formula = !!formulaData && (
                <View data={formulaData} scale={scale}>
                    <Axis dataKey={'__formula'} position={'right'}/>
                    <Line
                        position={`_id_${axis.value.name}*__formula`}
                        style={{stroke: '#969696', lineDash: [3, 3]}}
                        color={'#969696'}/>
                    <Point
                        position={`_id_${axis.value.name}*__formula`}
                        size={4}
                        style={{ stroke: '#fff', lineWidth: 1 }}
                        shape={'circle'}
                        color={'#969696'}/>
                </View>
            );
        }

        return formula;
    };

    chartWithCumulative = () => {
        const { config } = this.props.options;
        return !!config && !!config.cumulative && !!config.cumulative.value;
    };

    renderCumulative = () => {
        const { config } = this.props.options;
        let cumulative;

        if (this.chartWithCumulative()) {
            const { documents, chartFields } = this.state,
                { axis, values } = chartFields,
                scale = {
                    dataKey: `${values.value.name}_cumulative`,
                    alias: `ACUM(${!!values.alias? values.alias: values.value.name}, "${config.cumulative.value}")`,
                    formatter: v => v.toFixed(1)
                };

            cumulative = (
                <View data={documents} scale={scale}>
                    <Axis dataKey={`${values.value.name}_cumulative`} position={'right'}/>
                    <Line
                        position={`_id_${axis.value.name}*${values.value.name}_cumulative`}
                        color={'#e22626'}/>
                    {/*<Point
                        position={`_id_${axis.value.name}*${values.value.name}_cumulative`}
                        size={4}
                        style={{ stroke: '#fff', lineWidth: 1 }}
                        shape={'circle'}
                        color={'#969696'}/>*/}
                </View>
            );
        }

        return cumulative;
    };

    _render = () => {
        const {loading, minValues, maxValues} = this.state;

        if (loading) {
            return null;
        }

        const {width, height, options} = this.props,
            { config } = options,
            {documents, chartFields} = this.state,
            { axis, values, color } = chartFields;

        let axisScale = {
                dataKey: `_id_${axis.value.name}`,
                type: this.getXScale(axis)
            },
            valuesScale = {
                dataKey: values.value.name,
                type: this.getYScale(values),
                // min: minValues,
                // max: maxValues,
                sync: true
            };

        if (!!values.formatter) {
            valuesScale.formatter = helpers[values.formatter];
        }

        if (!!values.alias) {
            valuesScale.alias = values.alias;
        }

        if (!!config && !!config.scale && !!config.scale.value) {
            valuesScale.type = config.scale.value;
        }

        return (
            <div style={{width, height}}>
                <Chart
                    forceFit={!width}
                    width={width}
                    height={height}
                    data={documents}
                    padding={[
                        20, // top
                        (this.chartWithFormula() || this.chartWithCumulative())? 80: 20, // right
                        !!color && !!color.value? 95: 65, // bottom
                        80 // left
                    ]}
                    scale={[axisScale, valuesScale]}>
                    <Tooltip/>
                    <Axis
                        dataKey={`_id_${axis.value.name}`}
                        title={{text: !!axis.alias? axis.alias: axis.value.name}}/>
                    <Legend/>
                    <View data={documents} scale={[axisScale, valuesScale]}>
                        {this.renderChart()}
                    </View>
                    {/*this.renderAnalytic(valuesScale)*/}
                    {this.renderFormula()}
                    {this.renderCumulative()}
                </Chart>
            </div>
        );
    };

    render() {
        const { loading } = this.state;

        return (
            <Skeleton loading={loading} active>
                {this._render()}
            </Skeleton>
        );
    }
}
