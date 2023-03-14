# Telegram Bot for accessing the brave summarizer

# Installation
- To run locally just npm i
- Add token to a .env file as in the format in .env_example file
- run it

## to run it in a server

- add the --no-sandbox args if root
- assuming nodejs and npm are installed we need some more for running via server

```
apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps
```


It probably would work in headless mode but I am running it via a virtual screen

```
xvfb-run --server-args="-screen 0 1024x768x24" node app.mjs
```

bot is available on https://t.me/bravethebot
bot is very slow as I am on capacity on my current bot server
- TODO: Upgrade server / delete some bots
