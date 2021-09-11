const { MessageEmbed } = require('discord.js')
const { MessageButton, MessageActionRow } = require('discord-buttons')
const choice = { r: '🌑', p: '📃', s: '✂️' };
require('discord-reply')
const lineReplyNoMention = require('discord-reply')

class XOPRPSGame {
    constructor(options = {}) {
        if (!options.message) throw new TypeError('NO_MESSAGE: Please Provide A Message!')
        if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: Invalid Discord Message!')
        if (!options.opponent) throw new TypeError('NO_OPPONENT: Please Mention A User!')
        if (typeof options.opponent !== 'object') throw new TypeError('INVALID_OPPONENT: Invalid Discord User!')


        if (!options.embed) options.embed = {};
        if (!options.embed.title) options.embed.title = 'Rock Paper Scissors';
        if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_TITLE: Embed Title Must Be A Message!')
        if (!options.embed.description) options.embed.description = 'Press A Button Below To Start!';
        if (typeof options.embed.description !== 'string') throw new TypeError('INVALID_TITLE: Embed Title Must Be A Message!')
        if (!options.embed.color) options.embed.color = '#5865F2';
        if (typeof options.embed.color !== 'string') throw new TypeError('INVALID_COLOR: Embed Color Must Be A Message!.')

        if (!options.buttons) options.buttons = {};
        if (!options.buttons.rock) options.buttons.rock = 'Rock';
        if (typeof options.buttons.rock !== 'string') throw new TypeError('INVALID_BUTTON: The Rock Emoji Button Must Be Valid!')
        if (!options.buttons.paper) options.buttons.paper = 'Paper';
        if (typeof options.buttons.paper !== 'string') throw new TypeError('INVALID_BUTTON: The Paper Emoji Button Must Be Valid!')
        if (!options.buttons.scissors) options.buttons.scissors = 'Scissors';
        if (typeof options.buttons.scissors !== 'string') throw new TypeError('INVALID_BUTTON: The Scissors Emoji Button Must Be Valid!')


        if (!options.askerMessage) options.askerMessage = 'Hey {opponent}, {challenger} challenged you for a game of Rock Paper Scissors!';
        if (typeof options.askerMessage !== 'string') throw new TypeError('ASK_MESSAGE: Asker Message Must Be A String!')
        if (!options.cancelMessage) options.cancelMessage = 'Looks like they refused to have a game of Rock Paper Scissors. \:(';
        if (typeof options.cancelMessage !== 'string') throw new TypeError('CANCEL_MESSAGE: Cancel Message Must Be A String!.')
        if (!options.timerEndMessage) options.timerEndMessage = 'Since the opponent didnt answer, i dropped the game!';
        if (typeof options.timerEndMessage !== 'string') throw new TypeError('Time_End_MESSAGE: Timer End Message Must Be A String!')
        if (!options.othersuserMessage) options.othersuserMessage = 'You are not allowed to use buttons for this message!';
        if (typeof options.othersuserMessage !== 'string') throw new TypeError('INVALID_OTHERS_MESSAGE: Others Message must be a string.')
        if (!options.chooseMessage) options.chooseMessage = 'You choose {emoji}!';
        if (typeof options.chooseMessage !== 'string') throw new TypeError('INVALID_CHOOSE_MESSAGE: Choose Message must be a string.')
        if (!options.noChangeMessage) options.noChangeMessage = 'You cannot change your selection!';
        if (typeof options.noChangeMessage !== 'string') throw new TypeError('INVALID_NOCHANGE_MESSAGE: noChange Message must be a string.')

        if (!options.gameEndMessage) options.gameEndMessage = 'The game went unfinished :(';
        if (typeof options.gameEndMessage !== 'string') throw new TypeError('GAME_END_MESSAGE: Game End Message must be a string.')
        if (!options.winMessage) options.winMessage = '{winner} won the game!';
        if (typeof options.winMessage !== 'string') throw new TypeError('WIN_MESSAGE: Win Message must be a string.')
        if (!options.drawMessage) options.drawMessage = 'It was a draw!';
        if (typeof options.drawMessage !== 'string') throw new TypeError('DRAW_MESSAGE: Draw Message must be a string.')

        this.inGame = false;
        this.options = options;
        this.opponent = options.opponent;
        this.message = options.message;
    }

