import express from 'express';
import { TradfriEvents, TradfriLightInfo } from 'src/common';
import { tradfri } from '../services/Tradfri';

const router = express.Router();

interface ClientListener {
  id: number;
  response: express.Response;
}

let clients: ClientListener[] = [];

router.get('/', async (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response: res,
  };

  clients.push(newClient);

  console.log(`${clientId} Connection opened`);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

function sendEvent(event: keyof TradfriEvents, data: string | TradfriLightInfo): void {
  clients.forEach((c) => {
    c.response.write(`event: ${event}\n`);
    c.response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

tradfri.addListener('lightUpdate', async (light: TradfriLightInfo) => {
  console.log(`Emitting light update to ${light?.id}`);
  sendEvent('lightUpdate', light);
});

export default router;
