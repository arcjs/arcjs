const DEFAULT_ROUTES = [{
  method: 'GET',
  path: '/health-check',
  handler() {},
}];

const router = (routesConfig = []) => async ctx => {
  const routes = [ ...DEFAULT_ROUTES, ...routesConfig ];
  // Server-side router logic here
  ctx.body = routes[1].handler(); // Placeholder logic
};

export default router;
