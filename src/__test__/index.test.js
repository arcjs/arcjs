import arc, { __test__ as t } from '../index';
import server from '../server';
import logger from '../middleware/logger';
import router from '../middleware/router';

jest.mock('../server');
jest.mock('../middleware/logger');
jest.mock('../middleware/router');

const options = {
  valid: {
    name: 'test-server',
    logger: true,
    port: 3000,
    routes: [{
      method: 'GET',
      path: 'arc-test',
      handler: async () => 'Arc: pop quiz!',
    }],
  },
  noLogger: {
    logger: false,
  },
  empty: {},
};

const mockResponse = args => ({ mock: args });

describe('#start', () => {
  beforeEach(() => {
    server.listen.mockClear();
    server.register.mockClear();
    router.mockClear();
    logger.mockClear();
  });

  test('it calls router with the health check route', () => {
    arc.start(options.valid);
    expect(router).toHaveBeenCalledWith(expect.arrayContaining([t.HEALTH_CHECK_ROUTE]));
  });

  test('it only registers the default routes when routes is not provided in the options', () => {
    arc.start(options.empty);
    expect(router).toHaveBeenCalledWith(t.DEFAULT_ROUTES);
  });

  test('it calls router with any configured route', () => {
    arc.start(options.valid);
    expect(router).toHaveBeenCalledWith(expect.arrayContaining(options.valid.routes));
  });

  test('it calls server.register with the response from router', () => {
    router.mockImplementationOnce(mockResponse);
    arc.start(options.valid);
    expect(server.register).toHaveBeenCalledWith({ mock: t.DEFAULT_ROUTES.concat(options.valid.routes) });
  });

  test('it doesn\'t call logger when logger is set to false in the options', () => {
    arc.start(options.noLogger);
    expect(logger).not.toHaveBeenCalled();
  });

  test('it calls logger with the configured name', () => {
    arc.start(options.valid);
    expect(logger).toHaveBeenCalledWith(options.valid.name);
  });

  test('it calls logger with the default name when name is not provided in the options', () => {
    arc.start(options.empty);
    expect(logger).toHaveBeenCalledWith(t.DEFAULT_NAME);
  });

  test('it calls server.register with the response from logger', () => {
    logger.mockImplementationOnce(mockResponse);
    arc.start(options.valid);
    expect(server.register).toHaveBeenCalledWith({ mock: options.valid.name });
  });

  test('it calls server.listen with the configured port', () => {
    arc.start(options.valid);
    expect(server.listen).toHaveBeenCalledWith(options.valid.port);
  });
});
