/* eslint-disable */
import React from 'react';
import { Axis, Chart, Tooltip, Line, Point, Coord, Legend} from 'viser-react/es/index';
import getData from '../data';
import numeral from 'numeral';

export default class extends React.Component {
    state = {
        documents: [],
        loading: true
    };

    async componentDidMount() {
        // await this.loadData();
    }

    loadData = async (match=undefined) => {
        try {

            const { dataSet } = this.props,
                { fields } = this.props.options,
                { axis, color } = fields;

            await this.setState({ loading: true });

            let documents = await getData('radar', dataSet.id, fields, match);

            if (!!color && color.value.name !== axis.value.name) {
                documents.forEach(d => {
                    d[`_id_${axis.value.name}`] = d['_id'][axis.value.name];
                    d[`_id_${color.value.name}`] = d['_id'][color.value.name];
                });
            }
            else {
                documents.forEach(d => d[`_id_${axis.value.name}`] = d['_id']);
            }

            console.log(documents);

            this.setState({documents, loading: false});
        }catch (e) {
            console.log(e)
        }
    };

    render() {
        const { documents, loading } = this.state,
            { axis, values, color } = this.props.options.fields,
            { width, height } = this.props;

        const axis1Opts = {
            dataKey: `_id_${axis.value.name}`,
            line: null,
            tickLine: null,
            grid: {
                lineStyle: {
                    lineDash: null
                },
                hideFirstLine: false,
            },
        };

        const axis2Opts = {
            dataKey: values.value.name,
            line: null,
            tickLine: null,
            grid: {
                type: 'polygon',
                lineStyle: {
                    lineDash: null,
                },
            },
        };

        const position = `_id_${axis.value.name}*${values.value.name}`;

        let props = {
            position,
        };

        if (!!color) {
            props.color = `_id_${color.value.name}`;
        }

        let axisScale = {
                dataKey: `_id_${axis.value.name}`,
                // type: this.getScale(axis)
            },
            valuesScale = {
                dataKey: values.value.name,
                // type: this.getScale(values)
            };

        if (!!values.formatter) {
            const formatter = new Function('value', 'lib', `return ${values.formatter};`);
            valuesScale.formatter = (value) => formatter(value, {numeral});
        }

        console.log(props);

        return (
            <div>
                {
                    !loading &&
                    <Chart
                        forceFit={!width}
                        width={width}
                        height={height}
                        data={documents}
                        scale={[axisScale, valuesScale]}>
                        <Tooltip/>
                        <Axis {...axis1Opts} />
                        <Axis {...axis2Opts} />
                        {
                            !!color && <Legend dataKey={`_id_${color.value.name}`} marker={'circle'} offset={30} />
                        }
                        <Coord type={'polar'} radius={0.8}/>
                        <Line {...props} size={2} />
                        <Point {...props} size={4} shape={'circle'}/>
                    </Chart>
                }
            </div>
        );
    }
}