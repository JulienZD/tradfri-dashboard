import express from 'express';
import { tradfri } from '../services/Tradfri';
import { operateLightOrRoom } from '../services/tradfri-controller';
import type { UpdateLightOperation } from 'src/common';
import type { LightOperation } from 'node-tradfri-client';

const router = express.Router();

router.put('/:light', async (req, res) => {
  const { light } = req.params;
  const operation: UpdateLightOperation = req.body;

  const { success, result, error } = await operateLightOrRoom(operation, (operation: LightOperation) =>
    tradfri.updateLight(+light, operation)
  );
  if (!success) {
    return res.status(400).json(error);
  }
  return res.json(result);
});

router.get('/:light', async (req) => {
  const { light } = req.params;
  return tradfri.getLightInfo(+light);
});

export default router;
