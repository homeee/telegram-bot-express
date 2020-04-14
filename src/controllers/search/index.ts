import Telegraf, {ContextMessageUpdate} from 'telegraf';
import TelegrafI18, { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
// import { getLanguageKeyboard } from './helpers';

const {leave, enter } = Stage;
const searcher = new Scene('search');

//scene if entered to search scene
searcher.enter((ctx: ContextMessageUpdate) => {

  let mainKeyboard = {
    'reply_markup': {
      'keyboard':[
        [ctx.i18n.t('keyboards.main_keyboard.clear')] as any,
        [ctx.i18n.t('keyboards.back_keyboard.back')] as any,
      ],
      "resize_keyboard":true,
    }
  };
    console.log('scene logged 2');
    ctx.reply(ctx.i18n.t('messages.search.hi'), mainKeyboard);
});

//action if user is leaving search scene
searcher.leave((ctx: ContextMessageUpdate) => {
    ctx.reply(ctx.i18n.t('messages.search.bye'));
});

//leave action
searcher.hears(match('keyboards.back_keyboard.back'), leave());
searcher.hears(match('keyboards.main_keyboard.clear'), enter());
//catch movie name
// searcher.hears(/(.*?)/, (ctx:ContextMessageUpdate) => {
//   ctx.reply('Ищу');
// });

export default searcher;
