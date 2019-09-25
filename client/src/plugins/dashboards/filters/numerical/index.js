import React from 'react';
import {Slider, Tooltip, Typography, Icon, Spin, InputNumber, Row, Col} from 'antd';
import rp from "request-promise";
import auth from "../../../../auth";
import helpers from '../../../../helpers';

const { Text } = Typography;

export default class extends React.Component {
    state = {
        min: 0,
        max: 0,
        loading: true,
        marks: {},
        value: [0, 0]
    };

    setValue = range => {
        if (!!range) {
            // console.log('range value: ', range);

            if ('$gte' in range && '$lte' in range) {
                this.setState({
                    value: [range.$gte, range.$lte],
                    _min: range.$gte,
                    _max: range.$lte
                });
            }
        }
        else {
            const { min, max } = this.state;

            this.setState({
                value: [min, max],
                _min: min,
                _max: max
            });
        }
    };

    /*async componentDidMount() {
        await this.loadStats();
    }*/

    loadData = async (match=undefined) => {
        const { filter } = this.props,
            { dataSetId, field } = filter;
        let stages = [
            {
                $group: {
                    _id: null,
                    max: { $max: `$${field}` },
                    min: { $min: `$${field}` }
                }
            }
        ];

        if (!!match) {
            stages.unshift(match);
        }

        const data = await rp({
            method: 'POST',
            uri: `${auth.getHost()}/dataset/${dataSetId}/aggregate`,
            body: stages,
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`
            },
            json: true
        });

        if (!!data && data.length === 1) {
            const min = Number(data[0].min.toPrecision(2)),
                max = Number(data[0].max.toPrecision(2));

            // console.log('min, max', min, max);

            await this.setState({
                max,
                min,
                loading: false,
                marks: this.getMarks(min, max),
                value: [min, max]
            });
        }
    };

    handleOnAfterChange = (range) => {
        const { filter, itemId, filterContext } = this.props,
            { dataSetId, field, paneId } = filter,
            response = {
                itemId,
                dataSetId,
                paneId,
                filter: { [field]: { $gte: range[0], $lte: range[1] } }
            };

        if (filterContext === 'pane') {
            this.props.addFilter(response);
        }
        else if (filterContext === 'chart' && this.props.onChange instanceof Function) {
            this.props.onChange(response.filter);
        }

        // console.log('#range', range);

        this.setState({value: range});
    };

    getMarks = (min, max) => {
        const { formatter } = this.props.filter,
            interval = parseInt(((max - min) / 5).toString()),
            f = !!formatter? helpers[formatter]: v => v.toString();
        let marks = {};

        for (let i = parseInt(min.toString()); i < max; i+=interval) {
            if(max - i >= interval) {
                marks[i] = {
                    style: {width: '100%'},
                    label: f(i)
                };
            }
        }

        marks[max] = {
            style: {width: '100%'},
            label: f(max)
        };

        return marks;
    };

    handleSet_Min = async (_min) => {
        if (!!_min && typeof _min === 'number') {
            const {_max, max} = this.state;

            await this.setState({_min});
            this.handleOnAfterChange([_min, !!_max ? _max : max]);
        }
    };

    handleSet_Max = async (_max) => {
        if (!!_max && typeof _max === 'number') {
            const {_min, min} = this.state;

            await this.setState({_max});
            this.handleOnAfterChange([!!_min ? _min : min, _max]);
        }
    };

    handleClear = async () => {
        const { min, max } = this.state;

        await this.setState({_min: min, _max: max});
        this.handleOnAfterChange([min, max]);
    };

    render() {
        const { min, max, loading, marks, value, _max, _min } = this.state,
            { dataSetId, field, dataType, alias, controlType } = this.props.filter;

        return (
            <div style={{paddingLeft: 8, paddingRight: 8, textAlign: 'left'}}>
                <Tooltip title={dataSetId}>
                    <Text type={'secondary'}>{!!alias? alias: field.capitalize()} </Text>{loading && <Spin indicator={<Icon type="loading" spin/>} />}
                </Tooltip>
                <Tooltip title={'Reiniciar'}>
                    <a onClick={this.handleClear}>{!loading && `[${min}, ${max}]`}</a>
                </Tooltip>
                {
                    !loading &&
                        <div>
                            {
                                controlType === 'inputs'?
                                    <div style={{display: 'flex', flexDirection: 'center'}}>
                                        <div style={{flex: 1}}>
                                            <InputNumber
                                                style={{width: '100%'}}
                                                placeholder={'Mínimo...'}
                                                min={min}
                                                max={max}
                                                value={!!_min?_min: min}
                                                onChange={this.handleSet_Min} />
                                        </div>
                                        <div style={{textAlign: 'center', flex: .1}}>
                                            <Text strong>:</Text>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <InputNumber
                                                style={{width: '100%'}}
                                                placeholder={'Máximo...'}
                                                min={min}
                                                max={max}
                                                value={!!_max?_max:max}
                                                onChange={this.handleSet_Max}/>
                                        </div>
                                    </div>:
                                    <Slider
                                        range
                                        marks={marks}
                                        step={dataType==='int'? 1: 0.1}
                                        min={min}
                                        max={max}
                                        defaultValue={[min, max]}
                                        value={value}
                                        onChange={value => this.setState({value})}
                                        onAfterChange={this.handleOnAfterChange}/>
                            }
                        </div>
                }
            </div>
        );
    }
}