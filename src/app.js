import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import apiRouter from './apiRouter';
import initDb from './db';

// Initialize app
const app = new Koa();
const router = new Router();

// Use body parser middleware
app.use(BodyParser());

// Use the logger middleware
app.use(logger());

// Default error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
});

// Use apiRouter middleware routes
app.use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

router.get('/', (ctx) => {
  ctx.body = { message: 'Welcome to Population Management API' };
});

// use home router middleware routes
app.use(router.routes())
  .use(router.allowedMethods());

app.use(async (ctx) => {
  ctx.body = { message: 'Route not found' };
  ctx.status = 404;
});

initDb();

export default app;
