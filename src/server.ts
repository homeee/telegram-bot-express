import express = require('express');
require('dotenv').config();
import winston = require('winston');
const Telegraf = require('telegraf');
// import * as bodyParser from 'body-parser';
// const router = express.Router();

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

// app.use(process.env.PATH_TO_PROJECT, router);

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => {
    ctx.reply('Hey there');
    logger.info(ctx.update.message.text);
});

bot.hears('pidor', (ctx) => {
    ctx.reply('Sam pidor!');
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
