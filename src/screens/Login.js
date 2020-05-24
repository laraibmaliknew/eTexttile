import React, { Component } from 'react'
import {
    TouchableHighlight,
    View,
    Text,
    TextInput,
    Alert,
    AsyncStorage
} from 'react-native';
import { CheckBox } from 'react-native-elements'
import styles from '../css/mainStyle';
// import { Updates } from 'expo';
import config from '../config';
const collectionName = 'user-info';

export default class Login extends Component {
    state = {
        phone: '',
        password: '',
        storeName: '',
        admin: false
    };
    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
        });
    }
    onFocusFunction = () => {
        this.setState({
            phone: '',
            password: '',
            storeName: '',
            admin: false
        });
    }
    componentWillUnmount() {
        this.focusListener.remove()
    }
    loginUser = () => {
        var docRef = config.shared.fireS.collection(collectionName).doc(this.state.phone);
        docRef.get().then(doc => {
            if (doc.exists) {
                if (doc.data().password == this.state.password) {
                    if (doc.data().approved) {
                            if (doc.data().admin) {
                                this.state.admin = true;
                            }
                            this.state.storeName = doc.data().storeName;

                            this.setUserValue();
                    }
                    else {
                        Alert.alert("Your account is not approved by Admin.");
                    }
                }
                else {
                    Alert.alert("Please enter valid Password.");
                }
            } else {
                Alert.alert("Please enter valid Phone Number and Password.");
                console.log("No such document!");
            }

        }).catch(function (error) {
            Alert.alert("Some error occured", "Please check your internet connection and try again.");
            console.log("Error getting document:", error);
        });
    }
    setUserValue = async () => {
        await AsyncStorage.setItem("user", this.state.phone);
        await AsyncStorage.setItem("storeName", this.state.storeName);
        await AsyncStorage.setItem("admin", this.state.admin + "");
        if (this.state.admin) {
            this.props.navigation.replace('MainAdm');
        }
        else {
            this.props.navigation.replace('Main');
        }
    }
    validateLogin = () => {
        if (this.validatePhoneNumber()) {
            if (this.state.password != null || this.state.password.length >= 5) {
                this.loginUser();
            }
            else {
                Alert.alert("Please Enter at least 5 character long Password.");
            }
        }
        else {
            Alert.alert("Please Enter a valid Phone Number.");
        }
    }
    validatePhoneNumber = () => {
        var regexp = /03[0-9]{9}/;
        return regexp.test(this.state.phone)
    }
    render() {
        return (
            <View style={styles.main}>
                <Text style={styles.title}>Phone Number </Text>
                <TextInput
                    style={styles.itemInput}
                    placeholder='Mobile Phone Number'
                    keyboardType='phone-pad'
                    value={this.state.phone}
                    onChangeText={phone => {
                        this.setState({ phone })
                    }}
                    maxLength={11}
                />
                <Text style={styles.title}>Password </Text>
                <TextInput
                    style={styles.itemInput}
                    placeholder='Password'
                    value={this.state.password}
                    secureTextEntry={true}
                    onChangeText={password => {
                        this.setState({ password })
                    }}
                />
                {/* <CheckBox
                    title='Login as Admin'
                    checked={this.state.admin}
                    checkedColor='#DA2D38'
                    onPress={() => this.setState({ admin: !this.state.admin })}
                /> */}
                <TouchableHighlight
                    style={styles.button}
                    underlayColor="white"
                    onPress={this.validateLogin}
                >
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
