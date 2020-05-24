import React, { Component } from 'react';
import { View, StatusBar, ScrollView, Text, TouchableHighlight, ImageBackground, TextInput, Alert, Button, AsyncStorage, Image } from 'react-native';
import config from '../config';
import uploadPhoto from '../components/uploadPhoto';
import ImageBrowser from '../components/ImageBrowser';
import shrinkImageAsync from '../components/shrinkImageAsync';
import styles from '../css/mainStyle';
import uuid from 'uuid';

const collectionName = 'bedsheet-store';

export default class AddBedSheet extends Component {
  state = {
    description: '',
    user: null,
    store: null,
    imageBrowserOpen: false,
    photos: [],
    remoteUris: [],
    waiting: false,
  };
  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      this.setState({
        imageBrowserOpen: false,
        photos
      })
    }).catch((e) => console.log(e))
  }

  renderImage(item, i) {
    if (i == 5 && this.state.photos.length > 6) {
      return (
        <ImageBackground source={{ uri: item.uri }} style={{ height: 100, width: 100 }}>
          <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.5)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#DA2D38' }}>{'+ ' + (this.state.photos.length - 6) + ' more'}</Text>
          </View>
        </ImageBackground>
      )
    }
    else {
      return (
        <Image
          style={{ height: 100, width: 100 }}
          source={{ uri: item.uri }}
          key={i}
        />
      )
    }
  }
  uploadImage = async (localuri) => {
    const ext = "jpg"; // Extract image extension
    const path = `${collectionName}/${this.state.user}/${uuid.v4()}.jpg`;
    const { uri: reducedImage, width, height } = await shrinkImageAsync(
      localuri,
    );
    this.setState({
      remoteUris: [...this.state.remoteUris, await this.uploadPhotoAsync(reducedImage, path)]
    });
  }

  uploadPhotoAsync = async (uri, path) => {
    return uploadPhoto(uri, path);
  };
  logOut = async () => {
    await AsyncStorage.clear().then(d => {
      AsyncStorage.setItem('firstVisit', 'no');
      Alert.alert("You have been unapproved by the Admin");
      this.props.navigation.replace('MainT');
    });
  };
  checkApproved = async () => {
    this.setState({ waiting: true });
    var docRef = config.shared.fireS.collection("user-info").doc(this.state.user);
    docRef.get().then(doc => {
      if (doc.exists) {
        if (!doc.data().approved) {
          this.logOut();
        }
        else {
          this.handleSubmit();
        }
      }
      else {
        this.logOut();
        Alert.alert("You account has been removed by the Admin");
        const AppContainer = createAppContainer(this.AppNavigator("MainT"));
        return <AppContainer />;
      }
    });
  }
  handleSubmit = async () => {
    this.setState({ waiting: true });
    var dateTime = new Date().toString().substring(0, 21);
    if (this.state.photos.length > 0) {
      for (let photo = 0; photo < this.state.photos.length; photo++) {
        await this.uploadImage(this.state.photos[photo].uri);
      }
      // console.log(this.state.remoteUris);
      config.shared.fireS.collection(collectionName).add({
        description: this.state.description,
        timeStamp: config.shared.timestamp,
        dateTime: dateTime,
        user: this.state.user,
        storeName: this.state.store,
        images: this.state.remoteUris,
        users: [],
        approved: false
      });
      Alert.alert("This Post will be displayed in Feed once approved by Admin.");
      this.props.navigation.navigate('Feed');
    }
    else {
      Alert.alert("Please choose at least one image.");
    }
    this.setState({ waiting: false });
  };
  onFocusFunction = () => {
    this.setState({
      description: '',
      imageBrowserOpen: false,
      photos: [],
      remoteUris: [],
      waiting: false
    });
  }
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    });
    const storeName = await AsyncStorage.getItem('storeName');
    const userPhone = await AsyncStorage.getItem('user');
    this.state.store = storeName;
    this.state.user = userPhone;
  }
  componentWillUnmount() {
    this.focusListener.remove()
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
    else if (this.state.imageBrowserOpen) {
      return ( 
          <ImageBrowser
            max={50} // Maximum number of pickable image. default is None
            headerCloseText={'Close'} // Close button text on header. default is 'Close'.
            headerDoneText={'Done'} // Done button text on header. default is 'Done'.
            headerButtonColor={'#DA2D38'} // Button color on header.
            headerSelectText={'Select'} // Word when picking.  default is 'n selected'.
            mediaSubtype={null} // Only iOS, Filter by MediaSubtype. default is display all.
            badgeColor={'#DA2D38'} // Badge color when picking.
            emptyText={'empty'} // Empty Text
            callback={this.imageBrowserCallback} // Callback functinon on press Done or Cancel Button. Argument is Asset Infomartion of the picked images wrapping by the Promise.
          />
      )
    }
    else {
      return (
        <View style={styles.main}>
          <Text style={styles.title}>Description</Text>
          <TextInput value={this.state.description}
            multiline
            style={styles.itemInputPost}
            placeholder="Add a neat description..."
            onChangeText={description => {
              this.setState({ description });
            }} />
          <View>
            <TouchableHighlight
              style={styles.button}
              underlayColor="white"
              onPress={() => this.setState({ imageBrowserOpen: true })}
            >
              <Text style={styles.buttonText}>Choose Images</Text>
            </TouchableHighlight>
            <ScrollView>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                {this.state.photos.map((item, i) => i < 3 ? this.renderImage(item, i) : null)}
              </View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                {this.state.photos.map((item, i) => i >= 3 ? this.renderImage(item, i) : null)}
              </View>
            </ScrollView>
          </View>
          <TouchableHighlight
            style={styles.button}
            underlayColor="white"
            onPress={this.checkApproved}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }
}