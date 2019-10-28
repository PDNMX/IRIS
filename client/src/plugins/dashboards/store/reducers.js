import {
    ADD_FILTER,
    REMOVE_FILTER,
    INIT_STORE,
    REMOVE_PANE_FILTERS,
    SET_PANE_FILTERS
} from './actions';
import _ from 'lodash';

export const filters = (state={}, action) => {
    const actionType = action.type;

    // console.log(actionType, action.payload);

    if (actionType === ADD_FILTER) {
        const { payload } = action,
            {itemId, dataSetId, paneId, filter} = payload;
        let paneFilters = paneId in state ? state[paneId] : {},
            dataSetFilters = dataSetId in paneFilters ? paneFilters[dataSetId] : {};

/*
        console.log({
            ...state,
            [paneId]: {
                ...paneFilters,
                [dataSetId]: {
                    ...dataSetFilters,
                    [itemId]: filter
                }
            }
        });
*/

        return {
            ...state,
            [paneId]: {
                ...paneFilters,
                [dataSetId]: {
                    ...dataSetFilters,
                    [itemId]: filter
                }
            }
        };
    }
    else if (actionType === INIT_STORE) {
        return _.cloneDeep(action.payload);
    }
    else if (actionType === REMOVE_PANE_FILTERS) {
        return _.pickBy(state, (pane, paneId) => paneId !== action.payload.toString());
    }
    else if (actionType === REMOVE_FILTER) {
        const { payload } = action,
            { itemId, dataSetId, paneId } = payload;
        // console.log('REMOVE_FILTER', payload);
        // console.log('state before del:', state);

        if (paneId in state && dataSetId in state[paneId] && itemId in state[paneId][dataSetId]) {
            const dataSetFilters = _.pickBy(state[paneId][dataSetId], (f, i) => i !== itemId);

            let newState = {
                ...state,
                [paneId]: {
                    ...state[paneId],
                    [dataSetId]: dataSetFilters
                }
            };

            if (_.isEmpty(dataSetFilters)) {
                delete newState[paneId][dataSetId];
            }

            if (_.isEmpty(newState[paneId])) {
                delete newState[paneId];
            }

            // console.log('state after del:', newState);

            return newState;
        }
        return state;
    }
    else if (actionType === SET_PANE_FILTERS) {
        const { payload } = action,
            { paneId, filters } = payload;

        return {...state, [paneId]: filters};
    }
    else {
        return state;
    }
};