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
        await this.countCategories(match);
        await this.loadCategories(match);
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
    };

    loadCategories = async (match=undefined, typedValue='') => {
        const { numberOfCategories } = this.state,
            { filter } = this.props,
            { dataSetId, field } = filter;

        let stages = [
            {
                $group: {
                    _id: null,
                    categories: {
                        $addToSet: `$${field}`
                    }
                }
            }
        ];

        let matched = false;

        // TODO: validate match object
        if (numberOfCategories > 100) {
            if (!!typedValue && typedValue.length > 0) {
                matched = true;

                stages.unshift({
                    $match: {
                        [field]: {
                            $regex: typedValue,
                            $options: 'i'
                        },
                        ...(!!match && !!match.$match? match.$match: {})
                    }
                });
            }

            stages.unshift({
                $limit: 100
            });
        }

        if (!matched && !!match) {
            stages.unshift(match);
        }

        // console.log('#stages', stages);

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
            const categories = data[0].categories.map(c => c === '' ? 'NA' : c);
            await this.setState({categories, match});
        }
        else {
            await this.setState({categories: [], match});
        }
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
        // await this.setState({value});
        await this.loadCategories(this.state.match, typedValue);
    };

    render() {
        const { categories, loading, numberOfCategories, mode, value } = this.state,
            { dataSetId, field, alias } = this.props.filter,
            aliasLabel = !!alias? alias: field.capitalize();

        const props = (numberOfCategories > 100)?
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