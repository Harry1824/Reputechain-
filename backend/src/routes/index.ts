import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import reputationRoute from './reputation.route';

const router = Router();

export const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/reputation',
    route: reputationRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
