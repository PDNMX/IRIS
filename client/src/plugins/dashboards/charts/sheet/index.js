import React from 'react';
import { Table, Tag, Tree } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import rp from 'request-promise';
import auth from '../../../../auth';
import _ from 'lodash';
import helpers from '../../../../helpers';
import {Global} from "viser-react";

const { TreeNode } = Tree;
const fieldSource = {
    beginDrag(props) {
        // console.log(props);
        return props;
    }
};
const ItemTypes = {
    FIELD: 'field',
    COLUMN: 'column'
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const Column = DragSource(ItemTypes.COLUMN, fieldSource, collect)(
    class extends React.Component {
        render() {
            const { connectDragSource, isDragging, field, color } = this.props;
            return connectDragSource(
                <div
                    style={{
                        backgroundColor: 'rgba(255,255,255,0)',
                        opacity: isDragging ? 0.5 : 1,
                        cursor: 'move',
                        marginBottom: 8
                    }}>
                    <Tag color={color} style={{width: '100%'}}>{!!field.alias? field.alias: field.name}</Tag>
                </div>
            );
        }
    }
);

function collect2(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

const squareTarget = {
    drop(props, monitor) {
        // console.log(props, monitor.getItem());
        props.onDrop(monitor.getItem());
    }
};

const GroupBy = DropTarget(ItemTypes.COLUMN, squareTarget, collect2)(
    class extends React.Component {
        handleRemoveField = (target) => {
            if (!!this.props.onRemove) {
                this.props.onRemove(target);
            }
        };

        handleClear = () => {
            if (!!this.props.onClear) {
                const { name } = this.props;
                this.props.onClear(name);
            }
        };

        render() {
            const { fields, connectDropTarget, color } = this.props;

            return connectDropTarget(
                <div className='option-content' style={{textAlign: 'left'}}>
                    Agrupar:&nbsp;
                    {
                        fields.map(field =>
                            <Tag key={field.name} onClose={() => this.handleRemoveField(field.name)} closable color={color}>{field.name}</Tag>
                        )
                    }
                </div>
            )
        }
    }
);

export default class extends React.Component {
    state = {
        fields: [],
        documents: [],
        loading: false,
        numberOfDocuments: 0,
        current: 0,
        defaultColor: 'black'
    };

    async componentDidMount() {
        if (!!Global && 'defaultColor' in Global) {
            const { defaultColor } = Global;
            this.setState({defaultColor})
        }
    }

    loadAll = async (match=undefined, selector={limit: 10, skip: 0}) => {
        const { dataSet } = this.props;
        // let { selector } = this.state;
        try{
            await this.setState({ loading: true });
        }catch (e) {
            console.log(e)
        }

        if (!!selector && !!match) {
            const { limit, skip } = selector;

            if (limit === 10 && skip === 0) {
                this.setState({current: 0});
            }

            selector = {...selector, where: match.$match };
        }

        // console.log(selector);

        try {
            const documents = await rp({
                    method: 'POST',
                    uri: `${auth.getHost()}/dataset/${dataSet.id}`,
                    headers: {
                        'Authorization': `Bearer ${auth.getToken()}`
                    },
                    body: selector,
                    json: true
                }),
                count = await rp({
                    method: 'POST',
                    uri: `${auth.getHost()}/dataset/${dataSet.id}/count`,
                    body: !!selector.where? { where: selector.where }: {},
                    headers: {
                        'Authorization': `Bearer ${auth.getToken()}`
                    },
                    json: true
                });

            // console.log('selector', selector, count);
            // console.log('documents', documents);

            await this.setState({ documents, loading: false, numberOfDocuments: count });
        }
        catch (e) {
            console.log(e);
            try {
                await this.setState({ documents: [], loading: false });
            }catch (e) {
                console.log(e)
            }
        }
    };

    loadGroups = async () => {
        const { dataSet } = this.props,
            { fields } = this.state;

        let _id = {};

        fields.forEach(field => _id[field.name] = `$${field.name}`);

        this.setState({loading: true});

        try {
            const groups = await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSet.id}/aggregate`,
                body: [
                    { $group : { _id, [dataSet.id]: { $push: '$$ROOT' } } }
                ],
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });

            let data = {},
                current = data,
                tail = fields[fields.length - 1];

            groups.forEach(group => {
                fields.forEach(field => {
                    const id = `${field.name}: ${group._id[field.name]}`;

                    if (id in current) {
                        current = current[id];
                    }
                    else {
                        if (field.name === tail.name) {
                            current[id] = group[dataSet.id];
                        }
                        else {
                            current[id] = {};
                        }

                        current = current[id];
                    }
                });

                current = data;
            });

            // console.log(data);
            // console.log(groups);

            this.setState({ data, loading: false });
        }
        catch (e) {
            console.log(e);
            try{
                await this.setState({documents: [], loading: false});
            }catch (e) {
                console.log(e)
            }
        }
    };

    loadData = async (match=undefined, selector=undefined) => {
        const { dataSet, options } = this.props,
            { columns } = options.fields;

        // console.log('sheet filters', match);
        try {
            await this.setState({match});
        }catch (e) {
            console.log(e)
        }

        if (!!dataSet) {
            let { fields } = this.state;

            if (columns.value.length === fields.length) {
                try{
                    await this.setState({fields: []});
                }catch (e) {
                    console.log(e)
                }
            }

            fields = this.state.fields;

            if (fields.length === 0) {
                try{
                    await this.loadAll(match, selector);
                }catch (e) {
                    console.log(e)
                }
            }
            else {
                try{
                    await this.loadGroups();
                }catch (e) {
                    console.log(e)
                }
            }
        }
    };

    getFormatter = (formatter) => {
        if (typeof formatter === 'string') {
            return helpers[formatter];
        }
        else if (this.props.makeFormatter instanceof Function) {
            return this.props.makeFormatter(formatter);
        }
    };

    getColumns = () => {
        const { defaultColor } = this.state,
            { options } = this.props,
            { columns } = options.fields;

        return columns.value.map(col => ({
            title: <Column field={col} color={defaultColor}/>,
            dataIndex: col.name,
            key: col.name,
            render: !!col.formatter && (value => this.getFormatter(col.formatter)(value)),
            sorter: true
        }));
    };

    getFilteredColumns = () => {
        const { fields } = this.state,
            { options } = this.props,
            { columns } = options.fields,
            names = fields.map(f => f.name);

        return columns.value.filter(col => !names.includes(col.name)).map(col => ({
            title: col.name,
            dataIndex: col.name,
            key: col.name
        }));
    };

    getGroupColumns = () => {
        const { fields } = this.state,
            { options } = this.props,
            { columns } = options.fields,
            names = fields.map(f => f.name);

        return [
            {
                title: 'Agrupador',
                dataIndex: 'key',
                key: 'key'
            }
        ].concat(
            columns.value.filter(col => !names.includes(col.name)).map(col => ({
                title: <Column field={col}/>,
                dataIndex: col.name,
                key: col.name
            }))
        );
    };

    handleAddField = (item) => {
        let { fields } = this.state;
        const { name } = item.field;

        if (!fields.some(field => field.name === name)) {
            fields.push(item.field);
            this.setState({fields}, this.loadData);
        }
    };

    handleRemoveField = (name) => {
        let { fields } = this.state;

        this.setState({fields: fields.filter(field => field.name !== name)}, this.loadData);
    };

    renderTreeNodes = (data, name) => {
        if (data instanceof Array) {
            return (
                <TreeNode title={name} key={name} >

                </TreeNode>
            );
        }
        else {
            return(
                <TreeNode title={name} key={name}>
                    {_.map(data, (item, name) => this.renderTreeNodes(item, name))}
                </TreeNode>
            )
        }
    };

    expandedRowRender = (data) => {
        return (
            <div style={{paddingTop: 12}}>
                {
                    data.group instanceof Array?
                        <Table
                            bordered
                            size={'small'}
                            rowKey={r => r['_id']}
                            columns={this.getFilteredColumns()}
                            dataSource={data.group}/>:
                        <Table
                            size={'small'}
                            columns={this.getGroupColumns()}
                            expandedRowRender={this.expandedRowRender}
                            dataSource={_.map(data.group, (group, name) => ({key: name, group}))}/>
                }
            </div>
        );
    };

    onChange = async (pagination, filters, sorter) => {
        let selector = {
                limit: pagination.pageSize,
                skip: (pagination.current - 1) * pagination.pageSize,
            },
            { match } = this.state;

        // console.log('#sorter: ', sorter);
        try{
            await this.setState({
                current: pagination.current
            });
        }catch (e) {
            console.log(e)
        }

        if (!_.isEmpty(sorter)) {
            selector = {
                ...selector,
                sort: {
                    [sorter.columnKey]: sorter.order === 'ascend'? 1: -1
                }
            };
        }
        try{
            await this.loadData(match, selector)
        }catch (e) {
            console.log(e)
        }
    };

    render() {
        const { fields, loading, data, numberOfDocuments, current, defaultColor } = this.state,
            { documents } = this.state;

        // console.log(width, height);

        return (
            <div style={{textAlign: 'left'}}>
                {
                    fields.length > 0?
                        <Table
                            loading={loading}
                            title={() => (
                                <GroupBy
                                    color={defaultColor}
                                    fields={fields}
                                    onDrop={this.handleAddField}
                                    onRemove={this.handleRemoveField}/>
                            )}
                            size={'small'}
                            columns={this.getGroupColumns()}
                            expandedRowRender={this.expandedRowRender}
                            dataSource={_.map(data, (group, name) => ({key: name, group}))}/>:
                        <Table
                            loading={loading}
                            /*title={() => (
                                <GroupBy
                                    fields={fields}
                                    onDrop={this.handleAddField}
                                    onRemove={this.handleRemoveField}/>
                            )}*/
                            pagination={{
                                current, total:
                                numberOfDocuments,
                                showTotal: total => `${total} registros`
                            }}
                            onChange={this.onChange}
                            size={'small'}
                            rowKey={r => r['_id']}
                            columns={this.getColumns()}
                            dataSource={documents} />
                }
            </div>
        )
    }
}