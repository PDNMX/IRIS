import React from 'react';
import { Axis, Chart, Legend, Tooltip, Pie, Coord } from 'viser-react';
import {Skeleton} from 'antd';
import getData from '../data';


const DataSet = require('@antv/data-set');

export default class extends React.Component {
    state = {
        documents: [],
        loading: true
    };

    async componentDidMount() {
        // await this.loadData();
    }

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options;

        await this.setState({loading: true});

        let documents = await getData(
            'cartesian',
            dataSet.id,
            {
                axis: fields.details,
                values: {
                    type: 'array',
                    value: [fields.values.value]
                }
            },
            match
        );
        const detailsName = `_id_${fields.details.value.name}`;

        // console.log(documents);
        // todo: post process id.
        documents.forEach(d => d[detailsName] = d['_id']);

        const dv = new DataSet.View().source(documents);

        dv.transform({
            type: 'percent',
            field: `${fields.values.value.name}`,
            dimension: detailsName,
            as: 'percent'
        });

        // console.log(dv.rows);

        await this.setState({documents: dv.rows, loading: false});
    };

    render() {
        const {documents, loading} = this.state,
            { fields } = this.props.options,
            detailsName = `_id_${fields.details.value.name}`,
            scale = [
                {
                    dataKey: 'percent',
                    min: 0,
                    formatter: '.0%',
                }
            ],
            { width, height } = this.props;

        return (
            <Skeleton loading={loading} active>
                <Chart
                    forceFit={!width}
                    width={width}
                    height={height}
                    data={documents}
                    scale={scale}>
                    <Tooltip showTitle={false}/>
                    <Axis/>
                    <Legend dataKey={detailsName}/>
                    <Coord type='theta' radius={0.75} innerRadius={0.6}/>
                    <Pie
                        position={'percent'}
                        color={detailsName}
                        style={{stroke: '#fff', lineWidth: 1}}
                        label={['percent', {
                            formatter: (val, item) => {
                                return item.point[detailsName] + ': ' + val;
                            }
                        }]}
                    />
                </Chart>
            </Skeleton>
        );
    }
}