"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applicationSecretKey = void 0;

require('dotenv').config();

var applicationSecretKey = function applicationSecretKey() {
  return process.env.SECRET_KEY;
};

exports.applicationSecretKey = applicationSecretKey;