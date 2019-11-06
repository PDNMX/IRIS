import React from 'react';
import {Select, Typography, Tooltip} from 'antd';
import auth from '../../../../auth';
import rp from 'request-promise';
import getData from '../../charts/data';

const { Text } = Typography;

export default class extends React.Component {
    static defaultProps = {
        filters: {}
    };

    state = {
        categories: [],
        loading: false,
        search: false,
        value: undefined,
        numberOfCategories: 0,
        limitOfCategories: 50,
        filters: {}
    };

    setValue = (value) => {
        const { mode } = this.state;

        this.setState({
            value: mode === 'default' ?
                value:
                (
                    (!!value && '$in' in value) ?
                        value.$in :
                        undefined
                )
        });
    };

    async componentDidMount() {
        // await this.loadData();
        const { multipleSelection } = this.props.filter,
            mode = !!multipleSelection? (multipleSelection? 'multiple': 'default'): 'default';

        this.setState({ mode });
    }

    loadData = async (match=undefined) => {
        await this.setState({loading: true});
        const numberOfCategories = await this.countCategories(match);

        if (numberOfCategories <= this.state.limitOfCategories) {
            await this.loadCategories(match, false);
        }
        else {
            await this.setState({categories: [], match});
        }

        await this.setState({loading: false});
    };

    countCategories = async (match=undefined) => {
        const { filter } = this.props,
            { dataSetId, field } = filter,
            fields = {
                variable: {
                    value: {
                        type: 'string',
                        name: field
                    }
                }
            };

        const documents = await getData('variable', dataSetId, fields, match),
            numberOfCategories = (!!documents && documents.length === 1)? documents[0][fields.variable.value.name]: 0;
        // console.log('numberOfCategories', numberOfCategories);

        await this.setState({ numberOfCategories });
        return numberOfCategories;
    };

    loadCategories = async (match=undefined, search=false) => {
        const { typedValue } = this.state,
            { filter } = this.props,
            { dataSetId, field } = filter,
            validTypedValue = !!typedValue && typedValue.length > 0,
            applySearch = !search || (search && validTypedValue);

        let query = !!match && !!match.$match? match.$match: {},
            categories = [];

        if (search && validTypedValue) {
            query = {
                ...query,
                [field]: {
                    $regex: typedValue,
                    $options: 'i',
                }
            };
        }

        if (applySearch) {
            const data = await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSetId}/distinct`,
                body: {field, query},
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });

            if (!!data) {
                categories = data.map(c => c === '' ? 'NA' : c);
            }
        }

        await this.setState({categories, match});
    };

    castValue = (value, dataType) => {
        switch (dataType) {
            case 'int':
                return parseInt(value);
            case 'float':
                return parseFloat(value);
            default:
                return value;
        }
    };

    handleChange = (value) => {
        const { mode } = this.state,
            { filter, itemId, filterContext } = this.props,
            { dataSetId, paneId, field, dataType } = filter,
            response = {
                itemId,
                dataSetId,
                paneId,
                filter: {
                    [field]: mode === 'multiple'?
                        (value.length > 0? { $in: value }: undefined):
                        this.castValue(value, dataType)
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

    handleSearch = async (typedValue) => {
        // console.log('search', value);
        await this.setState({typedValue});
        await this.loadCategories(this.state.match, true);
    };

    render() {
        const { categories, loading, numberOfCategories, mode, value } = this.state,
            { dataSetId, field, alias } = this.props.filter,
            aliasLabel = !!alias? alias: field.capitalize();

        const props = (numberOfCategories  > this.state.limitOfCategories)?
            {
                loading: loading,
                mode,
                style: {width: '100%'},
                allowClear: true,
                showSearch: true,
                value,
                placeholder: `Buscar ${aliasLabel}...`,
                defaultActiveFirstOption: false,
                showArrow: false,
                filterOption: false,
                onSearch: this.handleSearch,
                onChange: this.handleChange,
                notFoundContent: null
            }:
            {
                loading: loading,
                mode,
                onChange: this.handleChange,
                value,
                placeholder: `Seleccionar ${aliasLabel}`,
                style: {width: '100%'},
                allowClear: true,
                showSearch: true,
            };

        return (
            <div style={{paddingLeft: 8, paddingRight: 8, textAlign: 'left'}}>
                <div style={{paddingBottom: 6}}>
                    <Tooltip title={dataSetId}>
                        <Text type={'secondary'}>{aliasLabel} ({numberOfCategories})</Text>
                    </Tooltip>
                </div>
                <Select {...props}>
                    {
                        categories.map(category =>
                            <Select.Option key={category}>{category}</Select.Option>
                        )
                    }
                </Select>
            </div>
        );
    }
}