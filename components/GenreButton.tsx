import React from "react"
import { View } from "react-native"
import { Button, makeStyles } from 'react-native-elements';
import { COLORS } from "../constants/Colors";

//TODO: add typing for genre object

interface GenreButtonProps {
    onPress: () => {};
    label: string;
    isSelected: Boolean;
    width?: number;
    height?: number;

}

export const GenreButton = (props: GenreButtonProps) => {
    const useStyles = makeStyles(() => ({
        selected: {
            width: props.width,
            height: props.height,
            borderWidth: 1,
            borderColor: COLORS.GENRE_PURPLE,
            backgroundColor: 'transparent',
        },
    
        notSelected: {
            width: props.width,
            height: props.height,
            borderWidth: 1,
            borderColor: COLORS.GENRE_WHITE,
            backgroundColor: 'transparent',


        },

        title: {
            fontSize: 14,
            fontFamily: 'Poppins',
            color: COLORS.GENRE_WHITE,
        },

        selectedTitle: {
            fontSize: 14,
            fontFamily: 'Poppins',
            color: COLORS.GENRE_PURPLE,
        }

    
    
    }));

    const styles = useStyles();
    return (
        <View>
            {props.isSelected ?
                <Button buttonStyle={styles.selected}
                    title={props.label}
                    titleStyle={styles.selectedTitle}
                    onPress={props.onPress}
                />
                :

                <Button
                    buttonStyle={styles.notSelected}
                    title={props.label}
                    titleStyle={styles.title}
                    onPress={props.onPress}
                />}

        </View>
    )
}


