// @flow
import koaLogger from 'koa-bunyan';
import bunyan from 'bunyan';

/* [Type Definitions] */
import type { Middleware } from './types';

/* [Defaults] */
import { DEFAULT_NAME } from '../index';

const DEFAULT_TIMELIMIT = 100;

/* [Private] */
const logger:Function = (name:string):Object => bunyan.createLogger({ name });

/* [Tests] */
export const __test__ = {
  DEFAULT_TIMELIMIT,
};

/* [Public] */
export const loggerMiddleware:Function = (name:string = DEFAULT_NAME):Middleware => (
  koaLogger(logger(name), { timeLimit: DEFAULT_TIMELIMIT })
);

export default loggerMiddleware;
