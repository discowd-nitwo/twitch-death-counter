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

client.on('connected', (address, port) => {
  console.log(`Connected to Twitch chat at ${address}:${port}`);
  console.log(`Twitch Bot connected as ${client.getUsername()}`)
});

let deathCount = 0;

client.on('message', (channel, tags, message, self) => {
  if (self) return;
  
  const msg = message.toLowerCase();
  const args = msg.split(' ');
  
  if ((args[0] === '!death' || args[0] === '!died') && (tags.mod || tags['badges'].broadcaster)) {
    const amount = parseInt(args[1]) || 1;
    if (amount > 0) {
      deathCount += amount;
      console.log(`${tags['display-name']}: added ${amount} deaths. Total: ${deathCount}`);
      client.say(channel, `@${tags['display-name']}, added ${amount} deaths. Now ${deathCount} deaths!`);
    }
  }

  if ((args[0] === '!setdeaths' || args[0] === '!setdeathcount') && (tags.mod || tags['badges'].broadcaster)) {
    const amount = parseInt(args[1]);
    if (!isNaN(amount) && amount >= 0) {
      deathCount = amount;
      console.log(`${tags['display-name']} set the death count to ${deathCount}`);
      client.say(channel, `@${tags['display-name']}, death count set to ${deathCount} deaths!`);
    }
  }
  
  if (msg === '!deaths') {
    client.say(channel, `@${tags['display-name']}, current death count: ${deathCount}`);
  }
  
  if (msg === '!resetdeaths' && (tags.mod || tags['badges'].broadcaster)) {
    deathCount = 0;
    console.log(`${tags['display-name']} reset the death count to 0`);
    client.say(channel, `@${tags['display-name']}, deaths reset. Now ${deathCount} deaths!`);
  }
  
  if (msg === '!undodeath' && (tags.mod || tags['badges'].broadcaster)) {
    if (deathCount > 0) {
      deathCount--;
      console.log(`${tags['display-name']} removed 1 death. Total: ${deathCount}`);
      client.say(channel, `@${tags['display-name']}, death removed. Now ${deathCount} deaths!`);
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