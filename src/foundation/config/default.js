
const pageMetaData = require('../../content/bootstrap/pageMetaData');

module.exports = {
  host: process.env.NODE_HOST || '0.0.0.0', // Define your host from 'package.json'
  port: process.env.PORT,
  app: pageMetaData,
};
