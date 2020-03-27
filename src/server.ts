import express = require('express');
require('dotenv').config();
import path from 'path';
import session from 'telegraf/session';
import Telegraf, {ContextMessageUpdate} from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
const { match, reply } = require('telegraf-i18n');
import winston = require('winston');
const Stage = require('telegraf/stage');
const { leave } = Stage;
import startScene  from './controllers/start';
import searchScene  from './controllers/search';
import Scene = require('telegraf/scenes/base');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const stage = new Stage([
    startScene,
    searchScene,
]);

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    allowMissing: false, // Default true
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
});


bot.use(session());
bot.use(stage.middleware());
bot.use(i18n.middleware());



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
bot.command('greeter', (ctx:any) =>
    ctx.scene.enter('greeter')
);

bot.start((ctx) => ctx.reply('Привет, добро пожаловать в KINODNO-BOT, тут ты можешь быстро найти фильмы из разных источников'));

bot.hears(
    match('keyboards.main_keyboard.search'),
    (ctx:any) =>{
        console.log('search entered');
        ctx.scene.enter('search');
    }
);

// bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));

bot.hears(/(.*?)/, (ctx:any) => {
   let mainKeyboard = {
       'reply_markup': {
           'keyboard':[
               [ctx.i18n.t('keyboards.main_keyboard.search')],
               [ctx.i18n.t('keyboards.main_keyboard.movies')],
               [ctx.i18n.t('keyboards.main_keyboard.settings')],
               [ctx.i18n.t('keyboards.main_keyboard.about')],
           ],
           "resize_keyboard":true,
       }
   };
    ctx.reply('Выбери чем я могу тебе помочь', mainKeyboard);
});

bot.hears(['hi','privet','привет', 'здравствуйте'], (ctx) => {
    ctx.reply('Hey there');
    logger.info(ctx.update.message.text);
});


//just log all incoming messages
bot.on('message', (ctx) => {
    logger.info(ctx.update.message.text);
});

bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error);
});

bot.launch();

// app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
});
