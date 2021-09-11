<h1 align="center"><strong>XOPPACK</h1></strong>
<p align="center">
    <a href="https://www.npmjs.com/package/xoppack"><img src="https://img.shields.io/npm/v/xoppack.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/xoppack"><img src="https://img.shields.io/npm/dt/xoppack.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://discord.gg/invite/dPXTa2XERS"><img src="https://badgen.net/discord/online-members/dPXTa2XERS" alt="Discord"></a>
</p>

## **📥 Installation**
```js
npm i xoppack
```

- Only Supports Discord.js@12.5.3 And Lower Versions Of V12

```js
npm i xoppack@beta
```

- Only Supports Discord.js@13.1.0 And Lower Versions Of V13

## **📤 Update**
```js
npm i xoppack@latest
```

## **XOP Connect 4 Game**
```js
const Discord = require('discord.js');
const { XOPConnect4 } = require("xoppack") //<----Always Define XOPPACK---->

module.exports = {
    name: "connect4",
    cooldown: 10, //<----Your Bots Cooldown!---->[optional]
    permissions: ["SEND_MESSAGES"], //<----Your Member Permissions!---->[optional]
    clientpermissions: ["SEND_MESSAGES", "EMBED_LINKS"], //<----Your Bots Permissions!---->[optional]
    description: "connect4 in discord!",
    async execute(client, message, cmd, args, Discord) { //<----Your Parameters---->
        if (!args[0]) {
            const noch = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor('#c30202')
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`**\`(prefix)connect4 <@user>\`**`)
            return message.lineReplyNoMention(noch)
        }
        new XOPConnect4({
            message: message,
            opponent: message.mentions.users.first(),
            embed: {
                title: 'Connect 4 Game',
                color: '#c30202',
            },
            emojis: {
                player1: '🔴',
                player2: '🟡'
            },
            turnMessage: 'Its Now **{player}** Turn!',
            winMessage: '**{winner}** Won The Game!',
            gameEndMessage: 'The Game Was Unfinished!',
            drawMessage: 'The Game Ended With A Draw!',
            askerMessage: 'Hey **{opponent}**, **{challenger}** Challenged You For A Game Of Connect 4!',
            cancelMessage: 'Looks Like They Didn\`t Want To Play!',
            timerEndMessage: 'Since The Opponent Didnt Answer, I Ended The Game!',
        }).startGame();
    },
};
```

## **XOP Snake Game**
```js
const { XOPSnake } = require("xoppack") //<----Always Define XOPPACK---->

module.exports = {
    name: "snake",
    cooldown: 10, //<----Your Bots Cooldown!---->[optional]
    permissions: ["SEND_MESSAGES"], //<----Your Member Permissions!---->[optional]
    clientpermissions: ["SEND_MESSAGES", "EMBED_LINKS"], //<----Your Bots Permissions!---->[optional]
    description: "snake in discord!",
    async execute(client, message, cmd, args, Discord) { //<----Your Parameters---->
        new XOPSnake({
            message: message,
            embed: {
                title: 'Snake Game',
                color: '#c30202',
                OverTitle: "Game Over!",
            },
            snake: { head: '🔴', body: '🟥', tail: '🔴' },
            emojis: {
                board: '⬛',
                food: '🍌',
                up: '⬆️',
                right: '➡️',
                down: '⬇️',
                left: '⬅️',
            },
            othersuserMessage: '**You Are Not Allowed To Use The Buttons For The Snake Game!**',
        }).startGame();
    },
};
```

## **🤳 Outcome**
<img src ='https://cdn.discordapp.com/attachments/824319314495537175/886195077494476850/Screenshot_2021-09-11_132043.png'>

## **👥 Discord Server**
<a href="https://discord.gg/invite/dPXTa2XERS"><img src="https://invidget.switchblade.xyz/dPXTa2XERS" alt="Discord"></a>