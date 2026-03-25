import { Router } from 'express';
import * as reputationController from '../controllers/reputation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/attestation/:walletAddress', reputationController.getAttestation);

router.use(authMiddleware);

router.get('/calculate', reputationController.calculateScore);
router.post('/anchor', reputationController.anchorScore);

export default router;
