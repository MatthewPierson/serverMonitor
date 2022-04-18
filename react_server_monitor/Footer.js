import React, { Component } from 'react';
import { Text, View, TouchableHighlight, StyleSheet, Dimensions, Appearance } from 'react-native';
import Home from './Home';
import Settings from './Settings';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    footer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      position: 'absolute',
      height: 60,
      left: 0, 
      top: windowHeight - 60, 
      width: "100%",
      backgroundColor: '#a4a4a4'
    },
    footerBox: {  
      flex: 1,
      width: "33%",
      height: "100%",
      alignItems: "center",
      justifyContent: 'center',
    },
    buttonContainer: {
      width: "100%",
      height: "50%",
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
  });

export default class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const colorScheme = Appearance.getColorScheme();

        return (

            <View style={styles.footer}>
            <TouchableHighlight onPress={() => {this.props.parentCallback(<Home apiURL={this.props.apiURL} port={this.props.port}/>)}} underlayColor="white" style={styles.footerBox}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Home</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => {this.props.parentCallback(<Settings parentCallback = {this.props.parentCallback} parentUpdateDataCallback = {this.props.dataUpdateCallback} apiURL={this.props.apiURL} port={this.props.port}/>)}} underlayColor="white" style={styles.footerBox}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Settings</Text>
                </View>
            </TouchableHighlight>
            </View>
        );
    }
}
