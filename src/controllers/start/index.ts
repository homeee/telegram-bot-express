import { ContextMessageUpdate } from 'telegraf';
import Stage  = require('telegraf/stage');
import Scene = require('telegraf/scenes/base');
import { getLanguageKeyboard } from './helpers';

const { leave } = Stage;
const start = new Scene('start');

start.enter(async (ctx: ContextMessageUpdate) => {
  // const uid = String(ctx.from.id);
  await ctx.reply('Choose language / Выбери язык', getLanguageKeyboard());
});

export default start;
