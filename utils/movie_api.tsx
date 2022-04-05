import { useRecoilValue } from "recoil";
import { movieKey } from "../constants/Keys";
import { Genre } from "../constants/Types";
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
    console.log(response);
    if(response.ok) {
        response = await response.json();
        const movies = response.results;
        return movies;
    } else {
        return response;
    }
};
