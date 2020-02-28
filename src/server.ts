import * as express from 'express';
import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import * as bodyParser from 'body-parser';
// const router = express.Router();


function loggerMiddleware(request: express.Request, response: express.Response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
}

const app = express();
app.use(loggerMiddleware);

// const apiRouter = require('./routes/api');

app.get('/', (request, response) => {
    response.send('Hello world!');
    // response.send(request.body);
});

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// app.use('/api', apiRouter);

app.listen(5000);