require('dotenv').config();
import express = require('express');
import path from 'path';
import session from 'telegraf/session';
import Telegraf, {ContextMessageUpdate, Extra, Markup} from 'telegraf';
import TelegrafI18n, {match} from 'telegraf-i18n';
import winston = require('winston');

const Stage = require('telegraf/stage');
const {leave} = Stage;
import startScene from './controllers/start';
import searchScene from './controllers/search';
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
bot.use(i18n.middleware());
bot.use(stage.middleware());

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
        new winston.transports.File({filename: 'winston-logger/messages.log', level: 'info'}),
    ]
});

const app = express();

// const apiRouter = require('./routes/api');

app.get('/', (request, response) => {
    response.send('Hi this is api bot!');
    // response.send(request.body);
});

// bot.start((ctx: ContextMessageUpdate) => ctx.reply('Привет, добро пожаловать в KINODNO-BOT, тут ты можешь быстро найти фильмы из разных источников'));
bot.start((ctx: ContextMessageUpdate) => {
    let mainKeyboard: any = Markup.keyboard([
        [ctx.i18n.t('keyboards.main_keyboard.search')] as any,
        [ctx.i18n.t('keyboards.main_keyboard.movies')] as any,
        [ctx.i18n.t('keyboards.main_keyboard.settings')] as any,
        [ctx.i18n.t('keyboards.main_keyboard.about')] as any,
    ]);
    mainKeyboard = mainKeyboard.resize().extra();

    console.log('mainKeyboard', mainKeyboard);

    ctx.reply('Выбери чем я могу тебе помочь', mainKeyboard);


// ctx.scene.enter('start')
});


bot.hears(
    match('keyboards.main_keyboard.search'),
    (ctx: ContextMessageUpdate) => {
        console.log('search entering');
        ctx.scene.enter('search');
    }
);

// bot.hears(/(.*?)/, (ctx:ContextMessageUpdate) => {
//
//     let mainKeyboard: any = Markup.keyboard([
//         [ctx.i18n.t('keyboards.main_keyboard.search')] as any,
//         [ctx.i18n.t('keyboards.main_keyboard.movies')] as any,
//         [ctx.i18n.t('keyboards.main_keyboard.settings')] as any,
//         [ctx.i18n.t('keyboards.main_keyboard.about')] as any,
//     ]);
//     mainKeyboard = mainKeyboard.resize().extra();
//
//     console.log('mainKeyboard', mainKeyboard);
//
//     ctx.reply('Выбери чем я могу тебе помочь', mainKeyboard);
// });
bot.hears(
    match('keyboards.back_keyboard.back'),
    (ctx: ContextMessageUpdate) => {
        // If this method was triggered, it means that bot was updated when user was not in the main menu..
        // logger.debug(ctx, 'Return to the main menu with the back button');
        let mainKeyboard: any = Markup.keyboard([
            [ctx.i18n.t('keyboards.main_keyboard.search')] as any,
            [ctx.i18n.t('keyboards.main_keyboard.movies')] as any,
            [ctx.i18n.t('keyboards.main_keyboard.settings')] as any,
            [ctx.i18n.t('keyboards.main_keyboard.about')] as any,
        ]);
        mainKeyboard = mainKeyboard.resize().extra();

        ctx.reply('Нусс, чем я могу тебе помочь?', mainKeyboard);
        console.log('Back keyboard detected');
    }
);


bot.hears(['hi', 'privet', 'привет', 'здравствуйте'], (ctx: ContextMessageUpdate) => {
    ctx.reply('Hey there');
    logger.info(ctx.update.message.text);
});


//just log all incoming messages
bot.on('message', (ctx: ContextMessageUpdate) => {
    logger.info(ctx.update.message.text);
    console.log('all incoming messages');
});

bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error);
    console.log('Error catchall detected, ', error);
});

bot.launch();

// app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
});
