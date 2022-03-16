import { atom } from "recoil";
import { Genre, Room } from "../../constants/Types";

export const selectedGenresState = atom<Genre[]>({
    key: 'selectedGenres',
    default: [],

});

export const currentRoomState = atom<Room>({
    key: 'currentRoom',
    default: {
        size: 1,
        isVoting: false,
        connectedUsers: [],
        selectedGenres: [],
    },
});

export const roomNumberState = atom<Number>({
    key: 'roomNumber',
    default: 0,
})
