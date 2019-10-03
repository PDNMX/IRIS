import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './styles/index.less';
import registerServiceWorker from './registerServiceWorker';
import auth from './auth';
import App from './app';

//auth.setHost('http://167.71.124.176');
auth.setHost('http://localhost:3000');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();