import express from 'express';

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

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Emit');
  res.write(`data: Hello\n\n`);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

export default router;
