import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import todos from './reducers/todos';
import xxx from './reducers/xxx';
import quickNavigation from './reducers/quickNavigation';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const logger = store => next => action => {
//     console.log('prev state', store.getState())
//     console.log('dispatch', action);

//     let result = next(action);

//     console.log('next state', store.getState());

//     return result;
// }

export default createStore(combineReducers({
    todos,
    xxx,
    quickNavigation
}), composeEnhancers(applyMiddleware(thunk)));