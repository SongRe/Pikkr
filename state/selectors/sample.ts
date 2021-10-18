import { selector } from "recoil";
import { selectedGenresState } from './../atoms/atoms';

//Sample aync selector for other contributors


//change name to "start room query .. or something"
export const currentUserNameQuery = selector({
    key: 'CurrentUserName',
    get: async ({ get }) => {
        const response = await myDBQuery({
            userID: get(selectedGenresState),
        });
        return response;
    },
});

/*
    the object, {
        userID: get(selectedGenresState) 

    }
    is passed into myDBQuery and the response is gotten from our backend
*/

export const addGenre = selector({
    key: 'AddGenre',
    get: ({ get }) => {
        
    }

})


//sample sync selector
//   const currentUserNameState = selector({
//     key: 'CurrentUserName',
//     get: ({get}) => {
//       return tableOfUsers[get(currentUserIDState)].name;
//     },
//   });

function myDBQuery(arg0: { userID: never[]; }) {
    throw new Error("Function not implemented.");
}

