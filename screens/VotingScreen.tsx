import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, FlatList } from 'react-native';
import { Button, makeStyles, Image } from 'react-native-elements';
import { fetchMoviePosters } from '../utils/movie_api';
import { useRecoilValue } from 'recoil';
import { movieState } from '../state/atoms/atoms';
import { Movie } from '../constants/Types';
import { useState } from 'react';
import { generalStyles } from './../constants/Styles';

//TODO: fix an issue where the images aren't rendered ? xd
// - 

export const VotingScreen = () => {
    const genStyles = generalStyles();
    const imgStyles = imageStyles();
    const [posterIndex, setPosterIndex] = useState(0);
  

    const movies = useRecoilValue(movieState);
    const posters = fetchMoviePosters(movies);
    const movieVote : number[] = [];

    console.log(posters);
    useEffect(() =>{
        console.log('current image uri: ', posters[posterIndex])
    })

    const renderItem = (url: string) => (
        <Item url = {url}/>
    );
    
    return (
        <View style={genStyles.layout}>
            <Image source = {{ uri: posters[posterIndex] }} PlaceholderContent={<ActivityIndicator/>} style={imgStyles.image}></Image>
        </View>
    )
}

const Item = (url : any) => {
    return (
    <View>
        <Image source={{ uri: url }} PlaceholderContent={<ActivityIndicator/>}/>
    </View>
    )
}

const imageStyles = makeStyles(() => ({
    image: {
        height: '100%',
        width: '100%',
    }
}));

