import express = require('express');
const Telegraf = require('telegraf');
const Markup = Telegraf.Markup;
const Extra = Telegraf.Extra;
require('dotenv').config();
import winston = require('winston');
const Stage = require('telegraf/stage');
const { leave } = Stage;
import startScene  from './controllers/start';
import path from 'path';
// import { ContextMessageUpdate } from 'telegraf';
import Scene = require('telegraf/scenes/base');
import TelegrafI18n from 'telegraf-i18n';
import  match  from 'telegraf-i18n';


const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'locales'),
    allowMissing: false,
});




const port = parseInt(process.env.PORT, 10) || 5000;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({filename: 'winston-logger/error.log', level: 'error'}),
        new winston.transports.File({filename: 'winston-logger/combined.log'}),
        new winston.transports.File({filename: 'winston-logger/messages.log', level:'info'}),
    ]
});

const app = express();

// const apiRouter = require('./routes/api');

app.get('/', (request, response) => {
    response.send('Hi this is api bot!');
    // response.send(request.body);
});


// Greeter scene
const greeter = new Scene('greeter');
greeter.enter((ctx) => ctx.reply('Hi-greeter'));
greeter.leave((ctx) => ctx.reply('Bye-greeter'));
greeter.hears(/hi/gi, leave());
greeter.hears('test', (ctx) => ctx.reply('test-greeter'));
greeter.on('message', (ctx) => ctx.reply('Send `hi`'));

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const stage = new Stage([
    startScene,
    greeter
]);
stage.command('cancel', leave());


// Scene registration
stage.register(greeter);
bot.use(stage.middleware());

bot.start((ctx) => ctx.reply('Привет, добро пожаловать в KINODNO-BOT, тут ты можешь быстро найти фильмы из разных источников'));
// bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));

// bot.command('search', (ctx) =>
//     ctx.scene.enter('greeter')
// // ctx.reply('test', '/search')
// );
// bot.command('search2', (ctx) =>
//     ctx.scene.enter('start')
// // ctx.reply('test', '/search')
// );
bot.hears(/(.*?)/, (ctx) => {
    logger.debug(ctx, 'Default handler has fired');
    // Нажми на иконку в правом нижнем углу чтобы открыть Telegram-клавиатуру и выбери раздел, в который ты хочешь попасть
    // {"reply_markup":{"keyboard":[["👀 Поиск","🎥 Моя коллекция"],["⚙️ Настройки","❓ Обо мне"],["💰 Поддержать","✍️ Обратная связь"]],"resize_keyboard":true}}


    var mainKeyboard  = {"reply_markup":{
        keyboard:[["👀 Поиск","🎥 Моя коллекция"],["⚙️ Настройки","❓ Обо мне"],["💰 Поддержать","✍️ Обратная связь"]]},
        "resize_keyboard":true
    };
console.log(mainKeyboard);
// 🚧 Нажми на иконку в правом нижнем углу чтобы открыть Telegram-клавиатуру и выбери раздел, в который ты хочешь попасть {
//         reply_markup: { keyboard: [ [Array], [Array], [Array] ], resize_keyboard: true }
//     }

    ctx.reply('Нажми на иконку в правом нижнем углу', mainKeyboard);

});
// bot.startPolling();

bot.hears('search', ((ctx) => ctx.scene.enter('greeter')));
// bot.command('search', (ctx) => ctx.reply('Hi search'));
// bot.command('start', (ctx) => ctx.scene.enter('greeter'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
//
bot.hears(['hi','privet','привет', 'здравствуйте'], (ctx) => {
    ctx.reply('Hey there');
    logger.info(ctx.update.message.text);
});
//
// bot.hears('pidor', (ctx) => {
//     ctx.reply('Sam pidor!');
//     logger.info(ctx.update.message.text);
// });

//just log all incoming messages
// bot.on('message', (ctx) => {
//     logger.info(ctx.update.message.text);
// });

bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error);
});

bot.launch();

// app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
});
