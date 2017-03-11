// @flow
/* [Middleware] */
export type Middleware = (ctx: Object, next: Function) => mixed;

/* [Router] */
export type Route = {
  method: string,
  path: string,
  handler: Function,
  status?: number,
};
