import director from 'director';
import chalk from 'chalk';

const DEFAULT_ROUTES = [{
  method: 'GET',
  path: '/health-check',
  handler: async () => '',
}];

const createRouter = routes => new director.http.Router(routes);

const setResponse = async (route, ctx) => {
  ctx.res.body = await route.handler(ctx.req);
  if (route.hasOwnProperty('status')) ctx.res.status = route.status;
};

const handlerAdapter = route => function() {
  setResponse(route, this);
};

const routeAdapter = route => {
  return { [route.method.toLowerCase()]: handlerAdapter(route) };
};

const routesAdapter = (routes) => {
  return routes.reduce((acc, route) => {
    return {
      ...acc,
      [route.path]: {
        ...acc[route.path],
        ...routeAdapter(route),
      },
    };
  }, {});
};

const notFoundHandler = req => `Page: ${req.url} not found`;
const onError = ctx => async err => {
  if (err.status === 404) ctx.response.body = notFoundHandler(ctx.request);
  // TODO: Log errors
};

const routerMiddleware = router => async (ctx, next) => {
  router.dispatch(ctx.request, ctx.response, onError(ctx));
  await next();
};

const init = (routesConfig = []) => {
  const routes = routesAdapter([ ...DEFAULT_ROUTES, ...routesConfig ]);
  const router = createRouter(routes);
  return routerMiddleware(router);
};

export default init;
