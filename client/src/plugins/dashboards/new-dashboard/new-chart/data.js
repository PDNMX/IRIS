import React from 'react';
import { Select } from 'antd/lib/index';
import auth from "../../../../auth";
import queries from "./queries";

const Option = Select.Option;
const hubId = 1;

export default class extends React.Component {
    state = {
        dataSets: [],
        value: this.props.dataSet,
        loading: false
    };

    load = async () => {
        const { value } = this.state;

        await this.setState({loading: true});

        if (!!value && value.length > 0) {
            let dataSetSelector = {
                where: {
                    name: {$iLike: `%${value}%`}
                }
            };

            auth.getData(
                queries.getDataSets(
                    hubId,
                    dataSetSelector
                )
            ).then(res => {
                const { dataSets } = res.data.hub;

                this.setState({
                    dataSets,
                    loading: false
                });
            });
        }
        else {
            this.setState({
                dataSets: [],
                loading: false
            });
        }

    };
    handleSearch = (value) => {
        this.setState({value}, this.load);
    };
    handleChange = (value) => {
        this.setState({ value });
    };
    handleSelect = (value, option) => {
        const { onChange } = this.props;

        if(!!onChange) {
            onChange(option.props.dataRef);
        }
    };
    render() {
        const { dataSets } = this.state;

        return(
            <div style={{paddingTop: 64, textAlign: 'center'}}>
                <Select
                    allowClear
                    showSearch
                    value={this.state.value}
                    placeholder={'Buscar datos'}
                    style={{width: 480}}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    notFoundContent={null}>
                    {
                        dataSets.map(d => <Option dataRef={d} key={d.id}>{d.name}</Option>)
                    }
                </Select>
            </div>
        );
    }
}