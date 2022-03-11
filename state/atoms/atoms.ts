import { atom } from "recoil";
import { Genre } from "../../constants/Types";

export const selectedGenresState = atom<Genre[]>({
    key: 'selectedGenres',
    default: [],

});

export const roomNumberState = atom<Number>({
    key: 'roomNumber',
    default: 0,
})
