import 'core-js/stable';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store';
import axios from 'common/config-axios';

import 'css/main.scss';
import 'keith-ui/css/iconfont/iconfont.js';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)