import { ContextMessageUpdate } from 'telegraf';
// import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
// import { getLanguageKeyboard } from './helpers';

const { leave } = Stage;
const searcher = new Scene('search');

searcher.enter((ctx: any) => {

  console.log('scene logged 2');

  ctx.reply('Hi');
});

searcher.leave((ctx: any) => {
  ctx.reply('Bye');
});

export default searcher;
