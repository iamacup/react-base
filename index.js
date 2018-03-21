/* eslint-disable */

// Allows you to use the full set of ES6 features on server-side (place it before anything else)
require('babel-polyfill');

// Use babel-register to precompile ES6 syntax
require('babel-register');

// Setup global variables for server
global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__API__ = JSON.stringify(process.env.API_ENDPOINT.toString());

// Run assets require hooks
require('./tools/webpack/hooks')();
// Run server
require('./src/foundation/server');
