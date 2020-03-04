import express from 'express';

require('dotenv').config();
// import configJson from "../tsconfig.json";
const winston = require('winston');
// import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
const Telegraf = require('telegraf');
// import * as bodyParser from 'body-parser';
const router = express.Router();

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
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

const app = express();

// const apiRouter = require('./routes/api');
// app.use('/custom-sub-path/static', express.static('dist/static'));


router.get('/', (request, response) => {
    response.send('Hi this is api bot!');
    // response.send(request.body);
});

app.use(process.env.PATH_TO_PROJECT, router);

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
// bot.use(loggerMiddleware);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => {
    ctx.reply('Hey there');
    logger.info(ctx, 'User uses /saveme command');
});
bot.launch();

// app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
});
