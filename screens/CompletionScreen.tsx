import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, FlatList, Dimensions, StyleProp, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { Button, makeStyles, Image, Icon, FAB } from 'react-native-elements';
import { fetchMoviePosters } from '../utils/movie_api';
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil';
import { loadedGenresState, movieState, movieVoteState, roomNumberState } from '../state/atoms/atoms';
import { Genre, Movie, Room } from '../constants/Types';
import { useState } from 'react';
import { generalStyles } from './../constants/Styles';
import { COLORS } from '../constants/Colors';
import { AntDesign, Entypo, } from '@expo/vector-icons';
import { DetailItem } from '../components/DetailItem';
import { useSwipe } from '../hooks/useSwipe';
import { doc, onSnapshot, getFirestore, getDoc } from 'firebase/firestore';
import { currentRoomState, selectedGenresState } from './../state/atoms/atoms';
import { incrementVotesSubmitted, updateRoomField } from '../utils/utils';
import { useNavigation } from '@react-navigation/core';
import { SCREENS } from './constants';

// - 

export const CompletionScreen = () => {
    const styles = voteStyles();
    const genStyles = generalStyles();
    const nav = useNavigation();

    const resetGenres = useResetRecoilState(selectedGenresState);
    const resetLoadedGenres = useResetRecoilState(loadedGenresState);
    const resetCurrentRoom = useResetRecoilState(currentRoomState);
    const resetRoomNumber = useResetRecoilState(roomNumberState);
    const resetMovie = useResetRecoilState(movieState);
    const resetMovieVotes = useResetRecoilState(movieVoteState);

    const [posIndex, setposIndex] = useState<number>(-1);
    const [movieVotes, setMovieVotes] = useRecoilState(movieVoteState);
    const [showDetails, setShowDetails] = useState(false);
    const loadedGenres = useRecoilValue(loadedGenresState);
    const roomCode = useRecoilValue(roomNumberState);
    const [room, setRoom] = useRecoilState(currentRoomState);
    const [votingComplete, setVotingComplete] = useState(false);
    const [activeGenres, setActiveGenres] = useState<Genre[]>(loadedGenres);
    const movies = useRecoilValue(movieState);
    const posters = fetchMoviePosters(movies);
    const initialRender = useRef(true);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    useEffect(() => {
        console.log('curRoom: ', room);
        console.log('movie votes: ', movieVotes);
        console.log(votingComplete);
    })

    useEffect(() => {
        if (initialRender.current === true) {
            //updateVotes();
            initialRender.current = false;
        } else {
            // nothing ig
        }
        const unsub = onSnapshot(doc(db, "Rooms", `${roomCode}`), (doc) => {
            const document = doc.data();
            if (document) {
                setMovieVotes(document.movieVotes);
                if (document.votesSubmitted >= document.size) {
                    setVotingComplete(true);
                    unsub();
                }
            } else {
                console.log('error');
            }
        });

        return () => {
            unsub();
        }

    }, [])

    useEffect(() => {
        // call unsub() to unsubscribe
        
    }, []);

    const window = Dimensions.get('window');
    const db = getFirestore();




    // useEffect(() => {
    //     console.log ('current posIndex', posIndex);
    //     if (posIndex !== -1) {
    //         const result = loadedGenres.filter(value => {
    //             return movies[posIndex].genre_ids.includes(value.id);
    //         });
    //         setActiveGenres(result);
    //     }


    // }, [posIndex]);

    useEffect(() => {
        if (votingComplete && room.movieVotes && initialRender.current === false) {
            console.log('voting complete, calculating result...');
            let maxVal = 0;
            let results = [];
            for (let i = 0; i < room.movieVotes.length; i++) {
                if (room.movieVotes[i] > maxVal) {
                    maxVal = room.movieVotes[i];
                }
            }

            for (let i = 0; i < room.movieVotes.length; i++) {
                if (room.movieVotes[i] == maxVal) {
                    results.push(i); // results keep track of all the indexes that have the maximum number of votes
                }
            }

            console.log('winning votes: ', results);
            if (results[0]) {
                setposIndex(results[0]); // by default, display the first result
            }
            console.log(' winning position: ', posIndex);
        }
    }, [votingComplete]);

    const popularityPercentage = (value: number) => {
        return `${Math.round(value * 10)}%`;
    };



    return (
        <View style={styles.layout}>
            {(votingComplete) ?
                <View style={styles.container}>
                    <Text style={genStyles.title}>Winner: </Text>
                    <View style={{
                        borderRadius: 20,
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}>
                        <Image source={{ uri: posters[posIndex] ? posters[posIndex] : '' }} PlaceholderContent={<ActivityIndicator />} style={{
                            resizeMode: 'cover',
                            height: showDetails ? window.height * 0.35 : window.height * 0.65,
                            minHeight: showDetails ? 0 : 500,
                            width: window.width,
                            zIndex: 0,
                            borderRadius: 70,
                        }}></Image>
                    </View>
                    <View style={{
                        height: showDetails ? window.height * 0.65 : window.height * 0.35,
                        width: '100%',
                        backgroundColor: COLORS.BLACK,
                        borderRadius: 20,
                        paddingHorizontal: '10%',
                        alignItems: 'center',
                    }}>
                        {showDetails ? <AntDesign
                            name="down" size={25} color={COLORS.WHITE} onPress={toggleDetails}
                        /> :
                            <AntDesign name="up" size={25} color={COLORS.WHITE} onPress={toggleDetails} />
                        }

                        <Text style={styles.movieTitle}>{movies[posIndex] ? movies[posIndex].original_title : 'placeholder'}</Text>
                        <View style={styles.detailRow}>
                            <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posIndex] ? movies[posIndex].release_date.split('-').at(0) : 'TBA'} />
                            <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posIndex] ? movies[posIndex].original_language.toUpperCase() : 'placeholder'} />
                            <Text style={styles.popularityText}>{popularityPercentage(movies[posIndex] ? movies[posIndex].vote_average : 0)}</Text>
                        </View>
                        {showDetails ?
                            <View>
                                <Text style={styles.descriptionText}>{movies[posIndex] ? movies[posIndex].overview : 'placeholder'}</Text>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginTop: '2%',
                                }}>
                                </View>

                            </View>
                            : null
                        }
                    </View>
                    <FAB onPress={() => {
                        resetGenres();
                        resetCurrentRoom();
                        resetLoadedGenres();
                        resetRoomNumber();
                        resetMovie();
                        resetMovieVotes();
                        nav.navigate(SCREENS.HOME);
                    }} title="Restart" color={COLORS.DETAIL_BLUE} style={{ bottom: '5%', }}/>
                </View>
                :
                <View style={genStyles.groupContainer}>
                    <Text style={styles.movieTitle}>Waiting for result :)</Text>
                </View>
            }

        </View>
    )
}

const voteStyles = makeStyles(() => ({
    layout: {
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.BLACK,
        zIndex: 0,
    },
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
    },

    movieTitle: {
        fontSize: 24,
        fontFamily: 'PoppinsSemiBold',
        color: COLORS.WHITE,
    },
    detailRow: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', },
    detailText: {
        fontSize: 14,
        color: COLORS.WHITE,
        fontFamily: 'PoppinsLight',
    },

    detailContainer: {
        alignItems: 'center',
        backgroundColor: COLORS.DETAIL_GREY,
        borderRadius: 7,
        padding: '2%',
        marginRight: '2%',
    },

    popularityText: {
        flex: 4,
        textAlign: 'right',
        fontSize: 14,
        color: COLORS.DETAIL_BLUE,
        fontFamily: 'Poppins',
        marginTop: '2%',
    },

    descriptionText: {
        fontSize: 14,
        color: COLORS.GENRE_WHITE,
        fontFamily: 'Poppins',
        marginTop: '2%',
    }
}));


