import Telegraf, {ContextMessageUpdate} from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
const { match, reply } = require('telegraf-i18n');
// const { match, reply } = require('telegraf-i18n');
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
// import { getLanguageKeyboard } from './helpers';

const {leave, enter } = Stage;
const searcher = new Scene('search');

//scene if entered to search scene
searcher.enter((ctx: any) => {

  let mainKeyboard = {
    'reply_markup': {
      'keyboard':[
        [ctx.i18n.t('keyboards.main_keyboard.clear')],
        [ctx.i18n.t('keyboards.back_keyboard.back')],
      ],
      "resize_keyboard":true,
    }
  };
    console.log('scene logged 2');
    ctx.reply(ctx.i18n.t('messages.search.hi'), mainKeyboard);
});

//action if user is leaving search scene
searcher.leave((ctx: any) => {
    ctx.reply(ctx.i18n.t('messages.search.bye'));
});

//leave action
searcher.hears(match('keyboards.back_keyboard.back'), leave());
searcher.hears(match('keyboards.main_keyboard.clear'), enter());
//catch movie name
searcher.hears(/(.*?)/, (ctx:any) => {
  ctx.reply('Ищу');
});

export default searcher;
