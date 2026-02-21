# twitch-death-counter
run `npm install` and rename `.env.example` to `.env`.

get a twitch chat bot token from https://twitchtokengenerator.com/ and paste it after the `oauth:` in your `.env` file.

if you are using a different account for the bot instead of the broadcaster please change the username in `server.js` from `process.env.channel` to the name of your bot in quotes.

the port is completely up to you, i use 8888. To use the overlay you make a browser source as normal but make the url `http://localhost:8888` (replace 8888 with the port you chose in `.env` if you have edited it.) you should just need to change the width and height to 1920x1080 and you can choose to zoom it in or out in obs. 

it polls the api every second so there can be a few milliseconds of delay between the bot responding in chat and the overlay updating but its pretty fast. feel free to make changes but please credit me for the original code if you do publish it anywhere.

thanks

## Known Issues
`If a non-mod runs a command it may crash` -> Working on fixing this

*updates are pushed every once in a while, make sure to check back for any updates*
