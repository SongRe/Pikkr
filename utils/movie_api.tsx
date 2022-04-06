import { useRecoilValue } from "recoil";
import { movieKey } from "../constants/Keys";
import { Genre, Movie } from "../constants/Types";
import { selectedGenresState } from './../state/atoms/atoms';

export const fetchGenres = (async () => {
    let response: any = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${movieKey}&language=en-US`);
    if (response.ok) {
        response = await response.json();
        const genres = response.genres;
        return genres;
    } else {
        return null;
    }
});

export const fetchMovies = async (selectedGenres: Genre[]) => {
    let request = `https://api.themoviedb.org/3/discover/movie?api_key=${movieKey}&language=en-US&include_adult=true&page=1&with_genres=`
    for(let i = 0; i < selectedGenres.length; i++) {
        let genre: Genre = selectedGenres[i];
        request += `${genre.name}`
        // want to add %2C between each genre
        if(i < selectedGenres.length - 1) {
            request += '%2C'
        }
    }
    let response: any = await fetch(request);
    if(response.ok) {
        response = await response.json();
        const movies = response.results;
        return movies;
    }
    return null;
};

export const fetchConfig = async () => {
    let request = `https://api.themoviedb.org/3/configuration?api_key=${movieKey}`;
    let response: any = await fetch(request);
    if(response.ok) {
        return response;
    }
    return null;
}

export const fetchMoviePosters = (movies: Movie[]) => {
    const result : string[] = [];
    for (let i = 0; i < movies.length; i++) {
        result.push(`https://image.tmdb.org/t/p/w500${movies[i].poster_path}`);
    }
    return result;
}
