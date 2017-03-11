import koaLogger from 'koa-bunyan';
import bunyan from 'bunyan';

const logger = name => bunyan.createLogger({ name });

export const loggerMiddleware = config => {
  return koaLogger(logger(config.name), { timeLimit: 100 });
};

export default loggerMiddleware;
