import React from 'react';
import {Progress, Skeleton, Typography} from 'antd';
import getData from '../data';
import _ from 'lodash';
import {Global} from 'viser-react';

const DataSet = require('@antv/data-set');
const { Text } = Typography;

export default class extends React.Component {
    state = {
        documents: [],
        loading: true
    };

    componentDidMount() {
        if (!!Global && 'defaultColor' in Global) {
            const { defaultColor } = Global;
            this.setState({defaultColor})
        }
    }

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options;

        await this.setState({loading: true});

        // todo: add gauges/pie getter
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

        // todo: post process id.
        documents.forEach(d => d[detailsName] = d['_id']);

        const dv = new DataSet.View().source(documents);

        dv.transform({
            type: 'percent',
            field: `${fields.values.value.name}`,
            dimension: detailsName,
            as: 'percent'
        });

        documents = _.orderBy(dv.rows, 'percent', 'desc');
        // console.log(documents);

        await this.setState({documents, loading: false});
    };

    render() {
        const {documents, loading, defaultColor} = this.state,
            { fields } = this.props.options,
            detailsName = `_id_${fields.details.value.name}`,
            { width, height } = this.props;

        return (
            <div style={{textAlign: 'center'}}>
                <Skeleton loading={loading} active>
                    {
                        documents.map(d =>
                            <div
                                key={d[detailsName]}
                                style={{padding: 6, textAlign: 'center'}}
                                className={'ant-progress ant-progress-circle'}>
                                <Progress
                                    strokeColor={defaultColor}
                                    strokeLinecap={'square'}
                                    type={'circle'}
                                    percent={d['percent'] * 100}
                                    format={p => `${p.toFixed(1)}%`}/>
                                <div>
                                    <Text type={'secondary'}>{!!d[detailsName]?d[detailsName]: 'NA'}</Text>
                                </div>
                            </div>
                        )
                    }
                </Skeleton>
            </div>
        );
    }
}