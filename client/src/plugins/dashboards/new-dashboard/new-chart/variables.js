import React from 'react';
import {Checkbox, Col, Row, Table, Tag} from 'antd/lib/index';
import auth from "../../../../auth";
import rp from 'request-promise';
import _ from 'lodash';


export default class extends React.Component {
    state = {
        loading: true,
        dataSet: this.props.dataSet,
        checkedList: this.props.variables,
        plainOptions: [],
        indeterminate: false,
        checkAll: true,
        documents: [],
        columns: []
    };

    async componentDidMount() {
        await this.loadDocuments();
    }

    getSchema = () => {
        try {

        }
        catch (e) {
            console.log(e);
        }
    };

    getColumns = () => {
        const { checkedList, columns } = this.state;

        return columns.filter(c => checkedList.includes(c.key));
    };

    loadDocuments = async () => {
        const { dataSet, checkedList } = this.state;


        await this.setState({loading: true});

        try {
            const documents = await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSet.id}`,
                body: {
                    limit: 10
                },
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });

            const schema = await rp({
                    method: 'POST',
                    uri: `${auth.getHost()}/dataset/schemas/${dataSet.schema}`,
                    body: {
                        limit: 10
                    },
                    headers: {
                        'Authorization': `Bearer ${auth.getToken()}`
                    },
                    json: true
                }),
                plainOptions = _.map(schema.fields, (f, n) => n);


            await this.setState({
                documents,
                schema,
                plainOptions,
                checkedList: checkedList.length === 0? plainOptions: checkedList,
                loading: false,
                columns: _.map(schema.fields, (f, n) => (
                    {
                        title: <div>{n}<div><Tag color={'cyan'}>{f}</Tag></div></div>,
                        dataIndex: n,
                        key: n
                    }
                ))
            });

            if (this.props.onChange instanceof Function) {
                this.props.onChange(this.state.checkedList);
            }
        }
        catch (e) {
            console.log(e);
            await this.setState({documents: [], loading: false});
        }

    };

    onChange = (checkedList) => {
        const { plainOptions } = this.state;

        this.setState(
            {
                checkedList,
                indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
                checkAll: checkedList.length === plainOptions.length,
            },
            () => {
                if (this.props.onChange instanceof Function) {
                    this.props.onChange(this.state.checkedList);
                }
            }
        );
    };

    onCheckAllChange = async (e) => {
        const { plainOptions } = this.state;

        await this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });

        if (this.props.onChange instanceof Function) {
            this.props.onChange(this.state.checkedList);
        }
    };

    render() {
        const {loading, documents, checkedList, checkAll, indeterminate, plainOptions} = this.state;

        return (
            <Row type={'flex'} justify={'center'} gutter={16}>
                <Col xs={6}>
                    <div style={{textAlign: 'left'}}>
                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                            <Checkbox
                                indeterminate={indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={checkAll}>
                                Seleccionar todas
                            </Checkbox>
                        </div>
                        <br />
                        <Checkbox.Group value={checkedList} style={{ width: '100%' }} onChange={this.onChange}>
                            <Row>
                                {
                                    plainOptions.map(option =>
                                        <Col key={option} span={24}>
                                            <Checkbox value={option}>{option}</Checkbox>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Checkbox.Group>
                    </div>
                </Col>
                <Col xs={18}>
                    <Table
                        scroll={{ x: 600 }}
                        rowKey={r => r._id}
                        loading={loading}
                        size={'small'}
                        columns={this.getColumns()}
                        dataSource={documents}/>
                </Col>
            </Row>
        );
    }
}