import {Markup, Extra, ContextMessageUpdate} from 'telegraf';
import * as imdb from 'imdb-api';
// import Movie from '../../models/Movie';
// import User from '../../models/User';
// import { movieSearch, ISearchResult } from '../../util/movie-search';
// import logger from '../../util/logger';
// import { saveToSession, deleteFromSession } from '../../util/session';
// import { releaseChecker } from '../../util/release-checker';


export interface ISearchParameters {
    title: string;
    // year: number;
    // language: 'ru' | 'en';
}

interface ISearchResult {
    id: string;
    title: string;
    year: number;
    posterUrl: string;
}

const IMDB_SEARCH_PARAMS = {
    apiKey: process.env.IMDB_API_KEY,
    timeout: 30000
};


/**
 * Returning list of movies. Taken either from API or from the session
 * @param ctx - telegram context
 */
export async function getMovieList(ctx: ContextMessageUpdate): Promise<ISearchResult[]> {
    console.log('data from session', ctx.session.movies);
    if (ctx.session.movies) return ctx.session.movies as ISearchResult[];

    try {
        // console.log(ctx);
        let movies = await imdb.search({name: ctx.message.text, year: 2019}, IMDB_SEARCH_PARAMS);

        let result = movies.results.map(item => ({
            id: item.imdbid,
            title: item.title,
            year: item.year,
            posterUrl: item.poster
        }));

        ctx.session['movies'] = result;

        return result;
    } catch (e) {
        console.log('error occured', e.message);
        return [];
    }
}


export async function searchMovie(ctx: ContextMessageUpdate) {
    let movies = await imdb.search({name: 'lion', year: 2019}, IMDB_SEARCH_PARAMS);
    return movies;
}


/**
 * Displays menu with a list of movies
 * @param movies - list of movies
 */
export function getMoviesMenu(movies: ISearchResult[]) {
    console.log('getMoviesMenu: ', movies);
    return Extra.HTML().markup((m: Markup) =>
        m.inlineKeyboard(
            movies.map(item => [
                m.callbackButton(
                    `(${item.year}) ${item.title}`,
                    JSON.stringify({a: 'movie', p: item.id}),
                    false
                )
            ]),
            {}
        )
    );
}
/**
 * Menu to control current movie
 * @param ctx - telegram context
 */
export function getMovieControlMenu(ctx: ContextMessageUpdate) {
    return Extra.HTML().markup((m: Markup) =>
        m.inlineKeyboard(
            [
                m.callbackButton(
                    ctx.i18n.t('scenes.search.back_button'),
                    JSON.stringify({ a: 'back', p: undefined }),
                    false
                ),
                m.callbackButton(
                    ctx.i18n.t('scenes.search.add_button'),
                    JSON.stringify({ a: 'add', p: ctx.movie.id }),
                    false
                )
            ],
            {}
        )
    );
}


/**
 * Menu to control current movie
 * @param ctx - telegram context
 */
// export function getMovieControlMenu(ctx: ContextMessageUpdate) {
//   return Extra.HTML().markup((m: Markup) =>
//     m.inlineKeyboard(
//       [
//         m.callbackButton(
//           ctx.i18n.t('scenes.search.back_button'),
//           JSON.stringify({ a: 'back', p: undefined }),
//           false
//         ),
//         m.callbackButton(
//           ctx.i18n.t('scenes.search.add_button'),
//           JSON.stringify({ a: 'add', p: ctx.movie.id }),
//           false
//         )
//       ],
//       {}
//     )
//   );
// }

/**
 * Pushing id to the user's observable array and clearing movies in session
 * @param ctx - telegram context
 */
// export async function addMovieForUser(ctx: ContextMessageUpdate) {
//   const movie: ISearchResult = ctx.movie;
//   const movieDoc = await Movie.findOneAndUpdate(
//     {
//       _id: movie.id
//     },
//     {
//       _id: movie.id,
//       title: movie.title.replace(/ё/, 'e'),
//       year: movie.year,
//       posterUrl: movie.posterUrl,
//       language: ctx.session.language,
//       released: false
//     },
//     {
//       new: true,
//       upsert: true
//     }
//   );

//   await User.findOneAndUpdate(
//     {
//       _id: ctx.from.id
//     },
//     {
//       $addToSet: { observableMovies: movieDoc._id }
//     },
//     {
//       new: true
//     }
//   );
//
//   deleteFromSession(ctx, 'movies');
// }

/**
 * Perform several checks, returns either a reason why movie can't be added or true
 * @param ctx - telegram context
 */
// export async function canAddMovie(ctx: ContextMessageUpdate) {
//   logger.debug(ctx, 'Checks if can add a movie');
//   const movieRelease = await releaseChecker[ctx.session.language]({
//     id: ctx.movie.id,
//     title: ctx.movie.title,
//     year: ctx.movie.year
//   });
//
//   const user = await User.findById(ctx.from.id);
//
//   if (movieRelease) {
//     return ctx.i18n.t('scenes.search.reason_movie_released');
//   } else if (user.observableMovies.some(m => m._id === ctx.movie.id)) {
//     return ctx.i18n.t('scenes.search.reason_already_observing');
//   }
//
//   return true;
// }
