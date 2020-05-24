import React, { Component } from 'react'
import { View, Text, Image, Linking } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import styles from '../css/mainStyle';

export default class Login extends Component {
    render() {
        const element = () => (
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.contactText}>Facebook Page:  </Text>
                <Text style={{ fontSize: 15, marginTop: 20, marginBottom: 15, color: 'blue', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://www.facebook.com/100172501688624')} >E Textiles</Text>

            </View>
        );
        return (
            <View style={styles.mainContact}>
                <Image source={require('../../assets/contact.jpeg')} style={{ margin: 0, height: '50%', width: '100%' }} />
                <Table style={{ width: '100%', marginLeft: 20 }}>
                    <Row data={['Contact Number (LandLine):   041-2644440']} textStyle={styles.contactText} />
                    <Row data={['Contact Number (Mobile):    0300-9654433']} textStyle={styles.contactText} />
                    <Row data={['Email us at:    makkaahfabrics@gmail.com']} textStyle={styles.contactText} />
                    <Row data={[element()]} />
                </Table>
                <View style={styles.bottom}>
                    <Text style={{ color: '#DA2D38', fontSize: 12 }}>Developed By: Asma Nisar (anisar200@gmail.com)</Text>
                </View>
            </View>

        )
    }
}
