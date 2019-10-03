import React from 'react';
import { Descriptions, Skeleton } from 'antd';
import getData from '../data';
import helpers from '../../../../helpers';


export default class extends React.Component {
    state = {
        loading: true,
        documents: []
    };

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options;

        await this.setState({ loading: true });

        let documents = await getData('getOne', dataSet.id, fields, match);

        await this.setState({documents, loading: false});
    };

    renderValue = (value, formatter) => {
        if (!!formatter && formatter in helpers) {
            return helpers[formatter](value);
        }
        else {
            return value;
        }
    };

    render() {
        const { documents, loading } = this.state,
            { columns } = this.props.options.fields;

        // console.log(columns);

        return (
            <Skeleton loading={loading} active>
                <div style={{textAlign: 'left'}}>
                    {
                        documents.length >= 1 &&
                        <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                            {
                                columns.value.map(col =>
                                    <Descriptions.Item key={col.name} label={!!col.alias? col.alias: col.name}>
                                        {this.renderValue(documents[0][col.name], col.formatter)}
                                    </Descriptions.Item>
                                )
                            }
                        </Descriptions>
                    }
                </div>
            </Skeleton>
        );
    }
}
