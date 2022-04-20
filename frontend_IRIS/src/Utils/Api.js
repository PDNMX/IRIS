const axios = require('axios');
//import axios from 'axios';
//const API_URL = process.env.REACT_APP_API_URL || 'http://64.225.54.253:5000'
//const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.164:5000'
const API_URL = process.env.REACT_APP_API_URL || 'http://backend:5000'


export default axios.create({
  baseURL: API_URL
});
