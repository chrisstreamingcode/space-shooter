import { join } from 'path';
import express from 'express';

const PORT = process.env.PORT || 8000;
const app = express();

app.use('/client', express.static(join(__dirname, '../client')));
app.use('/public', express.static(join(__dirname, '../public')));

app.get('/client/**', (_, res) => res.status(404).end('404 Not Found'));
app.get('/public/**', (_, res) => res.status(404).send('404 Not Found'));

app.get('/favicon.ico', (_, res) => {
  res.status(200).header("Expires", (new Date(Date.now() + 1000 * 60 * 60 * 24 * 365))
      .toUTCString()).end();
});

app.get('/', (_, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});