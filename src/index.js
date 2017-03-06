import server from './server';

const start = (config = {}) => {
  server.register(config.routes);
  server.listen(config.port);
};

export default {
  start,
};

// Dev only - testing hello world setup
start({
  routes: [{
    method: 'GET',
    route: '/',
    handler: () => 'Hello World!'
  }]
});
