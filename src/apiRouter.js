import Router from 'koa-router';
import LocationController from './controllers/LocationController';
import UserController from './controllers/UserController';
import { jwtInstance, JWTErrorHandler } from './utils/jwt';
import {
  validateParentId,
  validateLocationId,
  validateCreateLocationRequest,
  validateUpdateLocationBody
} from './middlewares/locationValidation';

import {
  validateRegistrationRequest,
  validateLoginRequest,
} from './middlewares/userValidation';


const apiRouter = new Router({ prefix: '/api/v1' });

// Auth routes
apiRouter.post('/register',
  validateRegistrationRequest(),
  UserController.register,
);

apiRouter.post('/login',
  validateLoginRequest(),
  UserController.login,
);

// Location routes
apiRouter.get('/locations',
  LocationController.fetchAll,
);

apiRouter.get('/location/:id',
  validateLocationId(),
  LocationController.fetchOne,
);

// Protected routes
apiRouter.use(JWTErrorHandler).use(jwtInstance());

apiRouter.post('/locations',
  validateCreateLocationRequest(),
  validateParentId,
  LocationController.create,
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
