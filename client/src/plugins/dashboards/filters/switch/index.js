import React from 'react';
import {Typography, Tooltip, Select} from 'antd';
import {connect} from 'react-redux';
import {addFilter} from '../../store/actions';

const { Text } = Typography;

export default connect(null, {addFilter})(
    class extends React.Component {
        state = {
            checked: false
        };

        setValue = (value) => {
            this.setState({value});
        };

        loadData = (match=undefined) => {
            //...
        };

        handleChange = (value) => {
            const { filter, itemId, filterContext } = this.props,
                { dataSetId, field, paneId } = filter,
                response = {
                    itemId,
                    dataSetId,
                    paneId,
                    filter: { [field]: value === '1' }
                };

            if (filterContext === 'pane') {
                if (!!value) {
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
            const { dataSetId, field, alias } = this.props.filter;

            return (
                <div style={{paddingLeft: 8, paddingRight: 8, textAlign: 'left'}}>
                    <div style={{paddingBottom: 4}}>
                        <Tooltip title={dataSetId}>
                            <Text type={'secondary'}>{!!alias? alias: field.capitalize()}</Text>
                        </Tooltip>
                    </div>
                    <Select
                        onChange={this.handleChange}
                        placeholder={`Seleccionar ${field}`}
                        style={{width: '100%'}}
                        allowClear>
                        {
                            [{label: 'Verdadero', value: 1}, {label: 'Falso', value: 0}].map(category =>
                                <Select.Option key={category.value}>{category.label}</Select.Option>
                            )
                        }
                    </Select>
                </div>
            );
        }
    }
)