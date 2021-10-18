import { atom } from "recoil";

export const selectedGenresState = atom<any>({
    key: 'selectedGenres',
    default: [],

})
