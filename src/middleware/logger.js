// @flow
import koaLogger from 'koa-bunyan';
import bunyan from 'bunyan';

/* [Type Definitions] */
import type { Config } from '../index';
import type { Middleware } from './types';

/* [Defaults] */
import { DEFAULT_NAME } from '../index';

/* [Private] */
const logger:Function = (name:string):Object => bunyan.createLogger({ name });

/* [Public] */
export const loggerMiddleware:Function = (name:string = DEFAULT_NAME):Middleware => {
  return koaLogger(logger(name), { timeLimit: 100 });
};

export default loggerMiddleware;
