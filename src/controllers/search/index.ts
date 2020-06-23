import {ContextMessageUpdate, Markup} from 'telegraf';
import {match} from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import {getMovieList, getMoviesMenu} from './helpers';
import {exposeMovie} from './middlewares';
import {movieAction, backAction} from './actions'

// import { getLanguageKeyboard } from './helpers';

const {leave, enter} = Stage;
const searcher = new Scene('search');

//scene if entered to search scene
searcher.enter(async (ctx: ContextMessageUpdate) => {
    let searchKeyboard: any = Markup.keyboard([
        [ctx.i18n.t('keyboards.main_keyboard.clear')],
        [ctx.i18n.t('keyboards.back_keyboard.back')],
    ]);
    searchKeyboard = searchKeyboard.resize().extra();

    console.log('scene search entered');
    ctx.reply(ctx.i18n.t('messages.search.hi'), searchKeyboard);
});

//action if user is leaving search scene
searcher.leave(async (ctx: ContextMessageUpdate) => {
    console.log('scene search leaving');
    // ctx.reply(ctx.i18n.t('messages.search.bye'));

    let mainKeyboard: any = Markup.keyboard([
        [ctx.i18n.t('keyboards.main_keyboard.search')] as any,
        [ctx.i18n.t('keyboards.main_keyboard.movies')] as any,
        [ctx.i18n.t('keyboards.main_keyboard.settings')] as any,
        [ctx.i18n.t('keyboards.main_keyboard.about')] as any,
    ]);
    mainKeyboard = mainKeyboard.resize().extra();
    ctx.reply('Нусс, чем я могу тебе помочь2?', mainKeyboard);
});

//leave action
searcher.hears(match('keyboards.back_keyboard.back'), leave());
searcher.hears(match('keyboards.main_keyboard.clear'), enter());


//catch movie name
searcher.on('text', async (ctx: ContextMessageUpdate) => {
    // ctx.reply('...');
    console.log('movie name typed');
    const movies = await getMovieList(ctx);
    // console.log(movies);

    if (!movies || !movies.length) {
        console.log('no movies', movies.length);
        await ctx.reply(ctx.i18n.t('scenes.search.no_movies'));
        return;
    }

    if (movies.length && movies.length == 1) {
        await ctx.reply(ctx.i18n.t('scenes.search.movie'), getMoviesMenu(movies)); //for one movie
    } else {
        await ctx.reply(ctx.i18n.t('scenes.search.movies'), getMoviesMenu(movies)); //for multiple movies
    }

});

searcher.action(/movie/, exposeMovie, movieAction);
searcher.action(/back/, backAction);

export default searcher;
