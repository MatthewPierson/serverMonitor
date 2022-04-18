import React, { Component } from 'react';
import { Text, View, Appearance, TouchableHighlight, StyleSheet, TextInput } from 'react-native';
import Box from './Box';
import Setup from './Setup';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from "react-native-flash-message";
var RNFS = require('react-native-fs');
var path = RNFS.DocumentDirectoryPath + '/creds.json'; 

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    text: {
        fontSize: 13,
        fontWeight: '400',
        color: 'black',
        paddingHorizontal: 10,
        alignContent: 'flex-start',
    },
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

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apiURL: this.props.apiURL,
            port: this.props.port,
        }
    }

    verify() {
        if (this.state.apiURL.includes("https") || 
            this.state.apiURL.includes("http") ||
            this.state.apiURL.includes(":") ||
            this.state.apiURL.includes("//") ||
            this.state.apiURL.split(".").length == 4 ||
            Number.isInteger(this.state.port)) {
                RNFS.writeFile(path, "{\"apiURL\": \"" + this.state.apiURL+ "\", \"port\": \"" + this.state.port + "\"}", 'utf8')
                .then(() => {
                    return true
                })
                .catch(() => {
                    Alert.alert(
                        "Error: Failed to write data to disk",
                        "Please try again.",
                        [
                          { text: "OK"}
                        ]
                      );
                    return false
                });
        } else {
            Alert.alert(
                "Error: Invalid Data Provided",
                "Ensure that the given URL and port are valid.",
                [
                  { text: "OK"}
                ]
              );
              return false
        }
        
    }

    resetSettings() {
        RNFS.unlink(path)
        .then(
            this.props.parentCallback(<Setup parentCallback = {this.props.parentCallback}/>, false)
        )
    }

    updateConfig() {
        if (this.verify()) {
            this.props.parentUpdateDataCallback(this.state.apiURL, this.state.port)
            showMessage({
                message: "Updated Config!",
                type: "info",
                backgroundColor: "#a4a4a4",
                color: "black",
                style: styles.text
            })
        }
    }

    render() {

        const colorScheme = Appearance.getColorScheme();
  
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center', 
                alignItems: 'center',
            }}>
                <Box>
                    <Text style={[styles.heading, {paddingHorizontal: 10}]}>Settings Page </Text>
                </Box>
                <Text/>
                <Text/>
                <Text/>
                <View style={{height: 40, width: "60%", backgroundColor: "grey", borderRadius: 10,}}>
                    <TextInput
                        placeholder="http://192.168.1.100"
                        onChangeText={(text) => this.setState({apiURL: text})}
                        textAlign={'center'}
                    />
                </View>
                <TouchableHighlight style={[styles.card, styles.shadowProp]} underlayColor= 'white' onPress={() => {this.updateConfig()}}><Text style={styles.text}>Change Server IP</Text></TouchableHighlight>
                <View style={{height: 40, width: "60%", backgroundColor: "grey", borderRadius: 10,}}>
                    <TextInput
                        placeholder="3000"
                        onChangeText={(text) => this.setState({port: text})}
                        textAlign={'center'}
                    />
                </View>
                <TouchableHighlight style={[styles.card, styles.shadowProp]} underlayColor= 'white' onPress={() => {this.updateConfig()}}><Text style={styles.text}>Change Server Port</Text></TouchableHighlight>
                <Text/>
                <TouchableHighlight style={[styles.card, styles.shadowProp]} underlayColor= 'white' onPress={() => {this.resetSettings()}}><Text style={styles.text}>Reset Settings</Text></TouchableHighlight>
                <Text/>
                <Text/>
                <FlashMessage ref="settingsFlashMessage" />
            </View>
        );
    }
}
