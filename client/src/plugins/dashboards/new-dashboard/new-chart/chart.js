import React from 'react';
import { Button, Card, Col, Divider, Icon, Input, Popover, Radio, Row, TreeSelect, Tag, Tooltip, Result } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import { ItemTypes } from './constants';
import _ from 'lodash';
import auth from "../../../../auth";
import queries from "./queries";
import viz from './viz';
import rp from "request-promise";
import factoryChart from '../../charts';
import factoryFilter from '../../filters';
import ConfigForm from './config-form';

const { TreeNode } = TreeSelect;

const fieldSource = {
    beginDrag(props) {
        // console.log(props);
        return props;
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const Field = DragSource(ItemTypes.FIELD, fieldSource, collect)(
    class extends React.Component {
        render() {
            const { connectDragSource, isDragging, field } = this.props;
            return connectDragSource(
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0)',
                    opacity: isDragging ? 0.5 : 1,
                    cursor: 'move',
                    marginBottom: 8
                }}>
                    <Tag color={'black'} style={{width: '100%'}}>({field.type}) {field.name}</Tag>
                </div>
            );
        }
    }
);

const squareTarget = {
    drop(props, monitor) {

        props.onDrop(monitor.getItem());
    }
};

function collect2(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

const Option = DropTarget(ItemTypes.FIELD, squareTarget, collect2)(
    class extends React.Component {
        state = {
            showPopover: false,
            option: 'alias'
        };

        handleRemoveField = (target=undefined) => {
            if (!!this.props.onRemove) {
                const { name } = this.props;
                this.props.onRemove(name, target);
            }
        };

        handleUpdate = (target=undefined) => {
            const { alias, option } = this.state;

            if (!!this.props.onUpdateFormat && !!alias && alias.length > 0) {
                const { name } = this.props;
                this.props.onUpdateFormat(option, alias, name, target);
                this.setState({showPopover: false});
            }
        };

        popoverContent = (fieldType, target=undefined) => {
            return (
                <div>
                    <div style={{width: '100%'}}>
                        <Radio.Group
                            style={{width: '100%', marginBottom: 8}}
                            size={'small'}
                            value={this.state.option}
                            onChange={e => this.setState({ option: e.target.value })}>
                            <Radio.Button style={{textAlign: 'center'}} value={'alias'}><Icon type={'tag'}/> Alias</Radio.Button>
                            <Radio.Button style={{textAlign: 'center'}} value={'formatter'}><Icon type="highlight" /> Formato</Radio.Button>
                            {
                                fieldType === 'datetime' &&
                                <Radio.Button style={{textAlign: 'center'}} value={'operator'}><Icon type="dollar" /> Operador</Radio.Button>
                            }
                        </Radio.Group>
                    </div>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        onPressEnter={() => this.handleUpdate(target)}
                        onChange={e => this.setState({alias: e.target.value})}
                        placeholder={`Editar...`}
                        style={{ width: '100%', marginBottom: 8, display: 'block' }}/>
                    <Button
                        size={'small'}
                        type={'primary'}
                        onClick={() => this.handleUpdate(target)}
                        style={{ marginRight: 8 }}>
                        Editar
                    </Button>
                    <Button
                        size={'small'}>
                        Reiniciar
                    </Button>
                </div>
            );
        };

        handleShowPopover = (fieldName=undefined) => {
            if (!!this.searchInput) {
                this.searchInput.focus();
            }

            this.setState({showPopover: true, fieldName});
        };

        renderField = (field) => {
            if (field.type === 'array') {
                const { fieldName } = this.state;

                return field.value.map(f =>
                    <Tag
                        key={f.name}
                        onClose={() => this.handleRemoveField(f.name)}
                        closable
                        color={'black'}>
                        <Popover
                            visible={fieldName === f.name && this.state.showPopover}
                            trigger={'click'}
                            placement={'bottom'}
                            content={this.popoverContent(f.type, f.name)}>
                            <a onClick={() => this.handleShowPopover(f.name)}><Icon type={'edit'} color={'white'}/></a>
                        </Popover>
                        {
                            !!f.alias?
                                <Tooltip title={f.name}> {f.alias}</Tooltip>:
                                <span> {f.name}</span>
                        }
                    </Tag>
                );
            }
            else {
                return (
                    <Tag
                        onClose={this.handleRemoveField}
                        closable
                        color={'black'}>
                        <Popover
                            visible={this.state.showPopover}
                            trigger={'click'}
                            placement={'bottom'}
                            content={this.popoverContent(field.value.type)}>
                            <a onClick={this.handleShowPopover}>
                                <Icon type={'edit'} color={'white'}/></a>
                        </Popover>
                        {
                            !!field.alias?
                                <Tooltip title={field.value.name}> {field.alias}</Tooltip>:
                                <span> {field.value.name}</span>
                        }
                    </Tag>
                );
            }
        };

        handleClear = () => {
            if (!!this.props.onClear) {
                const { name } = this.props;
                this.props.onClear(name);
            }
        };

        render() {
            const { name, field, connectDropTarget } = this.props;

            return connectDropTarget(
                <div className={'option-content'}>
                    {
                        (field.type === 'array' && !!field.value) &&
                        <Tooltip title={'Borrar'}>
                            <a onClick={this.handleClear} style={{paddingRight: 6}}>
                                <Icon type={'delete'}/>
                            </a>
                        </Tooltip>
                    }
                    {name}: {!!field.value && this.renderField(field)}
                </div>
            );
        }
    }
);

const FilterContainer = DropTarget(ItemTypes.FIELD, squareTarget, collect2)(
    class extends React.Component {
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

        handleRemoveFilter = (filter) => {
            if (this.props.onRemoveFilter instanceof Function) {
                this.props.onRemoveFilter(filter);
            }
        };

        handleOnChangeFilterValue = (filterValue) => {
            console.log('filterValue', filterValue);
            if (this.props.onChangeFilterValue instanceof Function) {
                this.props.onChangeFilterValue(filterValue);
            }
        };

        render() {
            const { dataSetId, filters, connectDropTarget } = this.props;

            // console.log(filters);

            return connectDropTarget(
                <div className={'filters-content'}>
                    <Row gutter={12}>
                        {
                            filters.length === 0 &&
                            <Col xs={24}>
                                filters:
                            </Col>
                        }
                        {
                            filters.map((filter, itemId) =>
                                <Col key={itemId} xs={this.getOptionColumnSize(filters.length)} style={{paddingBottom: 8}}>
                                    <Card
                                        bodyStyle={{padding: 6}}>
                                        <div className={'item-title'}>
                                            <Tooltip title={'eliminar'} placement={'bottom'}>
                                                <a onClick={() => this.handleRemoveFilter(filter)} className="remove">
                                                    <Icon type={'delete'}/>
                                                </a>
                                            </Tooltip>
                                        </div>
                                        {
                                            factoryFilter({
                                                itemId,
                                                filter: {
                                                    field: filter.field.name,
                                                    dataSetId,
                                                    filterType: this.getFilterType(filter.field.type),
                                                    dataType: filter.field.type
                                                },
                                                onChange: this.handleOnChangeFilterValue,
                                                filterContext: 'chart'
                                            })
                                        }
                                    </Card>
                                </Col>
                            )
                        }
                    </Row>
                </div>
            );
        }
    }
);

const hubId = 1;

export default class extends React.Component {
    state = {
        chartType: this.props.chartType,
        selectedRange: 'all',
        options: viz[this.props.chartType],
        fields: [],
        selectedFields: [],
        documents: [],
        filters: [],
        loading: false,
        dataSet: this.props.dataSet,
        variables: this.props.variables,
        title: '',
        filterValues: {}
    };

    async componentDidMount() {
        await this.loadDataSet();
    }

    loadDataSet = async () => {
        const { dataSet } = this.state;
        try {
            const res = await auth.getData(
                queries.getDataSet(
                    hubId,
                    dataSet.id,
                )
            );

            await this.setState({ dataSet: res.data.hub.dataSet });
            await this.loadSchema();
        }
        catch (e) {
            console.log(e);
        }
    };

    loadSchema = async () => {
        const { dataSet, variables } = this.state;

        // console.log(dataSet);

        try {
            const schema = await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/schemas/${dataSet.schema}`,
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });

            // console.log(schema);
            const fields = _.map(schema.fields, (f, n) => ({name: n, type: f})).filter(f => variables.includes(f.name));

            this.setState({
                schema,
                fields,
                selectedFields: fields
            });
        }
        catch (e) {
            console.log(e);
        }
    };

    handleChange = () => {
        if (this.props.onChange instanceof Function) {
            const { chartType, options, filterValues, config } = this.state;

            // console.log('config', config);

            this.props.onChange(chartType, {...options, filters: JSON.stringify(filterValues), config});
        }
    };

    handleChangeChartType = (chartType) => {

        console.log(chartType, viz[chartType]);

        this.setState({ chartType, options: viz[chartType] }, this.handleChange);
    };

    handleChangeOption = (name, field) => {
        let { options } = this.state,
            target = options.fields[name];

        console.log(name, field, target);

        if (target.type !== 'array') {
            target.value = field;
        }
        else {
            if (!!target.value) {

                if (!target.value.some(v => v.name === field.name)) {
                    target.value.push(field);
                }
            }
            else {
                target.value = [field];
            }
        }

        // console.log(options);

        this.setState({ options, [`${name}Filter`]: undefined } /*, this.loadData*/, this.handleChange);
    };

    notSelected = (field) => {
        const { options } = this.state;

        return _.isEmpty(_.pickBy(options.fields, option => !!option && option.name === field.name));
    };

    handleRemoveField = (name, target) => {
        let { options } = this.state,
            targetField = options.fields[name];

        if (targetField.type === 'array' && !!target) {

            targetField.value = targetField.value.filter(v => v.name !== target);

            if (targetField.value.length === 0) {
                targetField.value = undefined;
            }
        }
        else {
            targetField.value = undefined;
        }

        // console.log(targetField, target);

        this.setState({ options, [`${name}Filter`]: undefined }/*, this.loadData*/, this.handleChange);
    };

    handleUpdateFormat = (option, value, name, target) => {
        let { options } = this.state,
            targetField = options.fields[name];

        if (targetField.type === 'array' && !!target) {

            targetField.value.forEach(v => {
                if (v.name === target) {
                    if (option === 'formatter') {
                        try {
                            value = JSON.parse(value);
                        }
                        catch (e) {
                            console.log('set formatter', option, value);
                        }
                    }

                    v[option] = value;
                }
            });
        }
        else {
            if (option === 'formatter') {
                try {
                    value = JSON.parse(value);
                }
                catch (e) {
                    console.log('set formatter', option, value);
                }
            }

            targetField[option] = value;
        }

        console.log(targetField, target);

        this.setState({ options, [`${name}Filter`]: undefined }/*, this.loadData*/, this.handleChange);
    };

    handleClearField = (name) => {
        let { options } = this.state;

        options.fields[name].value = undefined;

        this.setState({ options, [`${name}Filter`]: undefined }/*, this.loadData*/, this.handleChange);
    };

    validOptions = () => {
        const { options } = this.state;

        return !_.map(options.fields, option => option).some(v => !v.value);
    };

    renderChart = (readyToRender) => {
        const { chartType, options, dataSet } = this.state,
            dimensions = {
                height: 480
            };

        return readyToRender?
            factoryChart(
                'itemId',
                { chartType, options, dataSet },
                dimensions,
                undefined,
                undefined,
                undefined,
                undefined
            ):
            <Result
                icon={<Icon type={'drag'} style={{color: '#34b3eb'}}/>}
                title={'Selecciona las variables del gráfico'}
                subTitle={'Arrastra las variables a las opciones y filtros'}
            />;
    };

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

    handleAddFilter = (filter) => {
        const { filters } = this.state;

        this.setState({filters: [...filters, filter]});
    };

    handleRemoveFilter = (filter) => {
        const { filters } = this.state;

        this.setState({filters: filters.filter(f => f.field.name !== filter.field.name)});
    };

    handleChangeFilterValue = (filter) => {
        const { filterValues } = this.state;

        console.log({...filterValues, ...filter});
        this.setState({filterValues: {...filterValues, ...filter}}, this.handleChange);
    };

    handleUpdateConfig = config => {
        this.setState({config}, this.handleChange);
    };

    render() {
        const { chartType, options, fields, loading, selectedFields, filters, dataSet } = this.state,
            readyToRender = !loading && this.validOptions();

        return (
            <div>
                <Row gutter={32}>
                    <Col xs={4} style={{textAlign: 'left'}}>
                        <h3>Variables</h3>
                        {
                            fields.length > 10 &&
                            <div style={{paddingBottom: 12}}>
                                <Input
                                    allowClear
                                    onChange={e => this.setState({ selectedFields: fields.filter(f => f.name.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0)})}
                                    size={'small'}
                                    placeholder={'Buscar...'}/>
                            </div>
                        }
                        {
                            selectedFields.filter(this.notSelected).map(f =>
                                <Field field={f} key={f.name}/>
                            )
                        }
                        <Divider style={{marginBottom: 12, marginTop: 12}}/>
                        <p><Icon type={'drag'}/> Arrastra las variables hacia las opciones.</p>
                    </Col>
                    <Col xs={20}>
                        <div className={'chart-types'}>
                            <TreeSelect
                                style={{ width: '100%' }}
                                value={chartType}
                                placeholder={'Selecciona el tipo de gráfico'}
                                allowClear
                                treeDefaultExpandAll
                                onChange={this.handleChangeChartType}>
                                <TreeNode value={'table'} title={<span><Icon type={'table'} /> Tabular</span>} key={'0'} selectable={false}>
                                    <TreeNode value={'sheet'} title={<span>Hoja</span>} key={'0-0'} selectable />
                                    <TreeNode value={'description'} title={<span>Descripción</span>} key={'0-1'} selectable/>
                                    <TreeNode value={'statistic'} title={<span>Estadística</span>} key={'0-2'} selectable/>
                                </TreeNode>

                                <TreeNode value={'lines'} title={<span><Icon type={'line-chart'} /> Líneas</span>} key={'1'} selectable>
                                    <TreeNode value={'linesAndPoints'} title={<span>Líneas y puntos</span>} key={'1-0'} selectable/>
                                    <TreeNode value={'area'} title={<span>Área</span>} key={'1-1'} selectable/>
                                    <TreeNode value={'stackArea'} title={<span>Áreas apiladas</span>} key={'1-2'} selectable/>
                                </TreeNode>

                                <TreeNode value={'bars'} title={<span><Icon type={'bar-chart'} /> Barras</span>} key={'2-0'} selectable>
                                    <TreeNode value={'stackBar'} title={<span>Barras apiladas</span>} key={'2-2'} selectable/>
                                    <TreeNode value={'doubleAxis'} title={<span>Barras y líneas</span>} key={'2-1'} selectable/>
                                </TreeNode>

                                <TreeNode value={'points'} title={<span><Icon type={'dot-chart'} /> Puntos</span>} key={'3'} selectable/>
                                <TreeNode value={'pie'} title={<span><Icon type={'pie-chart'} /> Pie</span>} key={'4'} selectable/>
                                <TreeNode value={'radar'} title={<span><Icon type={'radar-chart'} /> Radar</span>} key={'5'} selectable/>

                                <TreeNode value={'map'} title={<span><Icon type={'global'} /> Mapa</span>} key={'7'} selectable={false}>
                                    <TreeNode value={'mapScatterPlot'} title={<span>Dispersión</span>} key={'7-0'} selectable />
                                    <TreeNode value={'mapLines'} title={<span>Líneas</span>} key={'7-1'} selectable />
                                    <TreeNode value={'heatMap'} title={<span>Mapa de calor</span>} key={'7-2'} selectable />
                                    <TreeNode value={'iconLayer'} title={<span>Íconos</span>} key={'7-3'} selectable />
                                </TreeNode>
                            </TreeSelect>
                        </div>

                        <Row gutter={8}>
                            {
                                _.map(options.fields, (option, name) =>
                                    <Col key={name} xs={this.getOptionColumnSize(Object.keys(options.fields).length)} style={{paddingBottom: 8}}>
                                        <Option
                                            name={name}
                                            field={option}
                                            onClear={this.handleClearField}
                                            onDrop={item => this.handleChangeOption(name, item.field)}
                                            onUpdateFormat={this.handleUpdateFormat}
                                            onRemove={this.handleRemoveField}/>
                                    </Col>
                                )
                            }
                            <Col xs={24}>
                                <Row type={'flex'} justify={'start'}>
                                    <Col xs={24} className={'chart-content'}>
                                        <Card>
                                            {this.renderChart(readyToRender)}
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>

                            <Col xs={24}>
                                <FilterContainer
                                    onRemoveFilter={this.handleRemoveFilter}
                                    onDrop={this.handleAddFilter}
                                    onChangeFilterValue={this.handleChangeFilterValue}
                                    dataSetId={dataSet.id}
                                    filters={filters}/>

                                {
                                    !!options.config &&
                                    <ConfigForm
                                        onChangeValues={this.handleUpdateConfig}
                                        config={options.config}/>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

