import dotenv from 'dotenv';
import express from 'express';
import roomsRouter from './routes/rooms';
import lightsRouter from './routes/lights';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
  });
}
app.use(express.json());
app.use('/rooms', roomsRouter);
app.use('/lights', lightsRouter);

app.listen(port);

console.log(`Listening on http://localhost:${port}`);
