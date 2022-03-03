// export type GenreItem = {
//     id: string,
//     title: string,
// }

// future use
export interface User {
    id: string,
    perms: string,
}

export interface GenreItem {
    genre: Genre;
    onPress: () => void;
    borderColor: string;
    textColor: string;

}
export interface Genre {
    id: number;
    name: string;
}

export interface Room {
    size: number;
    isVoting: false;
    connectedUsers?: User[];
    selectedGenres?: Genre[];
}

