import React, { Component } from 'react';
import { Text, View, Appearance, StyleSheet, Dimensions } from 'react-native';
import separator from './separator';

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        marginVertical: 10,
        backgroundColor: '#a4a4a4',
        minWidth: '40%',
        maxWidth: '95%',
        minHeight: 50,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
    },
  });

export default class Box extends Component {

    constructor(props) {
        super(props);
    }    

    render() {

        const colorScheme = Appearance.getColorScheme();
  
        return (
            <View style={[styles.card, styles.shadowProp]}>
                {this.props.children}
            </View>
        );
    }
}
