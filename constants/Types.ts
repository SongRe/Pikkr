// export type GenreItem = {
//     id: string,
//     title: string,
// }

export interface GenreItem {
    genre: Genre;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;

}
export interface Genre {
    id: string;
    title: string;
}
