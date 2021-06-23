import dotenv from 'dotenv';
import express from 'express';
import roomsRouter from './server/routes/rooms';
import lightsRouter from './server/routes/lights';
import lightEventHandler from './server/events/lights';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use('/light-events', lightEventHandler);

app.use(express.json());
app.use('/rooms', roomsRouter);
app.use('/lights', lightsRouter);

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
