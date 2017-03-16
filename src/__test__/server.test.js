import server from '../server';
import Koa from 'koa';
import chalk from 'chalk';

jest.mock('koa');
jest.mock('chalk', () => ({ green: jest.fn() }));

describe('server.js module imported', () => {
  test('it instantiates an instance of Koa', () => {
    expect(Koa.prototype.constructor).toHaveBeenCalled();
  });
});

describe('#register', () => {
  const MOCK_MIDDLEWARE_0 = async (ctx, next) => next('0');
  const MOCK_MIDDLEWARE_1 = async (ctx, next) => next('1');

  beforeEach(() => {
    Koa.prototype.use.mockClear();
  });

  test('it calls koa.register with the middleware function passed in', () => {
    server.register(MOCK_MIDDLEWARE_0);
    expect(Koa.prototype.use).toHaveBeenCalledWith(MOCK_MIDDLEWARE_0);
  });

  test('it calls koa.register with all of the middleware functions passed in', () => {
    server.register(MOCK_MIDDLEWARE_0, MOCK_MIDDLEWARE_1);
    expect(Koa.prototype.use).toHaveBeenCalledTimes(2);
    expect(Koa.prototype.use).toHaveBeenCalledWith(MOCK_MIDDLEWARE_0);
    expect(Koa.prototype.use).toHaveBeenCalledWith(MOCK_MIDDLEWARE_1);
  });
});

describe('#listen', () => {
  const PORT = 3000;

  beforeAll(() => {
    global.console.log = jest.fn();
  });

  beforeEach(() => {
    chalk.green.mockClear();
    global.console.log.mockClear();
    Koa.prototype.listen.mockClear();
  });

  test('it calls koa.listen with the port number passed in', () => {
    server.listen(PORT);
    expect(Koa.prototype.listen).toHaveBeenCalledWith(PORT);
  });

  test('it logs the port that the server is being started on', () => {
    chalk.green.mockImplementationOnce(v => v);
    server.listen(PORT);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(`${PORT}`),
    );
  });
});
