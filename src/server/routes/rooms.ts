import express from 'express';
import { tradfri } from '../services/Tradfri';
import { getControllableRooms, operateLightOrRoom } from '../services/tradfri-controller';
import type { UpdateLightOperation } from 'src/common';
import type { LightOperation } from 'node-tradfri-client';

const router = express.Router();

router.get('/', async (req, res) => {
  return res.json(getControllableRooms());
});

router.put('/:room', async (req, res) => {
  const { room } = req.params;
  const operation: UpdateLightOperation = req.body;
  const { success, result, error } = await operateLightOrRoom(operation, (operation: LightOperation) =>
    tradfri.updateRoom(room, operation)
  );
  if (!success) {
    return res.status(400).json(error);
  }
  return res.json(result);
});

export default router;
