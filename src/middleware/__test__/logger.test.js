import logger, { __test__ as t } from '../logger';
import koaLogger from 'koa-bunyan';
import bunyan from 'bunyan';

jest.mock('bunyan');
jest.mock('koa-bunyan');

describe('logger', () => {
  const NAME = 'test-name';

  beforeEach(() => {
    bunyan.createLogger.mockClear();
    bunyan.mockClear();
    koaLogger.mockClear();
  });

  test('it creates a logger through bunyan.createLogger', () => {
    logger(NAME);
    expect(bunyan.createLogger).toHaveBeenCalled();
  });

  test('it passes the name through to bunyan.createLogger', () => {
    const param = expect.objectContaining({ name: NAME });
    logger(NAME);
    expect(bunyan.createLogger).toHaveBeenCalledWith(param);
  });

  test('it sets a default time limit to the logger', () => {
    const expectedOptions = { timeLimit: t.DEFAULT_TIMELIMIT };
    const expectedMatcher = expect.objectContaining(expectedOptions);
    logger(NAME);
    expect(koaLogger).toHaveBeenCalledWith(undefined, expectedMatcher);
  });

  test('it passes the bunyan logger to koa-bunyan', () => {
    const expectedArg0 = { name: NAME };
    const arg0Matcher = expect.objectContaining(expectedArg0);
    const expectedArg1 = { timeLimit: t.DEFAULT_TIMELIMIT };
    const arg1Matcher = expect.objectContaining(expectedArg1);
    bunyan.createLogger.mockImplementationOnce(n => ({ name: n.name }));
    logger(NAME);
    expect(koaLogger).toHaveBeenCalledWith(arg0Matcher, arg1Matcher);
  });
});
