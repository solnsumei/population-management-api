import Router from 'koa-router';
import LocationController from './controllers/LocationController';
import {
  validateParentId,
  validateLocationId,
  validateCreateLocationRequest,
  validateUpdateLocationBody
} from './middlewares/locationValidation';

const apiRouter = new Router({ prefix: '/api/v1' });

apiRouter.get('/locations',
  LocationController.fetchAll,
);

apiRouter.post('/locations',
  validateCreateLocationRequest(),
  validateParentId,
  LocationController.create,
);

apiRouter.get('/location/:id',
  validateLocationId(),
  LocationController.fetchOne,
);

apiRouter.put('/location/:id',
  validateLocationId(),
  validateUpdateLocationBody(),
  LocationController.update,
);

apiRouter.delete('/location/:id',
  validateLocationId(),
  LocationController.delete,
);

export default apiRouter;
