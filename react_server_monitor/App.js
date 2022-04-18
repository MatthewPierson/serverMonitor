import React, { Component } from 'react';
import { View, ScrollView, Appearance, Text, Settings } from 'react-native';
import Footer from './Footer';
import Setup from './Setup';
import Home from './Home';
var RNFS = require('react-native-fs');
var path = RNFS.DocumentDirectoryPath + '/creds.json'; 

class App extends Component {

  // This function is called by other classes in order
  // to change the currently displayed class.
  // The footer variable is optional, only used when the
  // setup page is displayed
  updateView = (inputView, footer = true) => {
    this.setState({
        view: inputView,
        showFooter: footer,
      })
  }

  updateData = (url, port) => {
    this.setState({
      apiURL: url,
      port: port,
    })
  }

  constructor() {
    super();
    this.state = {
      view: <Text></Text>, // Replace this with a loading screen maybe?
      showFooter: true, // Default to showing the Footer
      apiURL: "N/A",
      port: "N/A",
    }
    // Check if a creds.json file exits, indicating that a user has already setup the app
    // Then we load the appropriate view
    RNFS.exists(path).then((val) => {
      if (val) {
        RNFS.readFile(path, "utf8")
        .then((contents) => {
            let tempJson = JSON.parse(contents)
            this.updateView(<Home apiURL={tempJson.apiURL} port={tempJson.port}/>)
            this.setState({apiURL: tempJson.apiURL, port:tempJson.port})
        })
      } else {
        this.updateView(<Setup parentCallback = {this.updateView}/>, false)
      }
    })
  }

  render() {
    
    const colorScheme = Appearance.getColorScheme();

    const view = this.state.view;
    let colour = '#ffffff'
    if (colorScheme === 'dark') {
      colour = '#121212'
    }

    return (
      <View style={{flex: 1, backgroundColor: colour}}>
        <ScrollView>
          {view}
        </ScrollView>
        {this.state.showFooter ? <Footer parentCallback = {this.updateView} dataUpdateCallback = {this.updateData} apiURL={this.state.apiURL} port={this.state.port}/> : null}
      </View>
    );
  }
}

export default App;