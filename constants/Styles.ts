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
    
    errorText: {
        fontFamily: 'Poppins',
        color: COLORS.RED,
        fontSize: 14,
    },
    title: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 34,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: "Poppins",
        color: COLORS.WHITE,
        fontSize: 24,
    },
    text: {
        fontFamily: 'Poppins',
        color: COLORS.WHITE,
        fontSize: 14,
    },

    groupContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_GREY,
        paddingHorizontal: '5%',
        paddingVertical: '7%',
        borderRadius: 20,
        flex: 1,
        marginTop: 10,
    },

})
