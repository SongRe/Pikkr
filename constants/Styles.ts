import { makeStyles } from 'react-native-elements';
import { COLORS } from './Colors';

export const generalStyles = makeStyles({
    layout: {
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        zIndex: 0,
    },
    mainContainer: {
        backgroundColor: COLORS.BLACK,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        zIndex: 1,
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'absolute',
        bottom: 0,
    },

})
