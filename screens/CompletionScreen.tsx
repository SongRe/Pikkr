import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, FlatList, Dimensions, StyleProp, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { Button, makeStyles, Image, Icon, FAB } from 'react-native-elements';
import { fetchMoviePosters } from '../utils/movie_api';
import { useRecoilValue, useRecoilState } from 'recoil';
import { loadedGenresState, movieState, movieVoteState, roomNumberState } from '../state/atoms/atoms';
import { Genre, Movie, Room } from '../constants/Types';
import { useState } from 'react';
import { generalStyles } from './../constants/Styles';
import { COLORS } from '../constants/Colors';
import { AntDesign, Entypo, } from '@expo/vector-icons';
import { DetailItem } from '../components/DetailItem';
import { useSwipe } from '../hooks/useSwipe';
import { doc, onSnapshot, getFirestore, getDoc } from 'firebase/firestore';
import { currentRoomState } from './../state/atoms/atoms';
import { incrementVotesSubmitted, updateRoomField } from '../utils/utils';

// - 

export const CompletionScreen = () => {
    const styles = voteStyles();
    const genStyles = generalStyles();

    const [posIndex, setposIndex] = useState<number>(0);
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
        if (initialRender.current === true) {
            updateVotes();
            initialRender.current = false;
        } else {
            // nothing ig
        }
    }, [])


    const updateVotes = async () => {
        let docSnap = await getDoc(doc(db, "Rooms", `${roomCode}`));
        if (docSnap.exists()) {
            //should return this as room object
            const document = docSnap.data();
            const roomVotes = document.movieVotes;
            const results = Object.assign(new Array<number>(20), movieVotes);
            console.log('prev results', results);
            for (let i = 0; i < movieVotes.length; i++) {
                results[i] = (movieVotes[i] + ((roomVotes[i]) ? roomVotes[i] : 0));
                console.log('results[i]: ', results[i], i);
            }
            console.log('movie votes after', movieVotes);
            setMovieVotes(results);
            console.log('new movie votes: ', results);
            //console.log('new results', movieVotes);
            const res = await updateRoomField(roomCode.toString(), 'movieVotes', results);
            const response = await incrementVotesSubmitted(roomCode.toString());
        }
    }

    const window = Dimensions.get('window');
    const db = getFirestore();

    // call unsub() to unsubscribe
    const unsub = onSnapshot(doc(db, "Rooms", `${roomCode}`), (doc) => {
        const document = doc.data();
        if (document) {
            const newRoom : Room = {
                size: document.size,
                isVoting: document.isVoting,
                connectedUsers: document.connectedUsers,
                movies: document.movies,
                movieVotes: document.movieVotes,
                votesSubmitted: document.votesSubmitted,
            }
            setRoom(newRoom);
        } else {
            console.log('error');
        }
    });

    useEffect(() => {
        if (room.votesSubmitted >= room.size) {
            console.log('we should display winning movie now');
            setVotingComplete(true);
            unsub();
        }

    }, [room.votesSubmitted]);

    useEffect(() => {
        const result = loadedGenres.filter(value => {
            return movies[posIndex].genre_ids.includes(value.id);
        });
        setActiveGenres(result);

    }, [posIndex]);

    useEffect(() => {
        console.log('room movie votes', room.movieVotes);
        if (votingComplete && room.movieVotes) {
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
            setposIndex(results[0]);

        }
    }, [votingComplete]);

    const popularityPercentage = (value: number) => {
        return `${Math.round(value * 10)}%`;
    };



    return (
        <View style={genStyles.layout}>
            <View style={genStyles.mainContainer}>
                {(votingComplete) ?
                    <View>
                        <View style={{
                            borderRadius: 20,
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}>
                            <Image source={{ uri: posters[posIndex] }} PlaceholderContent={<ActivityIndicator />} style={{
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

                            <Text style={styles.movieTitle}>{movies[posIndex] ? movies[posIndex].original_title : 'lol'}</Text>
                            <View style={styles.detailRow}>
                                <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posIndex].release_date.split('-').at(0)} />
                                <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posIndex].original_language.toUpperCase()} />
                                <Text style={styles.popularityText}>{popularityPercentage(movies[posIndex].vote_average)}</Text>
                            </View>
                            {showDetails ?
                                <View>
                                    <Text style={styles.descriptionText}>{movies[posIndex].overview}</Text>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginTop: '2%',
                                    }}>
                                        {activeGenres.map((genre) => {
                                            return (
                                                <DetailItem key={genre.id} style={styles.detailContainer} text={genre.name} textStyle={styles.detailText} />
                                            )
                                        })}
                                    </View>

                                </View>
                                : null
                            }
                        </View>
                    </View> :

                    <View style={genStyles.groupContainer}>
                        <Text style={genStyles.title}>Waiting for results...</Text>
                    </View>

                }
            </View>
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


