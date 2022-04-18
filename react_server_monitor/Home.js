import React, { Component } from 'react';
import { Text, View, Dimensions, Appearance, StyleSheet } from 'react-native';
import separator from './separator';
import  {LineChart} from 'react-native-chart-kit';
import Box from './Box';

const screenWidth = Dimensions.get("window").width;

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
    }
  });

const chartConfig = {
    color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
    strokeWidth: 1,
    barPercentage: 0.5,
    backgroundGradientFrom: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'transparent',
    backgroundGradientToOpacity: 0,
    propsForDots: {
        r: "1",
        strokeWidth: "1",
        stroke: "#000000"
    },
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };


export default class Home extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.apiURL)
        this.state = {  
            cpuUsage: "Fetching...",
            cpuUsageHistory: new Array(60).fill(0),
            ramUsageHistory: new Array(60).fill(0),
            cpuTemp: "Fetching...", 
            ramUsage: "Fetching...",
            diskData: {},
            ip: "Fetching...",
            name: "Fetching...",
            shadowplayStatus: false,
            expressAPIStatus: false,
            apiURL: this.props.apiURL,
            port: this.props.port,
        };
    }

    range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    async getJSONFromAPI(route) {
        const res = await fetch(this.state.apiURL + ":" + this.state.port + "/" + route);
        return await res.json();
    }

    getAll() {
        return Promise.all([
                            this.getJSONFromAPI('cpuUsage'),
                            this.getJSONFromAPI('cpuTemp'), 
                            this.getJSONFromAPI('memoryUsage'), 
                            this.getJSONFromAPI('diskUsage'), 
                            this.getJSONFromAPI('ip'), 
                            this.getJSONFromAPI('name'), 
                            this.getJSONFromAPI('services')
                        ])
    }

    render() {

        const colorScheme = Appearance.getColorScheme();

        setTimeout(() => {
            this.getAll()
            .then((data) => {

                this.state.cpuUsageHistory.shift()
                this.state.cpuUsageHistory.push(Number(data[0].cpuUsage))

                this.state.ramUsageHistory.shift()
                this.state.ramUsageHistory.push(Number(data[2].percentFree))

                this.setState({ 
                    cpuUsage: data[0].cpuUsage + "%", 
                    cpuTemp: data[1].cpuTemp + "c", 
                    ramUsage: data[2].percentFree + "% (" + separator((data[2].totalMem - data[2].freeMem).toFixed(2)) + "MB/" + separator(data[2].totalMem) + "MB)", 
                    diskData: data[3], 
                    ip: data[4].ip, 
                    name: (data[5].name).replace('\n', ''),
                    shadowplayStatus: data[6].shadowplay,
                    expressAPIStatus: data[6].expressAPI
                })
            })
            .catch(function(error) {
                console.log('Fetch Error: ' + error.message);
                });
        }, 1000)

        const cpuUsageData = {
            labels: this.range(-120, 0),
            datasets: [
              {
                data: this.state.cpuUsageHistory,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 1
              }
            ],
            legend: ["CPU Usage - Past 2 Minutes"]
        };

        const ramUsageData = {
            labels: this.range(-120, 0),
            datasets: [
              {
                data: this.state.ramUsageHistory,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 1
              }
            ],
            legend: ["RAM Usage - Past 2 Minutes"]
        };

        return (

            <View style={{
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center',
                }}>
                    <Box>
                        <Text style={[styles.heading, {paddingHorizontal: 10}]}>{this.state.name}/{this.state.ip}</Text>
                    </Box>
                    <Box>
                        <Text style={styles.subHeading}>CPU</Text>
                    </Box>
                    <Box>
                        <Text style={[styles.text, {paddingTop: 10}]}>Server CPU Usage: {this.state.cpuUsage}</Text>
                        <Text style={[styles.text, {paddingBottom: 10}]}>Server CPU Temperature: {this.state.cpuTemp}</Text>
                    </Box>
                    <Text/>
                    <Box>
                        <Text style={styles.subHeading}>RAM</Text>
                    </Box>
                    <Box>
                        <Text numberOfLines={1} style={styles.text}>Server RAM Usage: {this.state.ramUsage}</Text>
                    </Box>
                    <Text/>
                    <Box>
                        <Text style={styles.subHeading}>Services</Text>
                    </Box>
                    <Box>
                        <Text style={styles.text}>ShadowPlayMover Status: {this.state.shadowplayStatus ? "Active" : "Inactive"}</Text>
                        <Text style={styles.text}>ExpressAPI Status: {this.state.expressAPIStatus ? "Active" : "Inactive"}</Text>
                    </Box>
                    <Text/>
                    <Box>
                        <Text style={styles.subHeading}>Storage</Text>
                    </Box>
                    <Box>
                        <Text style={[styles.text, {paddingTop: 10}]}>Root - {(this.state.diskData.root / 1024 / 1024).toFixed(2) + "GB/"+ (this.state.diskData.rootSize / 1024 / 1024).toFixed(2) + "GB"}</Text>
                        <Text style={styles.text}>Time-Machine - {(this.state.diskData.timeMachine / 1024 / 1024).toFixed(2) + "GB/" + (this.state.diskData.timeMachineSize / 1024 / 1024).toFixed(2) + "GB"}</Text>
                        <Text style={styles.text}>SambaShare - {(this.state.diskData.samba / 1024 / 1024).toFixed(2) + "GB/" + (this.state.diskData.sambaSize / 1024 / 1024).toFixed(2) + "GB"}</Text>
                        <Text style={[styles.text, {paddingBottom: 10}]}>ShadowPlay - {(this.state.diskData.shadowPlay / 1024 / 1024).toFixed(2) + "GB/" + (this.state.diskData.shadowPlaySize / 1024 / 1024).toFixed(2) + "GB"}</Text>
                    </Box>
                    <Text/>
                    <Box>
                        <Text style={styles.subHeading}>Graphs</Text>
                    </Box>
                    <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center'
                    }}>
                    <LineChart
                        data={cpuUsageData}
                        width={screenWidth * 0.80}
                        height={250}
                        chartConfig={chartConfig}
                        formatYLabel={(label) => label + "%"}
                        formatXLabel={(label) => label % 60 == 0 ? label == 0 ? label : -label + " secs": "" }
                        withDots={true}
                        segments={3}
                    />
                </View>
                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center'
                    }}>
                    <LineChart
                        data={ramUsageData}
                        width={screenWidth * 0.80}
                        height={250}
                        chartConfig={chartConfig}
                        formatYLabel={(label) => label + "%"}
                        formatXLabel={(label) => label % 60 == 0 ? label == 0 ? label : -label + " secs": "" }
                        withDots={true}
                        segments={3}
                    />
                </View>
                <Text/>
                <Text/>
                <Text/>
                <Text/>
            </View>
        );
    }
}
