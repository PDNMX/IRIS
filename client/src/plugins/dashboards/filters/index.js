import React from 'react';
import NumericFilter from './numerical';
import CategoricalFilter from './categorical';
import SwitchFilter from './switch';
import DatetimeFilter from './datetime';
import {connect} from 'react-redux';
import {mapStateToProps} from '../charts/utils';
import {addFilter, removeFilter} from '../store/actions';
import _ from 'lodash';


const Filter = connect(mapStateToProps, {addFilter, removeFilter})(
    class extends React.Component {
        static defaultProps = {
            filters: {}
        };

        state = {
            filters: this.props.filters
        };

        constructor(props) {
            super(props);
            this.itemRef = React.createRef();
        }

        async componentDidMount() {
            const { dashboardId } = this.props;

            if (!dashboardId) {
                await this.itemRef.current.loadData(this.getMatch());
                this.setFilterValue();
            }
            else if (!!dashboardId /*&& _.isEmpty(this.state.filters)*/) {
                await this.itemRef.current.loadData(this.getMatch());
                this.setFilterValue();
            }
        }

        setFilterValue = () => {
            const { filters } = this.state,
                { itemId, filter} = this.props;

            _.forEach(
                _.pickBy(
                    filters,
                    (targetFilter, targetFilterId) => targetFilterId === itemId
                ),
                targetFilter => {
                    if (this.state.value !== targetFilter[filter.field]) {
                        const tf = targetFilter[filter.field];

                        // console.log('#set filter: ', tf);
                        this.itemRef.current.setValue(tf);
                    }
                }
            );
        };

        getMatch = () => {
            const { filters } = this.state,
                { itemId, filter} = this.props;

            if (!_.isEmpty(filters)) {
                let match = {};

                _.forEach(
                    _.pickBy(
                        filters,
                        (targetFilter, targetFilterId) => targetFilterId !== itemId && !(filter.field in targetFilter)
                    ),
                    targetFilter => match = {...match, ...targetFilter}
                );

                // console.log('#match:', match);
                return _.isEmpty(match)? undefined: { $match: match };
            } else {
                // console.log('#set filter: ', undefined);
                // this.setState({value: undefined});
            }

            return undefined;
        };

        async componentDidUpdate() {
            const {filterContext} = this.props;
            
            /*
            const {filterContext, filter, itemId} = this.props;
            if (itemId === '72e3cc90-de37-11e9-8753-a32812d64875') {
                console.log('#filters', filter.filterType, this.state.filters, this.props.filters);
            }
            */

            if (filterContext === 'pane') {
                if (!_.isEqual(this.state.filters, this.props.filters)) {
                    await this.setState({filters: this.props.filters});
                    const match = this.getMatch();

                    // console.log('#match:', match, this.props.filter.filterType);
                    await this.itemRef.current.loadData(match);
                    this.setFilterValue();
                }
                else if (_.isEmpty(this.props.filters)) {
                    await this.itemRef.current.loadData();
                    this.itemRef.current.setValue(undefined);
                }
            }
        }

        render() {
            const { filter } = this.props,
                { filterType } = filter;

            switch (filterType) {
                case 'numerical':
                    return <NumericFilter {...this.props} ref={this.itemRef}/>;
                case 'categorical':
                    return <CategoricalFilter {...this.props} ref={this.itemRef}/>;
                case 'switch':
                    return <SwitchFilter {...this.props} ref={this.itemRef}/>;
                case 'datetime':
                    return <DatetimeFilter {...this.props} ref={this.itemRef}/>;
                default:
                    return <div>No filterType selected!</div>
            }
        }
    }
);

export default ({itemId, filter, dataSetId, dimensions, onChange=undefined, filterContext='pane', dashboardId=undefined}) => {
    const { filterType, chartType, paneId } = filter,
        props = {
            ...dimensions,
            paneId,
            chartType,
            dataSetId,
            itemId,
            filter,
            onChange,
            filterContext,
            filterType,
            dashboardId
        };

    /*switch (filterType) {
        case 'numerical':
            return <NumericFilter {...props}/>;
        case 'categorical':
            return <CategoricalFilter {...props}/>;
        case 'switch':
            return <SwitchFilter {...props}/>;
        case 'datetime':
            return <DatetimeFilter {...props}/>;
        default:
            return null;
    }*/
    return <Filter {...props}/>
}