    async startGame() {
        if (this.inGame) return;
        const author = this.message.author;
        const opponent = this.opponent;
        const emoji = this.options.emoji ? this.options.emoji : '';

        if (opponent.bot) return this.message.lineReplyNoMention(`**${emoji} Sorry But You Cant Play With Bots!**`)
        if (opponent.id === author.id) return this.message.lineReplyNoMention(`**${emoji} Are You Alright? You Cannot Play With Yourself!**`)

        const embed = new MessageEmbed()
            .setTimestamp()
            .setTitle(this.options.embed.title)
            .setDescription(this.options.askerMessage
                .replace('{challenger}', '<@!' + this.message.author.id + '>')
                .replace('{opponent}', '<@!' + this.opponent.id + '>'))
            .setColor(this.options.green || this.options.embed.color)

        let btn1 = new MessageButton().setLabel('Accept').setStyle('SUCCESS').setCustomId('accept')
        let btn2 = new MessageButton().setLabel('Reject').setStyle('DANGER').setCustomId('reject')
        let row = new MessageActionRow().addComponents(btn1, btn2);
        const askMsg = await this.message.channel.send({ embed: [embed], components: [row] });

        const filter = (interaction) => interaction === interaction;
        const interaction = askMsg.createMessageComponentCollector({
            filter, time: 60000
        })

        interaction.on('collect', async (btn) => {
            if (btn.user.id !== this.opponent.id) {
                return btn.reply({ content: this.options.otherssuserMessage, ephemeral: true })
            }

            await btn.deferUpdate();
            if (btn.customId === 'reject') {
                for (let y = 0; y < askMsg.components[0].components.length; y++) {
                    askMsg.components[0].components[y].disabled = true;
                }

                if (this.options.red) askMsg.embeds[0].color = this.options.red;
                askMsg.embeds[0].description = this.options.cancelMessage.replace('{opponent}', '<@!' + this.opponent.id + '>').replace('{challenger}', '<@!' + this.message.author.id + '>')
                return askMsg.edit({ embed: askMsg.embeds, components: askMsg.components });

            } else if (btn.customId === 'accept') {
                askMsg.delete().catch();
                this.RPSGame();
            }
        });

        interaction.on('end', (c, r) => {
            if (r !== 'time') return;
            for (let y = 0; y < askMsg.components[0].components.length; y++) {
                askMsg.components[0].components[y].disabled = true;
            }

            if (this.options.red) askMsg.embeds[0].color = this.options.red;
            askMsg.embeds[0].description = this.options.timerEndMessage.replace('{opponent}', '<@!' + this.opponent.id + '>').replace('{challenger}', '<@!' + this.message.author.id + '>');
            return askMsg.edit({ embed: askMsg.embeds, components: askMsg.components });
        });
    }

    async RPSGame() {
        this.inGame = true;

        let btn_a1 = 'r_' + i(15)
        let btn_a2 = 'p_' + i(15)
        let btn_a3 = 's_' + i(15)

        const embed = new MessageEmbed()
            .setTimestamp()
            .setTitle(this.options.embed.title)
            .setDescription(this.options.embed.description)
            .setColor(this.options.embed.color)

        let rock = new MessageButton().setCustomId(btn_a1).setStyle("PRIMARY").setLabel(this.options.buttons.rock).setEmoji('🌑')
        let paper = new MessageButton().setCustomId(btn_a2).setStyle("PRIMARY").setLabel(this.options.buttons.paper).setEmoji('📃')
        let scissors = new MessageButton().setCustomId(btn_a3).setStyle("PRIMARY").setLabel(this.options.buttons.scissors).setEmoji('✂️')
        let row2 = new MessageActionRow().addComponents(rock, paper, scissors)

        const msg = await this.message.channel.send({ embed: [embed], components: [row2] })

        let challenger_choice;
        let opponent_choice;
        const filter = m => m;
        const collector = msg.createMessageComponentCollector({
            filter, // Filter
            time: 120000, // 120 seconds
        })

        collector.on('collect', async btn => {
            if (btn.user.id !== this.message.author.id && btn.user.id !== this.opponent.id) {
                return btn.reply({ content: this.options.otherssuserMessage, ephemeral: true })
            }

            if (btn.user.id == this.message.author.id) {
                if (challenger_choice) {
                    return btn.reply({ content: this.options.noChangeMessage, ephemeral: true })
                }
                challenger_choice = choice[btn.customId.split('_')[0]];

                btn.reply({ content: this.options.chooseMessage.replace('{emoji}', challenger_choice), ephemeral: true })

                if (challenger_choice && opponent_choice) {
                    collector.stop()
                    this.getResult(msg, challenger_choice, opponent_choice)
                }
            }
            else if (btn.user.id == this.opponent.id) {
                if (opponent_choice) {
                    return btn.reply({ content: this.options.noChangeMessage, ephemeral: true })
                }
                opponent_choice = choice[btn.customId.split('_')[0]];

                btn.reply({ content: this.options.chooseMessage.replace('{emoji}', opponent_choice), ephemeral: true })

                if (challenger_choice && opponent_choice) {
                    collector.stop()
                    this.getResult(msg, challenger_choice, opponent_choice)
                }
            }
        })

        collector.on("end", async (c, r) => {
            if (r === 'time' && this.inGame == true) {
                const endEmbed = new MessageEmbed()
                    .setTitle(this.options.embed.title)
                    .setColor(this.options.embed.color)
                    .setDescription(this.options.gameEndMessage)
                    .setTimestamp()

                for (let x = 0; x < msg.components.length; x++) {
                    for (let y = 0; y < msg.components[x].components.length; y++) {
                        msg.components[x].components[y].disabled = true;
                    }
                }
                return msg.edit({ embed: [endEmbed], components: msg.components })
            }
        })
    }

    getResult(msg, challenger, opponent) {
        let result;

        if (challenger === opponent) {
            result = this.options.drawMessage;
        } else if (
            (opponent === '✂️' && challenger === '📃') ||
            (opponent === '🌑' && challenger === '✂️') ||
            (opponent === '📃' && challenger === '🌑')
        ) {
            result = this.options.winMessage.replace('{winner}', '<@!' + this.opponent.id + '>')
        } else {
            result = this.options.winMessage.replace('{winner}', '<@!' + this.message.author.id + '>')
        }

        const finalEmbed = new MessageEmbed()
            .setTitle(this.options.embed.title)
            .setColor(this.options.embed.color)
            .setDescription(result)
            .addField(this.message.author.username, challenger, true)
            .addField(this.opponent.username, opponent, true)
            .setTimestamp()

        for (let x = 0; x < msg.components.length; x++) {
            for (let y = 0; y < msg.components[x].components.length; y++) {
                msg.components[x].components[y].disabled = true;
            }
        }

        return msg.edit({ embed: [finalEmbed], components: msg.components })
    }
}

module.exports = XOPRPSGame;

function i(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
    }
    return result;
}
