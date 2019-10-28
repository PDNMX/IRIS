import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './styles/index.less';
import registerServiceWorker from './registerServiceWorker';
import auth from './auth';
import App from './app';

auth.setHost(process.env.REACT_APP_HOST);
// console.log("CLIENT HOST:", auth.getHost());

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();