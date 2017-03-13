import router, { __test__ as t } from '../router';
import director from 'director';

jest.mock('director', () => {
  const dispatchMock = jest.fn();
  return {
    http: {
      Router: jest.fn(() => {
        return { dispatch: dispatchMock };
      }),
    },
  };
});

describe('router', () => {
  const ROUTES_CONFIG = [{
    method: 'GET',
    path: '/test-route',
    handler: async () => 'test-route',
  }, {
    method: 'POST',
    path: '/test-post-route',
    handler: async () => 'test-post-route',
  }];

  beforeEach(() => {
    director.http.Router().dispatch.mockClear();
    director.http.Router.mockClear();
  });

  test('it calls director.http.Router to retrieve a router instance', () => {
    router(ROUTES_CONFIG);
    expect(director.http.Router).toHaveBeenCalled();
  });

  test('it adapts the routes object to director\'s format before calling director.http.Router', () => {
    router(ROUTES_CONFIG);

    const expectedRoute1 = ROUTES_CONFIG[0].path;
    const expectedRoute2 = ROUTES_CONFIG[1].path;
    const route1Method = ROUTES_CONFIG[0].method.toLowerCase();
    const route2Method = ROUTES_CONFIG[1].method.toLowerCase();
    const routesObject = director.http.Router.mock.calls[0][0];

    expect(routesObject).toHaveProperty(expectedRoute1);
    expect(routesObject).toHaveProperty(expectedRoute2);
    expect(routesObject[expectedRoute1]).toHaveProperty(route1Method);
    expect(routesObject[expectedRoute2]).toHaveProperty(route2Method);
  });

  test('it returns a router middleware that dispatches director when called', async () => {
    const middleware = router(ROUTES_CONFIG);
    const request = 'mock-request';
    const response = 'mock-response';
    const next = jest.fn();
    const ctx = { request, response };
    await middleware(ctx, next);
    expect(director.http.Router().dispatch).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
