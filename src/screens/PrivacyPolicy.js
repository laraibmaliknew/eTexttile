import React, { Component } from 'react'
import {
    TouchableHighlight,
    View,
    Text,
    AsyncStorage,
    Linking
} from 'react-native';
import styles from '../css/mainStyle';

export default class PrivacyPolicy extends Component {
    iAgree = () => {
        AsyncStorage.setItem('firstVisit','no');
        this.props.navigation.replace('MainT');
    }
   
    render() {
        return (
            <View style={styles.main}>
                <Text style={{ fontSize: 15}}>Before Proceeding to E Textiles, We want you to read and understand E Textiles </Text>
                <Text style={{fontSize:15,  color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('https://sites.google.com/view/e-textiles')} > Privacy Policy.</Text>
    
                <Text style={{ fontSize: 15, marginTop:40}}>If You agree to the terms and conditions mentioned in the Privacy Policy then Click "I Agree" Button below to continue. </Text>
               <View style={styles.bottom}>
                <TouchableHighlight
                    style={styles.button}
                    underlayColor="white"
                    onPress={this.iAgree}
                >
                 <Text style={styles.buttonText}>I Agree</Text>
                </TouchableHighlight>
                </View>
            </View>
        )
    }
}
