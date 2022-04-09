
import { doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'firebase/firestore';
import { Genre, Movie, Room } from '../constants/Types';


export const getRoomByCode = async (code: string) => {
    const db = getFirestore();
    let docSnap = await getDoc(doc(db, "Rooms", `${code}`));
    if(docSnap.exists()) {
        //should return this as room object
        const document = docSnap.data();
        const room: Room = {
            size: document.size,
            isVoting: document.isVoting,
            selectedGenres: document.selectedGenres ? document.selectedGenres : null,
            connectedUsers: document.connectedUsers ? document.connectedUsers : null,
            movies: document.movies ? document.movies : null,
            movieVotes: document.movieVotes ? document.movieVotes : null,
            votesSubmitted: document.votesSubmitted ? document.votesSubmitted : 0,
        }
        return room;
    } else {
        return null;
    }
}

/**
 * Update the room with a new room object
 * @param code 
 * @param room 
 */
export const updateRoom = async (code: string, room: Room) => {
    const db = getFirestore();
    const roomRef = doc(db, "Rooms", `${code}`);
    const res = await updateDoc(roomRef, {
        size: room.size,
        isVoting: room.isVoting,
        selectedGenres: room.selectedGenres ? room.selectedGenres : [],
        connectedUsers: room.connectedUsers,
        movies: room.movies,
        movieVotes: room.movieVotes,
        votesSubmmitted: room.votesSubmitted,
    });
    return res;
}

/**
 * Update a room field
 * @param code: room ccode
 * @param fieldName
 * @param value
 */
 export const updateRoomField = async (code: string, fieldName: string, value: any) => {
    const db = getFirestore();
    const roomRef = doc(db, "Rooms", `${code}`);
    const res = await updateDoc(roomRef, {
        [`${fieldName}`]: value,
    });
    return res;
}

export const incrementConnectedUsers = async (code: string) => {
    const db = getFirestore();
    const roomRef = doc(db, "Rooms", `${code}`);
    const res = await updateDoc(roomRef, {
        connectedUsers: increment(1),
    });
    return res;
}

export const incrementVotesSubmitted = async (code: string) => {
    const db = getFirestore();
    const roomRef = doc(db, "Rooms", `${code}`);
    const res = await updateDoc(roomRef, {
        votesSubmitted: increment(1),
    });
    return res;
}

export const beginVote = async (code: string) => {
    const db = getFirestore();
    const roomRef = doc(db, "Rooms", `${code}`);
    const res = await updateDoc(roomRef, {
        isVoting: true,
    });
    return res;
}

export const createRoom = async (room: Room) => {
    const firestore = getFirestore();
    const roomCode = await generateRoomCode();
    setDoc(doc(firestore, "Rooms", `${roomCode}`), room);
    return roomCode;
}

export const generateRoomCode = async () => {
    const db = getFirestore();
    let roomNum = Math.round(Math.random() * 99999) // number between 0 and 99999
    let docSnap = await getDoc(doc(db, "Rooms", `${roomNum}`));
    while (docSnap.exists()) {
        let roomNum = Math.round(Math.random() * 99999) // number between 0 and 99999
        docSnap = await getDoc(doc(db, "Rooms", `${roomNum}`));
    }
    return roomNum;
}

export const createMovieObjects = (moviesInJSON: any[]) => {
    const result: Movie[] = [];
    for (let k = 0; k < moviesInJSON.length; k++) {
        const i = moviesInJSON[k];
        result.push({
            adult: i.adult? i.adult : null,
            backdrop_path: i.backdrop_path? i.backdrop_path : null,
            genre_ids: i.genre_ids? i.genre_ids : null,
            id: i.id ? i.id : null,
            original_language: i.original_language? i.original_language : null,
            original_title: i.original_title? i.original_title : null,
            overview: i.overview? i.overview : null,
            popularity: i.popularity,
            poster_path: i.poster_path,
            release_date: i.release_date,
            title: i.title,
            video: i.video,
            vote_average: i.vote_average,
            vote_count: i.vote_count,
        })
    }
    return result;
}

export const createGenreObjects = (genreInJSON: any[]) => {
    const result: Genre[] = [];
    for (let k = 0; k < genreInJSON.length; k++) {
        const i = genreInJSON[k];
        result.push({
            id: i.id,
            name: i.name,
        });
    }
    return result;
}

