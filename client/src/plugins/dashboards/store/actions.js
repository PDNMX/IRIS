export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const INIT_STORE = 'INIT_STORE';
export const REMOVE_PANE_FILTERS = 'REMOVE_PANE_FILTERS';

export const addFilter = (filter) => ({
    type: ADD_FILTER,
    payload: filter
});

export const removeFilter = (filter) => ({
    type: REMOVE_FILTER,
    payload: filter
});

export const initFilters = (filters) => ({
    type: INIT_STORE,
    payload: filters
});

export const removePaneFilters = (paneId) => ({
    type: REMOVE_PANE_FILTERS,
    payload: paneId
});