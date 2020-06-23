import { ContextMessageUpdate } from 'telegraf';
import {
  getMovieControlMenu,
//   canAddMovie,
//   addMovieForUser,
  getMovieList,
  getMoviesMenu
} from './helpers';
// import { deleteFromSession } from '../../util/session';
// import logger from '../../util/logger';

export const movieAction = async (ctx: ContextMessageUpdate) => {
  const { title, posterUrl } = ctx.movie;
  console.log('exact movie', title);
  const text = ctx.i18n.t('scenes.search.chosen_movie');

  await ctx.editMessageText(`${text}\n <b>${title}\n</b><a href="${posterUrl}">Link</a>`, getMovieControlMenu(ctx));
  await ctx.answerCbQuery();
};

// export const addMovieAction = async (ctx: ContextMessageUpdate) => {
//   const canAddResult = await canAddMovie(ctx);
//
//   if (typeof canAddResult === 'string') {
//     await ctx.editMessageText(ctx.i18n.t('scenes.search.continue_search', { canAddResult }));
//   } else {
//     logger.debug(ctx, 'User is adding movie %O to this collection', ctx.movie);
//
//     await addMovieForUser(ctx);
//     await ctx.editMessageText(
//       ctx.i18n.t('scenes.search.added_movie_to_lib', {
//         title: ctx.movie.title
//       })
//     );
//   }
//
//   await ctx.answerCbQuery();
//   deleteFromSession(ctx, 'movies');
// };
//
export const backAction = async (ctx: ContextMessageUpdate) => {
  const movies = await getMovieList(ctx);

  // if (ctx.session.movies){
  //   const movies = ctx.session.movies;
  // }

  await ctx.editMessageText(
    ctx.i18n.t('scenes.search.movies'),
    getMoviesMenu(movies)
  );

  await ctx.answerCbQuery();
};
