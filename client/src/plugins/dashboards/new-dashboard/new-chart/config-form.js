import React from "react";
import { Form, Select, Row, Col, Input } from 'antd';
import _ from 'lodash';


export default Form.create({
    name: 'config-form',
    onValuesChange: (props, changedValues, allValues) => {

        if (props.onChangeValues instanceof Function) {
            // console.log('allFields', allValues);
            let { config } = props;

            _.forEach(allValues, (value, name) => config[name].value = value);

            props.onChangeValues(config);
        }
    }
})(
    class extends React.Component {

        getOptionColumnSize = (size) => {
            switch (size) {
                case 1:
                    return 24;
                case 2:
                    return 12;
                default:
                    return 8;
            }
        };

        renderField = (field, name) => {
            const { getFieldDecorator } = this.props.form;

            switch (field.type) {
                case 'categorical':
                    return (
                        <Form.Item label={field.label}>
                            {
                                getFieldDecorator(name)(
                                    <Select allowClear placeholder={!!field.label? field.label: name}>
                                        {
                                            field.values.map(value =>
                                                <Select.Option key={value} value={value}>
                                                    {value}
                                                </Select.Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    );
                case 'string':
                    return (
                        <Form.Item label={field.label}>
                            {
                                getFieldDecorator(name)(
                                    <Input placeholder={!!field.label? field.label: name} />
                                )
                            }
                        </Form.Item>
                    );
                default:
                    return null;
            }
        };

        render() {
            const { config } = this.props,
                n = Object.keys(config).length;

            return (
                <div className={'config-content'}>
                    <Form>
                        <Row gutter={8}>
                            {
                                _.map(config, (field, name) =>
                                    <Col key={name} xs={this.getOptionColumnSize(n)} style={{paddingBottom: 8}}>
                                        {this.renderField(field, name)}
                                    </Col>
                                )
                            }
                        </Row>
                    </Form>
                </div>
            );
        }
    }
)