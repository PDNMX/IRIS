import React from 'react';
import {Icon, Spin, Statistic} from 'antd';
import getData from '../data';
import helpers from '../../../../helpers';


export default class extends React.Component {
    state = {
        value: 0,
        loading: true
    };

    async componentDidMount() {
        // await this.loadData();
    }

    loadData = async (match=undefined) => {
        const { dataSet } = this.props,
            { fields } = this.props.options;

        await this.setState({loading: true});

        const documents = await getData('variable', dataSet.id, fields, match),
            value = (!!documents && documents.length === 1)? documents[0][fields.variable.value.name]: 0;

        await this.setState({value, loading: false});
    };

    renderValue = (variable, value, loading) => {

        if (loading) {
            return ' ';
        }

        const { formatter } = variable;

        if (!!formatter && formatter in helpers) {
            return helpers[formatter](value);
        }
        else {
            return value;
        }
    };

    getTitle = (variable) => {
        const { alias, value } = variable;

        return !!alias? alias: value.name.capitalize();
    };

    render() {
        const {value, loading} = this.state,
            { variable } = this.props.options.fields;

        return (
            <div style={{textAlign: 'left'}}>
                <Statistic
                    title={this.getTitle(variable)}
                    prefix={loading && <Spin indicator={<Icon type='loading' spin/>} />}
                    value={this.renderValue(variable, value, loading)} />
            </div>
        );
    }
}

