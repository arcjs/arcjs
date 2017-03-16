// @flow
import director from 'director';

/* [Type Definitions] */
import type { Middleware, Route } from './types';

/* [Private] */
const createRouter: Function = (routes: Object): Object =>
  new director.http.Router(routes);

const setResponse: Function = async (
  route: Route,
  ctx: Object,
): Promise<void> => {
  // ctx.res and ctx.req are side effects and must be directly mutated
  ctx.res.body = await route.handler(ctx.req); // eslint-disable-line
  if (route.hasOwnProperty('status')) ctx.res.status = route.status; // eslint-disable-line
};

const handlerAdapter: Function = (route: Route): Function =>
  function routeHandler(): void {
    setResponse(route, this);
  };

const routeAdapter: Function = (route: Route): Object => ({
  [route.method.toLowerCase()]: handlerAdapter(route),
});

const routesAdapterReducer: Function = (r0: Object, r1: Route): Object => ({
  ...r0,
  [r1.path]: {
    ...r0[r1.path],
    ...routeAdapter(r1),
  },
});

const routesAdapter: Function = (routes: Route[]): Object =>
  routes.reduce(routesAdapterReducer, {});

const notFoundHandler: Function = (req: Object): string =>
  `Page: ${req.url} not found`;
const onError: Function = (ctx: Object): Function =>
  async (err: Object): Promise<void> => {
    if (err.status === 404) {
      // ctx.res and ctx.req are side effects and must be directly mutated
      ctx.response.body = notFoundHandler(ctx.request); // eslint-disable-line
      ctx.response.status = 404; // eslint-disable-line
    }
    // TODO: Log errors
  };

const routerMiddleware: Function = (router: Object): Middleware =>
  async (ctx: Object, next: Function): Promise<void> => {
    router.dispatch(ctx.request, ctx.response, onError(ctx));
    await next();
  };

/* [Public] */
export const init: Function = (routesConfig: Route[]): Middleware => {
  const routes: Object = routesAdapter(routesConfig);
  const router: Object = createRouter(routes);
  return routerMiddleware(router);
};

export default init;
