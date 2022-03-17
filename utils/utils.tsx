
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Room } from '../constants/Types';


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
