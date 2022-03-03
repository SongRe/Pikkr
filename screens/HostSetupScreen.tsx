import { Formik } from 'formik';
import * as React from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ListRenderItem } from 'react-native';
import { Button, makeStyles, } from 'react-native-elements';
import { COLORS } from '../constants/Colors';
import { SCREENS } from './constants';
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';
import { BackIcon } from '../components/Icons';
import { FlatGrid } from 'react-native-super-grid';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedGenresState } from './../state/atoms/atoms';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { generalStyles } from './../constants/Styles';
import { Genre, GenreItem } from '../constants/Types';
import { FlatList } from 'react-native-gesture-handler';

//TODO: setup selectable grid for genres and update the atom accordingly
//TODO: Setup async api call for movie data objects
//TODO: Typing for the movie data objects that come in

const DATA = [
    {
        id: "id_1",
        title: "First Item",
    },
    {
        id: "id_2",
        title: "Second Item",
    },
    {
        id: "id_3",
        title: "Third Item",
    },
];

export const HostSetupScreen = () => {
    const setupStyles = useStyles();
    const genStyles = generalStyles();
    const nav = useNavigation();

    const [selectedGenres, setSelectedGenres] = useRecoilState(selectedGenresState);

    const Item = (props: GenreItem) => {
        return (
            <TouchableOpacity onPress={props.onPress} style={[setupStyles.genreItem, { backgroundColor: props.backgroundColor }]}>
                <Text style={[setupStyles.title, { color: props.textColor }]}>{props.genre.title}</Text>
            </TouchableOpacity>
        )
    }

    const renderItem: ListRenderItem<Genre> = ({ item }) => {
        const backgroundColor = (selectedGenres.includes(item)) ? COLORS.DARK_GREY : COLORS.LIGHT_GREY;
        const textColor = COLORS.GENRE_WHITE;
        return (
            <Item
                genre={item}
                onPress={() => {
                    console.log('genre pressed: ', item);
                    const selected = Object.assign([], selectedGenres);
                    if (selectedGenres.includes(item)) {
                        selected.splice(selected.indexOf(item), 1);
                        setSelectedGenres(selected);
                    } else {
                        selected.push(item);
                        setSelectedGenres(selected); // this is probably redundant
                    }

                }}
                backgroundColor={backgroundColor}
                textColor={textColor}
            />
        )
    }

    const [numError, setNumError] = useState(false);
    return (
        <View style={genStyles.layout}>
            <Image
                style={setupStyles.image}
                source={require("../assets/images/PikkrBackgroundVector.png")}
            />
            <View style={genStyles.mainContainer}>
                <View style={setupStyles.iconContainer}>
                    <BackIcon onPress={() => { nav.goBack() }} size={40} color={COLORS.WHITE} />
                </View>
                <Text style={setupStyles.title}>New Room</Text>

                <View>
                    <Formik
                        initialValues={{ code: "" }}
                        onSubmit={(values) => {
                            console.log(values);
                            const db = getDatabase();
                            const reference = ref(db, 'test/' + values.code);
                            set(reference, {
                                test: values,
                            });
                            //this is where we will validate the people input, and navigate / display error accordingly
                            nav.navigate(SCREENS.HOST_WAIT);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={setupStyles.formContainer}>
                                <View style={setupStyles.groupContainer}>
                                    <View style={setupStyles.column}>
                                        <Text style={setupStyles.subtitle}>Number of People</Text>
                                        <Text style={setupStyles.errorText}>{numError ? 'Room does not exist' : ''}</Text>
                                        <View style={setupStyles.codeContainer}>
                                            <TextInput
                                                maxLength={4} // code length    
                                                onChangeText={handleChange("code")}
                                                onBlur={handleBlur("code")}
                                                autoCapitalize='characters'
                                                underlineColorAndroid='transparent'
                                                value={values.code}
                                                style={setupStyles.codeText}
                                                keyboardType='number-pad'
                                            />

                                        </View>
                                    </View>
                                </View>

                                <View style={setupStyles.groupContainer}>
                                    <Text style={setupStyles.subtitle}>Preference</Text>
                                    <Text style={setupStyles.text}>Filter by genre:</Text>
                                    <FlatList
                                        data={DATA}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => { return item.id; }}
                                        extraData={selectedGenres}
                                    />
                                </View>
                                <Button titleStyle={setupStyles.buttonText}
                                    title='Create'
                                    buttonStyle={setupStyles.createButton}
                                    containerStyle={setupStyles.createButtonContainer}
                                    onPress={() => {
                                        handleSubmit();
                                    }}
                                />
                            </View>
                        )}
                    </Formik>
                </View>


            </View>
        </View>
    )
}

function removeItemAtIndex(arr: [], index: number) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

const useStyles = makeStyles(() => ({
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    iconContainer: {
        position: 'absolute',
        top: '3.5%',
        left: '7%',
    },

    image: {
        position: "absolute",
        zIndex: 0,
    },

    formContainer: {
        height: '97%',
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
    genreText: {
        fontFamily: 'Poppins',
        color: COLORS.WHITE,
        fontSize: 14,
    },
    genreItem: {

    },

    errorText: {
        fontFamily: 'Poppins',
        color: COLORS.RED,
        fontSize: 14,
    },
    codeContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: COLORS.TEXT_INPUT,
        borderRadius: 20,
        padding: '3%',
    },
    groupContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_GREY,
        padding: '7%',
        borderRadius: 20,
        marginTop: 10,
        flex: 1,
    },
    codeText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Poppins',
        backgroundColor: COLORS.TEXT_INPUT,
        textAlign: 'center',
    },

    createButton: {
        borderRadius: 30,
        width: '100%',

    },

    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: COLORS.WHITE
    },

    createButtonContainer: {
        marginTop: '5%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '35%',
    },
}));
