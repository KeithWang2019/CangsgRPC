import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

let allReducers = {};

import quickNavigation from './modules/quickNavigation.js';
import nodeList from './modules/nodeList';

addReducer(quickNavigation);
addReducer(nodeList);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function addReducer(module){
    allReducers[module.name] = module.reducer;
}

export default createStore(combineReducers(allReducers), composeEnhancers(applyMiddleware(thunk)));