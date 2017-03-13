// @flow
import server from './server';
import router from './middleware/router';
import logger from './middleware/logger';

/* [Type Definitions] */
import type { Route } from './middleware/types';

export type Config = {
  name?: string,
  port?: number,
  logger?: boolean,
  routes: Route[],
};

/* [Defaults] */
export const DEFAULT_NAME:string = 'arc-server';

const HEALTH_CHECK_ROUTE:Route = {
  method: 'GET',
  path: '/health-check',
  handler: async () => '',
};

const DEFAULT_ROUTES:Route[] = [HEALTH_CHECK_ROUTE];

const DEFAULT_CONFIG:Config = {
  name: DEFAULT_NAME,
  port: 8080,
  logger: true,
  routes: DEFAULT_ROUTES,
};

/* [Private] */
const configReducer:Function = (c0:Config, c1:Config):Config => {
  const r0 = c0.routes || [];
  const r1 = c1.routes || [];
  return {
    ...c0,
    ...c1,
    routes: r0.concat(r1),
  };
};

const initMiddleware:Function = (config:Config):void => {
  server.register(router(config.routes));
  if (config.logger) server.register(logger(config.name));
};

const mergeConfigs:Function = (...configs:Config[]):Config => (
  configs.reduce(configReducer)
);
/* [Tests] */
export const __test__ = {
  DEFAULT_NAME,
  DEFAULT_ROUTES,
  HEALTH_CHECK_ROUTE,
};

/* [Public] */
export const start = (opts:Config):void => {
  const config:Config = mergeConfigs(DEFAULT_CONFIG, opts);
  initMiddleware(config);
  server.listen(config.port);
};

export default {
  start,
};
