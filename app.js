require('dotenv').config({ path: './w3s-dynamic-storage/.env' });
const express = require('express');
const handlebars = require('express-handlebars');
const {insertKeyValuePair, deleteKeyValuePair, getKeyValuePairs, addPageCounter, getPagesCounterLength, getKeyCounterLength, createTableIfNotExist} = require('./db');
const axios = require('axios');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: __dirname + '/views/partials/',
  runtimeOptions: {
    data: {
      NODE_ENV: process.env.NODE_ENV,
    }
  },
}));

app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/', (req, res) => {
  createTableIfNotExist()
  res.redirect('/items');
});

app.get('/items', async (req, res) => {
  addPageCounter(req.route.path);
  const getPageCounter = await getPagesCounterLength();
  const counter = getPageCounter.data;
  const data = await getKeyValuePairs();
  const dataExists = !!data.length;
  const itemsLength = data.length;
  res.render('key-value-pairs', { dataExists, data, itemsLength, counter});
});

app.post('/api/post', async (req, res) => {
  addPageCounter(req.route.path);
  promise = await insertKeyValuePair({
    key: req.body.key,
    value: req.body.value,
  })
  const counter = await getKeyCounterLength();
  return res.json({promise, counter})
});

app.delete('/api/delete', async (req, res) => {
  addPageCounter(req.route.path);
  data = await deleteKeyValuePair(req.body.id);
  const counter = await getKeyCounterLength();
  return res.json({data, counter})
});

const server = http.createServer(app);

//Development
if (process.env.NODE_ENV === 'development') {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.send('connected');
    const interval = setInterval(() => {
      ws.ping();
    }, 30000);
  });
}

server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});


