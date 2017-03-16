// @flow
import Koa from 'koa';
import chalk from 'chalk';

/* [Type Definitions] */
import type { Middleware } from './middleware/types';

/* [Private] */
const server: Object = new Koa();

const applyMiddleware: Function = (fn: Middleware) => server.use(fn);

/* [Public] */
export const register: Function = (...fns: Middleware[]) =>
  fns.forEach(applyMiddleware);

export const listen: Function = (port: number): void => {
  const startMsg: string = `Starting server at http://127.0.0.1:${port}...`;
  console.log(chalk.green(startMsg)); // eslint-disable-line
  server.listen(port);
};

export default {
  listen,
  register,
};
