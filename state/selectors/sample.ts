import { selector } from "recoil";
import { selectedGenresState } from './../atoms/atoms';

//Sample aync selector for other contributors

export const currentUserNameQuery = selector({
    key: 'CurrentUserName',
    get: async ({ get }) => {
        const response = await myDBQuery({
            userID: get(selectedGenresState),
        });
        return response;
    },
});

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

