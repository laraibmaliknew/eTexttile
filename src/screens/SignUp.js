import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  Text,
  TextInput,
  Alert,
  ImageBackground
} from 'react-native';
import styles from '../css/mainStyle';
import config from '../config';
import firebase from 'firebase';
const collectionName = 'user-info';

export default class SignUp extends Component {
  state = {
    phone: '',
    password: '',
    rePassword: '',
    storeName: '',
    waiting: false,
    // privacyPolicy: false,
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
      rePassword: '',
      storeName: '',
      waiting: false,
      // privacyPolicy: false
    });
  }
  componentWillUnmount() {
    this.focusListener.remove()
  }
  validateSignUp = async () => {
    this.setState({ waiting: true });
    if (this.validatePhoneNumber()) {
      var docRef = config.shared.fireS.collection(collectionName).doc(this.state.phone);
      docRef.get().then(doc => {
        if (!doc.exists) {
          if (this.state.password != null && this.state.password.length >= 5) {
            if (this.state.password == this.state.rePassword) {
              if (this.state.storeName.length >= 2) {
                // this.setState({ waiting: true });
                // if (this.state.privacyPolicy) {
                  config.shared.fireS.collection(collectionName).doc(this.state.phone).set({
                    phoneNo: this.state.phone,
                    password: this.state.password,
                    storeName: this.state.storeName,
                    joiningDate: firebase.firestore.FieldValue.serverTimestamp(),
                    admin: false,
                    approved: false
                  })
                    .then(s => {
                      Alert.alert("Registration complete.", "You would be able to sign in once approved by Admin.");
                      this.props.navigation.navigate('Feed');
                      this.setState({ waiting: false });
                    })
                    .catch(error => {
                      this.setState({ waiting: false });
                      Alert.alert("Some error occured", "Please check your internet connection and try again.");
                      console.error("Error writing document: ", error);
                    });

                // }
                // else {
                //   Alert.alert("Please Check the Privacy Policy checkbox to SignUp.");
                //   this.setState({ waiting: false });
                // }
              }
              else {
                Alert.alert("Please Enter a valid Shop Name.");
                this.setState({ waiting: false });
              }
            }
            else {
              Alert.alert("Password and Re Type Password should be same.");
              this.setState({ waiting: false });
            }
          }
          else {
            Alert.alert("Please Enter at least 5 character long Password.");
            this.setState({ waiting: false });
          }
        }
        else {
          Alert.alert("You are already registered. Kindly login");
          this.setState({ waiting: false });
        }
      }).catch(error => {
        this.setState({ waiting: false });
        Alert.alert("Some error occured", "Please check your internet connection and try again.");
        console.log("Error getting document:", error);
      });
    }
    else {
      Alert.alert("Please Enter a valid Phone Number.");
      this.setState({ waiting: false });
    }
  }
  validatePhoneNumber = () => {
    var regexp = /03[0-9]{9}/;
    return regexp.test(this.state.phone)
  }
  render() {
    if (this.state.waiting) {
      return (
        <View style={styles.safeGif}>
          <View style={styles.gifV}>
            <ImageBackground source={require('../../assets/loading.gif')} style={styles.Gif}></ImageBackground>
          </View>
        </View>
      )
    }
    else {
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
          <Text style={styles.title}>Re Type Password </Text>
          <TextInput
            style={styles.itemInput}
            placeholder='Password'
            value={this.state.rePassword}
            secureTextEntry={true}
            onChangeText={rePassword => {
              this.setState({ rePassword })
            }}
          />
          <Text style={styles.title}>Shop Name </Text>
          <TextInput
            style={styles.itemInput}
            placeholder='shop name'
            value={this.state.storeName}
            onChangeText={storeName => {
              this.setState({ storeName })
            }}
          />
          {/* <CheckBox
            title='Click here to indicate that you have read and understood our privacy policy'
            checked={this.state.privacyPolicy}
            checkedColor='#DA2D38'
            onPress={() => this.setState({ privacyPolicy: !this.state.privacyPolicy })}
          /> */}
          <TouchableHighlight
            style={styles.button}
            underlayColor="white"
            onPress={this.validateSignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }
}
