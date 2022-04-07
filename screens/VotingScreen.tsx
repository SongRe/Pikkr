import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, FlatList, Dimensions, StyleProp, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { Button, makeStyles, Image, Icon, FAB } from 'react-native-elements';
import { fetchMoviePosters } from '../utils/movie_api';
import { useRecoilValue, useRecoilState } from 'recoil';
import { loadedGenresState, movieState, movieVoteState } from '../state/atoms/atoms';
import { Genre, Movie } from '../constants/Types';
import { useState } from 'react';
import { generalStyles } from './../constants/Styles';
import { COLORS } from '../constants/Colors';
import { AntDesign, Entypo, } from '@expo/vector-icons';
import { DetailItem } from '../components/DetailItem';
import { useSwipe } from '../hooks/useSwipe';

//TODO: get swiping working
//TODO: figure out a way to sync voting (voting end waiting screen ?)
//TODO: add animations to the detail display + swiping

// - 

export const VotingScreen = () => {
    const styles = voteStyles();

    const [posterIndex, setPosterIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [movieVotes, setMovieVotes] = useRecoilState(movieVoteState);
    const loadedGenres = useRecoilValue(loadedGenresState);
    const [activeGenres, setActiveGenres] = useState<Genre[]>(loadedGenres);

    const window = Dimensions.get('window');


    const movies = useRecoilValue(movieState);
    const posters = fetchMoviePosters(movies);


    useEffect(() => {
        const result = loadedGenres.filter(value => {
            return movies[posterIndex].genre_ids.includes(value.id);
        });
        setActiveGenres(result);
    }, [posterIndex])

    const popularityPercentage = (value: number) => {
        return `${Math.round(value / 65)}%`;
    }

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    }


    const onSwipeLeft = () => {
        console.log('left swiped');
        setPosterIndex(posterIndex + 1);
    }

    const onSwipeRight = () => {
        const votes = Object.assign([], movieVotes);
        votes[posterIndex]++;
        setMovieVotes(votes);
        console.log('right swiped');
        setPosterIndex(posterIndex + 1);
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
                    <Image source={{ uri: posters[posterIndex] }} PlaceholderContent={<ActivityIndicator />} style={{
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

                    <Text style={styles.movieTitle}>{movies[posterIndex].original_title}</Text>
                    <View style={styles.detailRow}>
                        <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posterIndex].release_date.split('-').at(0)} />
                        <DetailItem style={styles.detailContainer} textStyle={styles.detailText} text={movies[posterIndex].original_language.toUpperCase()} />
                        <Text style={styles.popularityText}>{popularityPercentage(movies[posterIndex].popularity)}</Text>
                    </View>
                    {showDetails ?
                        <View>
                            <Text style={styles.descriptionText}>{movies[posterIndex].overview}</Text>
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
                <FAB style={{position: 'absolute', left: '20%', bottom: '5%',}} color={COLORS.SWIPE_PURPLE} icon={<Entypo name="cross" size={24} color="white" />} onPress={onSwipeLeft}/>
                <FAB style={{position: 'absolute', right: '20%', bottom: '5%'}} color={COLORS.SWIPE_BLUE} icon={<AntDesign name="heart" size={24} color="white"/>} onPress={onSwipeRight}/>
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

