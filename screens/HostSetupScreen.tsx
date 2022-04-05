import { Formik } from 'formik';
import * as React from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ListRenderItem, ActivityIndicator } from 'react-native';
import { Button, makeStyles, } from 'react-native-elements';
import { COLORS } from '../constants/Colors';
import { SCREENS } from './constants';
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';
import { BackIcon } from '../components/Icons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentRoomState, movieState, roomNumberState, selectedGenresState } from './../state/atoms/atoms';
import { generalStyles } from './../constants/Styles';
import { Genre, GenreItem, Room } from '../constants/Types';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { movieKey } from './../constants/Keys';
import { createMovieObjects, createRoom } from '../utils/utils';
import { fetchMovies } from '../utils/movie_api';

let DATA: Genre[] = [];
export const HostSetupScreen = () => {
    const setupStyles = useStyles();
    const genStyles = generalStyles();
    const nav = useNavigation();

    const [isLoading, setIsLoading] = useState(true);
    const [numError, setNumError] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGenres, setSelectedGenres] = useRecoilState(selectedGenresState);
    const [movies, setMovies] = useRecoilState(movieState);
    const setRoomNumber = useSetRecoilState(roomNumberState);
    const setRoom = useSetRecoilState(currentRoomState);

    const fetchGenres = async () => {
        let response: any = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${movieKey}&language=en-US`);
        if (response.ok) {
            response = await response.json();
            const genres = response.genres;
            DATA = genres;
            setIsLoading(false);
        } else {
            setError(response.message);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const Item = (props: GenreItem) => {
        return (
            <TouchableOpacity onPress={props.onPress} style={[setupStyles.genreItem, { borderColor: props.borderColor }]}>
                <Text style={[setupStyles.genreText, { color: props.textColor }]}>{props.genre.name}</Text>
            </TouchableOpacity>
        )
    }

    const renderItem: ListRenderItem<Genre> = ({ item }) => {
        const borderColor = (selectedGenres.includes(item)) ? COLORS.GENRE_PURPLE : COLORS.GENRE_WHITE;
        const textColor = (selectedGenres.includes(item)) ? COLORS.GENRE_PURPLE : COLORS.GENRE_WHITE;
        return (
            <Item
                genre={item}
                onPress={() => {
                    const selected = Object.assign([], selectedGenres);
                    if (selectedGenres.includes(item)) {
                        selected.splice(selected.indexOf(item), 1);
                        setSelectedGenres(selected);
                    } else {
                        selected.push(item);
                        setSelectedGenres(selected); // this is probably redundant
                    }

                }}
                borderColor={borderColor}
                textColor={textColor}
            />
        )
    }
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
                <Text style={genStyles.title}>New Room</Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ borderRadius: 20 }}>
                    <Formik
                        initialValues={{ size: "" }}
                        onSubmit={async (values) => {
                            if(!values.size || values.size === "") {
                                setNumError(true);
                            } else {
                                setNumError(false);
                                try {
                                    const rmSize = parseInt(values.size);
                                    const movies = await fetchMovies(selectedGenres);
                                    const movieObj = createMovieObjects(movies);
                                    const room: Room = {
                                        size: rmSize,
                                        isVoting: false,
                                        selectedGenres: selectedGenres,
                                        connectedUsers: 0,
                                        movies: movieObj,
                                        movieVotes: [],
                                    }
                                    const rmCode = createRoom(room);
                                    setMovies(movieObj);
                                    setRoomNumber(await rmCode);
                                    setRoom(room);

                                } catch (error: any) {
                                    console.log(error);
                                    setError(error.message);
                                }
                                nav.navigate(SCREENS.HOST_WAIT);
                            } 
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={setupStyles.formContainer}>
                                <View style={genStyles.groupContainer}>
                                    <View style={setupStyles.column}>
                                        <Text style={genStyles.subtitle}>Number of People</Text>
                                        <Text style={genStyles.errorText}>{numError ? 'Please enter a valid room size.' : ''}</Text>
                                        <Text style={genStyles.errorText}>{error ? error : ''}</Text>
                                        <View style={setupStyles.codeContainer}>
                                            <TextInput
                                                maxLength={4} // input length  
                                                onChangeText={handleChange("size")}
                                                onBlur={handleBlur("size")}
                                                autoCapitalize='characters'
                                                underlineColorAndroid='transparent'
                                                value={values.size}
                                                style={setupStyles.codeText}
                                                keyboardType='number-pad'
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={setupStyles.genreContainer}>
                                    <Text style={genStyles.subtitle}>Preference</Text>
                                    <Text style={genStyles.text}>Filter by genre:</Text>
                                    {isLoading ? <ActivityIndicator size={'small'} /> : <FlatList
                                        data={DATA}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => { return item.id; }}
                                        extraData={selectedGenres}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={5}
                                        style={{ display: 'flex', height: '15rem', flexGrow: 0, }}
                                    />
                                    }
                                </View>
                                <View style={{padding: '10%'}}/>
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
                </ScrollView>
            </View>
        </View>
    )
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
        height: '100%',
    },
    genreText: {
        fontFamily: 'Poppins',
        color: COLORS.WHITE,
        fontSize: 11,
    },
    genreItem: {
        borderRadius: 15,
        padding: '1%',
        borderWidth: 2,
        alignItems: 'center',
        marginRight: '0.5%',
        marginBottom: '0.5%',
    },

    codeContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: COLORS.TEXT_INPUT,
        borderRadius: 20,
        padding: '3%',
    },
    codeText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Poppins',
        backgroundColor: COLORS.TEXT_INPUT,
        textAlign: 'center',
    },

    createButton: {
        borderRadius: 20,
        width: '100%',
        marginTop: '20%',
    },

    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: COLORS.WHITE
    },

    createButtonContainer: {
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '35%',
        zIndex: 0,
    },
    genreContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.DARK_GREY,
        paddingHorizontal: '5%',
        paddingVertical: '7%',
        borderRadius: 20,
        height: '100%',
        flex: 1,
        marginTop: 10,
    },
}));
