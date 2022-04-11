import React, { useEffect, useRef } from 'react';
import { Text, View, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { makeStyles, Image, FAB } from 'react-native-elements';
import { fetchMoviePosters } from '../utils/movie_api';
import { useRecoilValue, useRecoilState } from 'recoil';
import { loadedGenresState, movieState, movieVoteState, roomNumberState } from '../state/atoms/atoms';
import { Genre } from '../constants/Types';
import { useState } from 'react';
import { COLORS } from '../constants/Colors';
import { AntDesign, Entypo, } from '@expo/vector-icons';
import { DetailItem } from '../components/DetailItem';
import { useSwipe } from '../hooks/useSwipe';
import { useNavigation } from '@react-navigation/core';
import { SCREENS } from './constants';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { incrementVotesSubmitted, updateRoomField } from '../utils/utils';

//TODO: get swiping working
//TODO: figure out a way to sync voting (voting end waiting screen ?)
//TODO: add animations to the detail display + swiping

// - 

export const VotingScreen = () => {
    const styles = voteStyles();
    const nav = useNavigation();

    const [posterIndex, setPosterIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [movieVotes, setMovieVotes] = useRecoilState(movieVoteState);
    const loadedGenres = useRecoilValue(loadedGenresState);
    const [activeGenres, setActiveGenres] = useState<Genre[]>(loadedGenres);
    const roomCode = useRecoilValue(roomNumberState);
    const window = Dimensions.get('window');
    const initialRender = useRef(true);

    const movies = useRecoilValue(movieState);
    const posters = fetchMoviePosters(movies);

    const db = getFirestore();

    const updateVotes = async () => {
        let docSnap = await getDoc(doc(db, "Rooms", `${roomCode}`));
        if (docSnap.exists()) {
            //should return this as room object
            const document = docSnap.data();
            const roomVotes = document.movieVotes;
            const results = Object.assign(new Array<number>(20), movieVotes);
            for (let i = 0; i < movieVotes.length; i++) {
                results[i] = (movieVotes[i] + ((roomVotes[i]) ? roomVotes[i] : 0));
                console.log('results[i]: ', results[i], i);
            }
            //console.log('new results', movieVotes);
            const res = await updateRoomField(roomCode.toString(), 'movieVotes', results);
            const response = await incrementVotesSubmitted(roomCode.toString());
        }
    }

    const checkVotingComplete = async () => {
        if (posterIndex >= movies.length - 1) {
            const updateStatus = await updateVotes();
            console.log('update status: ', updateStatus);
            nav.navigate(SCREENS.ENDING);
        }
    }

    useEffect(() => {
        if (initialRender.current === true) {
            initialRender.current = false;
        } else {
            setPosterIndex(posterIndex + 1);
        }
    }, [movieVotes])

    useEffect(() => {
        const result = loadedGenres.filter(value => {
            return movies[posterIndex] ? movies[posterIndex].genre_ids.includes(value.id) : false;
        });
        setActiveGenres(result);
    }, [posterIndex]);

    const popularityPercentage = (value: number) => {
        return `${Math.round(value * 10)}%`;
    }

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    }

    const onSwipeLeft = async () => {
        const votes = Object.assign(new Array<number>(20), movieVotes);
        votes[posterIndex] = 0;
        setMovieVotes(votes);
    }

    const onSwipeRight = async () => {
        const votes = Object.assign(new Array<number>(20), movieVotes);
        votes[posterIndex] = 1;
        setMovieVotes(votes);
    }

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 1)

    return (
        <ScrollView style={styles.layout} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <View style={styles.container}>
                <View style={{
                    borderRadius: 20,
                    alignItems: 'center',
                    overflow: 'hidden',
                }}>
                    <Image source={{ uri: posters[posterIndex] ? posters[posterIndex] : '' }} PlaceholderContent={<ActivityIndicator />} style={{
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

                    <Text style={styles.movieTitle}>{movies[posterIndex] ? movies[posterIndex].original_title : 'placeholder'}</Text>
                    <View style={styles.detailRow}>
                        <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posterIndex] ? movies[posterIndex].release_date.split('-').at(0) : 'TBA'} />
                        <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posterIndex] ? movies[posterIndex].original_language.toUpperCase() : 'placeholder'} />
                        <Text style={styles.popularityText}>{popularityPercentage(movies[posterIndex] ? movies[posterIndex].vote_average : 0)}</Text>
                    </View>
                    {showDetails ?
                        <View>
                            <Text style={styles.descriptionText}>{movies[posterIndex] ? movies[posterIndex].overview : 'placeholder'}</Text>
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
                <FAB style={{ position: 'absolute', left: '20%', bottom: '5%', }} color={COLORS.SWIPE_PURPLE} icon={<Entypo name="cross" size={24} color="white" />} onPress={() => {
                    onSwipeLeft();
                    checkVotingComplete();
                }} />
                <FAB style={{ position: 'absolute', right: '20%', bottom: '5%' }} color={COLORS.SWIPE_BLUE} icon={<AntDesign name="heart" size={24} color="white" />} onPress={() => {
                    onSwipeRight();
                    checkVotingComplete();
                }} />
                <FAB style={{ position: 'absolute', right: '20%', top: '5%' }} color={COLORS.SWIPE_BLUE} icon={<AntDesign name="heart" size={24} color="white" />} onPress={() => {
                    nav.goBack();
                }} />

            </View>
        </ScrollView>
    )
}

const Item = (url: any) => {
    return (
        <View>
            <Image source={{ uri: url }} PlaceholderContent={<ActivityIndicator />} />
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

function db(db: any, arg1: string, arg2: string): import("@firebase/firestore").DocumentReference<import("@firebase/firestore").DocumentData> {
    throw new Error('Function not implemented.');
}

