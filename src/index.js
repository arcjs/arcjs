import server from './server';
import router from './router';
import logger from './logger';

const DEFAULT_CONFIG = {
  name: 'Arc Server',
  port: 8080,
  logger: true,
};

const initMiddleware = config => {
  server.register(router(config.routes));
  if (!!config.logger) server.register(logger(config));
};

const start = (opts = {}) => {
  const config = { ...DEFAULT_CONFIG, ...opts };
  initMiddleware(config);
  server.listen(config.port);
};

export default {
  start,
};

// Dev only - testing hello world setup
start({
  routes: [{
    method: 'GET',
    path: '/',
    handler: () => 'Hello World!'
  }]
});
