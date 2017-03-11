// @flow
import director from 'director';
import chalk from 'chalk';

/* [Type Definitions] */
import type { Middleware, Route } from './types';

/* [Private] */
const createRouter:Function = (routes:Object):Object => new director.http.Router(routes);

const setResponse:Function = async (route:Route, ctx:Object):Promise<void> => {
  ctx.res.body = await route.handler(ctx.req);
  if (route.hasOwnProperty('status')) ctx.res.status = route.status;
};

const handlerAdapter:Function = (route:Route):Function => function():void {
  setResponse(route, this);
};

const routeAdapter:Function = (route:Route):Object => {
  return { [route.method.toLowerCase()]: handlerAdapter(route) };
};

const routesAdapterReducer:Function = (r0:Object, r1:Route):Object => {
  return {
    ...r0,
    [r1.path]: {
      ...r0[r1.path],
      ...routeAdapter(r1),
    },
  };
};

const routesAdapter:Function = (routes:Route[]):Object => {
  return routes.reduce(routesAdapterReducer, {});
};

const notFoundHandler:Function = (req:Object):string => `Page: ${req.url} not found`;
const onError:Function = (ctx:Object):Function => async (err:Object):Promise<void> => {
  if (err.status === 404) {
    ctx.response.body = notFoundHandler(ctx.request);
    ctx.response.status = 404;
  }
  // TODO: Log errors
};

const routerMiddleware:Function = (router:Object):Middleware => {
  return async (ctx:Object, next:Function):Promise<void> => {
    router.dispatch(ctx.request, ctx.response, onError(ctx));
    await next();
  };
};

/* [Public] */
export const init:Function = (routesConfig:Route[]):Middleware => {
  const routes:Object = routesAdapter(routesConfig);
  const router:Object = createRouter(routes);
  return routerMiddleware(router);
};

export default init;
