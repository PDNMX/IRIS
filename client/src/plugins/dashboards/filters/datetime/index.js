import React from 'react';
import {Typography, Tooltip, DatePicker, Spin, Icon} from 'antd';
import moment from 'moment';
import auth from '../../../../auth';
import rp from 'request-promise';


const { Text } = Typography;
const { RangePicker } = DatePicker;

export default class extends React.Component {
    state = {
        min: moment(),
        max: moment(),
        loading: false
    };

    setValue = range => {
        // console.log('range value: ', range);
        if (!!range) {
            if ('$gte' in range && '$lte' in range) {
                this.setState({value: [moment(range.$gte), moment(range.$lte)]});
            }
        }
        else {
            const { min, max } = this.state;
            this.setState({value: [min, max]});
        }
    };

    loadData = async (match=undefined) => {
        const { filter } = this.props,
            { dataSetId, field } = filter;

        let stages = [
            {
                $group: {
                    _id: null,
                    min: { $min: `$${field}` },
                    max: { $max: `$${field}` }
                }
            }
        ];

        if (!!match) {
            stages.unshift(match);
        }

        // console.log('stages', stages);
        await this.setState({loading: true});

        const data = await rp({
            method: 'POST',
            uri: `${auth.getHost()}/dataset/${dataSetId}/aggregate`,
            body: stages,
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`
            },
            json: true
        });

        // console.log(data);

        if (!!data && data.length === 1) {
            const min = moment(data[0].min),
                max = moment(data[0].max);

            // console.log('[min, max]', min.format(), max.format());
            await this.setState({
                value: [min, max],
                min,
                max,
                loading: false
            });
        }
        else {
            await this.setState({
                value: [],
                min: moment(),
                max: moment(),
                loading: false
            });
        }
    };

    handleChange = (value) => {
        // console.log('#value: ', value);
        const { filter, itemId, filterContext } = this.props,
            { dataSetId, field, paneId } = filter,
            response = {
                itemId,
                dataSetId,
                paneId,
                filter: {
                    [field]: value.length === 2?
                        {
                            $gte: value[0].format(),
                            $lte: value[1].format()
                        }:
                        undefined
                }
            };

        if (filterContext === 'pane') {
            if (!!value && value.length > 0) {
                this.props.addFilter(response);
            }
            else {
                this.props.removeFilter(response);
            }
        }
        else if (filterContext === 'chart' && this.props.onChange instanceof Function) {
            this.props.onChange(response.filter);
        }

        this.setState({value});
    };

    render() {
        const { value, min, max, loading } = this.state,
            { dataSetId, field, alias } = this.props.filter;

        return (
            <div style={{paddingLeft: 8, paddingRight: 8, textAlign: 'left'}}>
                <div style={{paddingBottom: 4}}>
                    <Tooltip title={dataSetId}>
                        <Text type={'secondary'}>{!!alias? alias: field.capitalize()}</Text> {loading && <Spin indicator={<Icon type={'loading'} spin/>} />}
                    </Tooltip>
                </div>
                <RangePicker
                    disabledDate={currentDate => currentDate < min || currentDate > max}
                    value={value}
                    style={{width: '100%'}}
                    onChange={this.handleChange} />
            </div>
        );
    }
}