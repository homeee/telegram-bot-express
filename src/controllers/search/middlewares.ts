import { ContextMessageUpdate } from 'telegraf';
import { getMovieList } from './helpers';
// import logger from '../../util/logger';

/**
 * Exposes required movie according to the given callback data
 * @param ctx - telegram context
 * @param next - next function
 */
export async function exposeMovie(ctx: ContextMessageUpdate, next: Function) {
  console.log('data from session2', ctx.session.movies);
  if (ctx.session.movies) {
    const movies = ctx.session.movies;
    const action = JSON.parse(ctx.callbackQuery.data);
    ctx.movie = movies.find(item => item.id === action.p);
    console.log('ctx.movie', ctx.movie);
  };
  // const movies = await getMovieList(ctx);
  // // if (!movies) {
  // //   // logger.error(ctx, 'Attempt to pick a movie from the previous message');
  // //   return await ctx.reply(ctx.i18n.t('common.error'));
  // // }
  //
  // console.log(ctx.callbackQuery.data);
  // const action = JSON.parse(ctx.callbackQuery.data);
  // ctx.movie = movies.find(item => item.id === action.p);
  // // console.log(ctx.movie);
  return next();
}
