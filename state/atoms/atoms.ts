import { atom } from "recoil";
import { Genre, Movie, Room } from "../../constants/Types";

export const selectedGenresState = atom<Genre[]>({
    key: 'selectedGenres',
    default: [],

});

export const currentRoomState = atom<Room>({
    key: 'currentRoom',
    default: {
        size: 1,
        isVoting: false,
        connectedUsers: 0,
        selectedGenres: [],
        movies: [],
        movieVotes: [],
    },
});

export const roomNumberState = atom<Number>({
    key: 'roomNumber',
    default: 0,
});

export const movieState = atom<Movie[]>({
    key: 'movies',
    default: [],
});

export const movieVoteState = atom<number[]>({
    key: 'movieVotes',
    default: [],
});
