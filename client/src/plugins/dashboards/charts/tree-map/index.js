import React from 'react';
import {Chart, Tooltip, Polygon} from 'viser-react';
import {Skeleton} from 'antd';
import getData from '../data';
import helpers from '../../../../helpers';


const DataSet = require('@antv/data-set');

export default class extends React.Component {
    state = {
        documents: [],
        loading: true
    };

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options,
            { values, details } = fields;

        await this.setState({loading: true});

        let documents = await getData(
            'cartesian',
            dataSet.id,
            {
                axis: details,
                values: {
                    type: 'array',
                    value: [values.value]
                }
            },
            match
        );
        const detailsName = `_id_${details.value.name}`;

        // console.log(documents);
        documents.forEach(d => d[detailsName] = d['_id']);

        const dv = new DataSet.View().source(
            {
                [detailsName]: 'root',
                children: documents
            },
            {
                type: 'hierarchy'
            }
        );

        dv.transform({
            field: values.value.name,
            type: 'hierarchy.treemap',
            tile: 'treemapResquarify',
            as: ['x', 'y'],
        });

        documents = dv.getAllNodes().map(node => ({
            ...node,
            [detailsName]: node.data[detailsName],
            [values.value.name]: node.data[values.value.name],
        }));

        // console.log(documents);

        await this.setState({documents, loading: false});
    };

    render () {
        const {documents, loading} = this.state,
            { fields } = this.props.options,
            { details, values } = fields,
            detailsName = `_id_${details.value.name}`,
            { width, height } = this.props;

        let label = [detailsName, {
            offset: 0,
            textStyle: {
                textBaseline: 'middle',
                fill: '#fff'
            }
        }];
        let tooltip = [
            values.value.name
        ];
        let detailsScale = {
                dataKey: detailsName
            },
            valuesScale = {
                dataKey: values.value.name,
                nice: false,
            };

        if (!!values.formatter && values.formatter in helpers) {
            label[1].formatter = (val, item) => {
                if (val !== 'root') {
                    return `${val}: ${helpers[values.formatter](item.point[values.value.name])}`;
                }
            };

            valuesScale.formatter = helpers[values.formatter];
        }
        else {
            label[1].formatter = (val, item) => {
                if (val !== 'root') {
                    return `${val}: ${item.point[values.value.name]}`;
                }
            }
        }

        const style = {
            lineWidth: 1,
            stroke: '#fff',
        };

        if (!!values.alias) {
            valuesScale.alias = values.alias;
        }

        if (!!details.alias) {
            detailsScale.alias = details.alias;
        }

        // console.log([detailsScale, valuesScale]);

        return (
            <Skeleton loading={loading} active>
                <Chart
                    forceFit={!width}
                    width={width}
                    height={height}
                    data={documents}
                    scale={[detailsName, valuesScale]}
                    padding={0}>
                    <Tooltip showTitle={false} />
                    <Polygon position={'x*y'} color={detailsName} tooltip={tooltip} style={style} label={label} />
                </Chart>
            </Skeleton>
        );
    }
}