# discord-signal-notify

A simple bot that sends Discord voice channel notifications to Signal. When someone hops into a voice channel, their friends get a message in [Signal](https://signal.org/) about it!

![screenshot](./readme/screenshot.png)

This bot requires [signal-cli](https://github.com/AsamK/signal-cli) to be set up on your machine. This is currently a single-tenant solution - it'll only work with one Signal account and group. Maybe one day I'll make it fancier with [signald](https://signald.org/), but for now it does exactly what I need: gluing discord and signal together

## Requirements

- Node.js 20+
- signal-cli
- A Discord server (and enough privileges to install a bot)
- A Signal account

## Setting up Signal CLI

1. Setup signal-cli and add your Signal account to the group you want to notify. See [signal-cli's documentation](https://github.com/AsamK/signal-cli) 

```bash
export VERSION=0.13.12 # replace this with the latest version
wget https://github.com/AsamK/signal-cli/releases/download/v"${VERSION}"/signal-cli-"${VERSION}".tar.gz
sudo tar xf signal-cli-"${VERSION}".tar.gz -C /opt
sudo ln -sf /opt/signal-cli-"${VERSION}"/bin/signal-cli /usr/local/bin/
```

2. Obtain link code

```console
> signal-cli link
sgnl://linkdevice?...
```

3. Use QR code generator such as https://qr.io to generate `text` QR code from `sgnl://linkdevice?...`

3. Scan QR code with your signal app to link your account to signal-cli

4. Receive some messages and find your group id

```console
> signal-cli -u YOUR_NUMBER receive
...
  Group info:
    Id: 1234 <--- this
    Name: My Group
    Revision: 1
    Type: UPDATE
...
```

Record the group id and your phone number. You'll need them to configure the bot.

## Discord

There is no shortage of guides that can help you setup a custom discord bot, but here is a quick rundown

1. Go to https://discord.com/developers/applications and create a discord app
2. Give the Guild Install 
Scopes: `bot`
Permissions: `Manage Messages`

## Running the bot 

1. Create `.env` file with the following contents:

```console
# Bot Token
DISCORD_TOKEN=YourDiscordToken

# Signal Details
SIGNAL_PHONE_NUMBER=+123yourphonenumber
SIGNAL_GROUP_ID=your-signal
SIGNAL_CLI_PATH=/path/to/signal-cli

# Optional: Channel to ignore (won't send notifications when users join this channel)
# IGNORED_CHANNEL_ID=1234567890123456789
```

2. Install dependencies and run the bot

```console
npm i

npm build

npm start
```

and away you go!
