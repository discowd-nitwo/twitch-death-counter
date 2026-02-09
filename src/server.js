const express = require('express');
const tmi = require('tmi.js');
const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const app = express();

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.channel,
    password: process.env.accessToken
  },
  channels: [process.env.channel]
});

client.connect().catch(console.error);

let deathCount = 0;

client.on('message', (channel, tags, message, self) => {
  if (self) return;
  
  const msg = message.toLowerCase();
  
  if (msg === '!death' || msg === '!died' && tags.mod) {
    deathCount++;
    client.say(channel, `Death added. Now ${deathCount} deaths!`);
  }
  
  if (msg === '!deaths') {
    client.say(channel, `Current death count: ${deathCount}`);
  }
  
  if (msg === '!resetdeaths' && tags.mod) {
    deathCount = 0;
    client.say(channel, `Deaths reset. Now ${deathCount} deaths!`);
  }
  
  if (msg === '!undodeath' && tags.mod) {
    if (deathCount > 0) {
      deathCount--;
      client.say(channel, `Death removed. Now ${deathCount} deaths!`);
    }
  }
});

app.use(express.json());

app.get('/deathcount', (req, res) => {
  res.json({ deathCount });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public/html' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} | http://localhost:${process.env.PORT} | Channel: ${process.env.channel} `);
});