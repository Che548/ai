const { config } = require('./EndpointService');
const getCustomConfig = require('./getCustomConfig');
const loadCustomConfig = require('./loadCustomConfig');
const loadConfigModels = require('./loadConfigModels');
const loadDefaultModels = require('./loadDefaultModels');
const loadOverrideConfig = require('./loadOverrideConfig');
const loadAsyncEndpoints = require('./loadAsyncEndpoints');
const loadConfigEndpoints = require('./loadConfigEndpoints');
const loadDefaultEndpointsConfig = require('./loadDefaultEConfig');
const getCustomEndpointConfig = require('./getCustomEndpointConfig');

module.exports = {
  config,
  getCustomConfig,
  loadCustomConfig,
  loadConfigModels,
  loadDefaultModels,
  loadOverrideConfig,
  loadAsyncEndpoints,
  loadConfigEndpoints,
  getCustomEndpointConfig,
  loadDefaultEndpointsConfig,
};
