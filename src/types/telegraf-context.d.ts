import { I18n } from 'telegraf-i18n';
// import { IMovie } from '../models/Movie';
import { ISearchResult } from '../utils/movie-search';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: any;
    movie: any;
    session: {
      movies: ISearchResult[];
      settingsScene: {
        messagesToDelete: any[];
      };
      language: 'en' | 'ru';
    };
  }
}
