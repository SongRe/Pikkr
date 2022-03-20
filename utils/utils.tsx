
import { doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'firebase/firestore';
import { Room } from '../constants/Types';
import { useRecoilValue } from 'recoil';
import { currentRoomState } from '../state/atoms';


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
    });
    return res;
}

/**
 * Update the room with a new room object
 * @param code 
 * @param fieldName
 * @param value
 */
 export const updateRoomField = async (code: string, fieldName: string, value: any) => {
    const db = getFirestore();
    const roomRef = doc(db, "Rooms", `${code}`);
    const res = await updateDoc(roomRef, {
        [fieldName]: value,
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
    while(docSnap.exists()) {
        let roomNum = Math.round(Math.random() * 99999) // number between 0 and 99999
        docSnap = await getDoc(doc(db, "Rooms", `${roomNum}`));
    }
    return roomNum;
}
