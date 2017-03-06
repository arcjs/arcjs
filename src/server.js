import Koa from 'koa';
import chalk from 'chalk';

import router from './router';

const DEFAULT_PORT = 8080;

const server = new Koa();

export const register = routes => {
  server.use(router(routes));
};

export const listen = (port = DEFAULT_PORT) => {
  const startMsg = `Starting server at http://127.0.0.1:${port}...`;
  console.log(chalk.green(startMsg));
  server.listen(port);
};

export default {
  listen,
  register,
};
