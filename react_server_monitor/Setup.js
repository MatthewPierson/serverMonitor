import React, { Component } from 'react';
import { Text, View, Appearance, TextInput, Dimensions, TouchableHighlight, Alert, StyleSheet } from 'react-native';
import Home from './Home';
var RNFS = require('react-native-fs');
var path = RNFS.DocumentDirectoryPath + '/creds.json'; 

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    text: {
        fontSize: 13,
        fontWeight: '400',
        color: 'black',
        paddingHorizontal: 10,
        alignContent: 'flex-start',
    },
  });

export default class Setup extends Component {
    

    constructor(props) {
        super(props);
        this.state = {  
            apiURL: "",
            port: "",
        };
    }

    verify() {
        if (this.state.apiURL.includes("https") || 
            this.state.apiURL.includes("http") ||
            this.state.apiURL.includes(":") ||
            this.state.apiURL.includes("//") ||
            this.state.apiURL.split(".").length == 4 ||
            Number.isInteger(this.state.port)) {
                RNFS.writeFile(path, "{\"apiURL\": \"" + this.state.apiURL+ "\", \"port\": \"" + this.state.port + "\"}", 'utf8')
                .then((success) => {
                console.log('Wrote data to file.');
                })
                .then(this.props.parentCallback(<Home apiURL={this.state.apiURL} port={this.state.port}/>))
                .catch((err) => {
                console.log(err.message);
                });
        } else {
            Alert.alert(
                "Error: Invalid Data Provided",
                "Ensure that the given URL and port are valid.",
                [
                  { text: "OK"}
                ]
              );
        }
        
    }

    render() {
    
        const colorScheme = Appearance.getColorScheme();

        return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>Setup page</Text>
            <Text></Text>
            <Text style={styles.text}>Please enter the API's URL: </Text>
            <View style={{height: 40, width: "60%", backgroundColor: "grey", borderRadius: 10,}}>
                <TextInput
                    placeholder="http://192.168.1.100"
                    onChangeText={(text) => this.setState({apiURL: text})}
                    textAlign={'center'}
                />
            </View>
            <Text></Text>
            <Text style={styles.text}>Please enter the API's Port: </Text>
            <View style={{height: 40, width: "60%", backgroundColor: "grey", borderRadius: 10,}}>
                <TextInput
                    placeholder="3000"
                    onChangeText={(text) => this.setState({port: text})}
                    textAlign={'center'}
                />
            </View>
            <Text/>
            <TouchableHighlight style={{height: 40, width: "60%", backgroundColor: "grey", borderRadius: 10, justifyContent: 'center', alignItems: 'center'}} onPress={() => {this.verify()}} underlayColor="white" >
                <View >
                    <Text style={styles.text}>Submit</Text>
                </View>
            </TouchableHighlight>
        </View>
        );
    }
}
