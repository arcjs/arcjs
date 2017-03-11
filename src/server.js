import Koa from 'koa';
import chalk from 'chalk';

const server = new Koa();

export const register = (...fns) => fns.forEach(fn => server.use(fn));

export const listen = (port) => {
  const startMsg = `Starting server at http://127.0.0.1:${port}...`;
  console.log(chalk.green(startMsg));
  server.listen(port);
};

export default {
  listen,
  register,
};
