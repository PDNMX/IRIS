import React from 'react';
import { Modal, Form, Select, Tag, Input, Checkbox, Switch } from 'antd';
import auth from '../../../../auth';
import queries from './queries';
import rp from "request-promise";
import _ from 'lodash';

const hubId = 1;
const dataTypeColor = {
    float: 'blue',
    int: 'green',
    object: 'pink',
    string: 'orange',
    bool: 'purple',
    datetime: 'cyan'
};

export default Form.create({ name: 'new_filter' })(
    class extends React.Component {
        state = {
            visible: this.props.visible,
            dataSets: {},
            fields: {}
        };

        async componentDidMount() {
            await this.loadDataSets();
        }

        async componentDidUpdate(prevProps) {
            if(!prevProps.visible && this.props.visible) {
                // console.log('open dialog');
                this.setState({ visible: true });
            }
        }

        loadDataSets = async () => {
            try {
                const res = await auth.getData(
                    queries.getDataSets(hubId, {})
                );

                await this.setState({dataSets: _.keyBy(res.data.hub.dataSets, 'id')});
            }
            catch (e) {
                console.log(e);
            }
        };

        loadSchema = async (schemaId) => {
            // console.log(option.key);

            try {
                const schema = await rp({
                    method: 'POST',
                    uri: `${auth.getHost()}/dataset/schemas/${schemaId}`,
                    body: {
                        limit: 10
                    },
                    headers: {
                        'Authorization': `Bearer ${auth.getToken()}`
                    },
                    json: true
                });

                // console.log(schema);

                if (!!schema) {
                    this.setState({
                        fields: schema.fields, //_.map(schema.fields, (type, name) => ({name, type})),
                        field: undefined
                    });
                } else {
                    this.setState({fields: {}, field: undefined});
                }
            }
            catch (e) {
                console.log(e);

                this.setState({fields: {}, field: undefined});
            }
        };

        handleOk = async () => {
            await this.handleClose();
        };

        handleCancel = () => {
            this.handleClose();
        };

        handleClose = () => {
            this.setState({
                visible: false
            });

            this.props.form.resetFields();

            if (this.props.onClose instanceof Function) {
                this.props.onClose();
            }
        };

        getFilterType = (ft) => {
            switch (ft) {
                case 'string':
                    return 'categorical';
                case 'object':
                    return 'categorical';
                case 'float':
                    return 'numerical';
                case 'int':
                    return 'numerical';
                case 'bool':
                    return 'switch';
                case 'datetime':
                    return 'datetime';
                default:
                    return 'categorical';
            }
        };

        handleSubmit = e => {
            e.preventDefault();

            this.props.form.validateFields((err, values) => {
                if (!err) {
                    // console.log('Received values of form: ', values);

                    if (this.props.onCreate instanceof Function) {

                        const { field } = values,
                            { fields } = this.state;

                        if (!values.alias || values.alias.length === 0) {
                            delete values.alias;
                        }

                        this.props.onCreate({
                            ...values,
                            dataSetId: values.schema.split('-')[0],
                            filterType: this.getFilterType(fields[field]),
                            dataType: fields[field]
                        });
                    }

                    this.handleClose();
                }
            });
        };

        render() {
            const { visible, dataSets, fields, field, filterType } = this.state,
                { getFieldDecorator } = this.props.form;

            return (
                <Modal
                    title={'Crear filtro'}
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label={'Datos'}>
                            {
                                getFieldDecorator(
                                    'schema',
                                    {
                                        rules: [{ required: true, message: 'Los datos son requeridos' }],
                                    }
                                )(
                                    <Select onSelect={async (schemaId, option) => await this.loadSchema(option.key)}>
                                        {
                                            _.map(
                                                dataSets,
                                                ds => <Select.Option key={ds.schema} value={`${ds.id}-${ds.schema}`}>{ds.name}</Select.Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item label={'Campo'}>
                            {
                                getFieldDecorator(
                                    'field',
                                    {
                                        rules: [{ required: true, message: 'El campo es requerido' }],
                                    }
                                )(
                                    <Select onSelect={(value) => this.setState({field: value})}>
                                        {
                                            _.map(
                                                fields,
                                                (type, name) =>
                                                    <Select.Option
                                                        key={name}
                                                        value={name}>
                                                        <Tag style={{width: 64, textAlign: 'center'}} color={dataTypeColor[type]}>{type}</Tag> {name}
                                                    </Select.Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        {
                            !!field &&
                            <Form.Item label={'Alias'}>
                                {
                                    getFieldDecorator(
                                        'alias',
                                        {
                                            initialValue: field
                                        }
                                    )(
                                        <Input placeholder={'Escribe un alias...'}/>
                                    )
                                }
                            </Form.Item>
                        }
                        {
                            !!field && this.getFilterType(fields[field]) === 'categorical' &&
                            <Form.Item label={'Selección multiple'}>
                                {
                                    getFieldDecorator(
                                        'multipleSelection',
                                        {
                                            initialValue: false
                                        }
                                    )(
                                        <Checkbox/>
                                    )
                                }
                            </Form.Item>
                        }
                        {
                            !!field && this.getFilterType(fields[field]) === 'numerical' &&
                            <div>
                                <Form.Item label={'Tipo de control'}>
                                    {
                                        getFieldDecorator(
                                            'controlType',
                                            {initialValue: 'line'}
                                        )(
                                            <Select>
                                                <Select.Option value={'line'}>Línea</Select.Option>
                                                <Select.Option value={'inputs'}>Entradas de texto</Select.Option>
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                                <Form.Item label={'Formato'}>
                                    {
                                        getFieldDecorator(
                                            'formatter'
                                        )(
                                            <Input placeholder={'Escribe el nombre de la función...'}/>
                                        )
                                    }
                                </Form.Item>
                            </div>
                        }
                    </Form>
                </Modal>
            );
        }
    }
);