import { createStore } from 'redux';
import { filters } from '../store/reducers';

export const store = createStore(filters);