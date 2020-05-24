import React, { Component } from 'react';
import { TouchableOpacity, StatusBar, Modal, RefreshControl, View, Text, FlatList, Alert, Image, AsyncStorage, TouchableHighlight } from 'react-native';
import config from '../config';
import { ListItem, ThemeProvider } from 'react-native-elements';
import Footer from '../components/Footer';
import ImageViewer from 'react-native-image-zoom-viewer';
import firebase from "firebase";
import styles from "../css/mainStyle";
import ImageCollage from '../components/ImageCollage';
const theme = {
  ListItem: {
    titleStyle: {
      color: '#000000',
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
};
console.disableYellowBox = true;
export default class AllBedSheets extends Component {
  state = {
    modalVisible: false,
    modalImages: [],
    bedsheets: [],
    currentUser: null,
    currentStore: null,
    loading: false,
    data: {},
    disableFooter: false
  };
  imageBrowserCallback = (images) => {
    let imageUrls = [];
    for (var image = 0; image < images.length; image++) {
      imageUrls.push({ url: images[image] });
    }
    this.setState({
      modalImages: imageUrls,
      modalVisible: true
    });
    StatusBar.setHidden(true);
  }
  ConfirmDelete = async (documentId) => {
    Alert.alert(
      "Delete Post",
      "Do you really want to delete this Post?",
      [
        {
          text: "Yes",
          onPress: () => this.DeletePost(documentId)
        },
        { text: "No", onPress: () => console.log("OK") }
      ]
    );

  }
  DeletePost = async (documentId) => {
    this.setState({ loading: true });
    config.shared.fireS.collection("bedsheet-store").doc(documentId).delete().then(doc => {
      this.setState({
        bedsheets: [],
        loading: false,
        data: {},
        disableFooter: false
      });
      this.lastKnownKey = null;
      this.loadEverything();
    }).catch(function (error) {
      console.error("Error removing document: ", error);
      this.setState({ loading: false });
    });
  }
  addPosts = bedsheets => {
    this.setState(previousState => {
      let data = {
        ...previousState.data,
        ...bedsheets
      };
      return {
        data,
        // Sort the data by timestamp
        bedsheets: Object.values(data).sort((a, b) => a.timeStamp < b.timeStamp)
      };
    });
  };
  viewProfile = async (profileId, storeName) => {
    this.props.navigation.navigate('Store', {
      profileId: profileId,
      storeName: storeName
    });

  }
  likePost = async (documentId, liked) => {
    this.setState({ loading: true });
    const objIndex = this.state.bedsheets.findIndex((obj => obj.id == documentId));
    var totalLikes = 0;
    var docRef = config.shared.fireS.collection("bedsheet-store").doc(documentId);
    await docRef.update({
      users: liked ? firebase.firestore.FieldValue.arrayRemove(this.state.currentUser) : firebase.firestore.FieldValue.arrayUnion(this.state.currentUser),
    });
    await docRef.get().then(doc => {
      totalLikes = doc.data().users.length;
      // console.log(doc.data().users.length)
      this.setState({
        bedsheets: [
          ...this.state.bedsheets.slice(0, objIndex),
          Object.assign({}, this.state.bedsheets[objIndex], { likes: totalLikes, liked: !liked, }),
          ...this.state.bedsheets.slice(objIndex + 1),
        ],
      });
    });
    this.setState({ loading: false });
  }
  componentWillUnmount() {
    this.focusListener.remove()
  }
  loadEverything = (lastKey) => {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });
    let ref = config.shared.fireS.collection("bedsheet-store").where("approved", "==", true).orderBy("timeStamp", "desc").limit(config.shared.pageSize);
    if (lastKey) {
      ref = ref.startAfter(lastKey);
    }
    ref.get()
      .then(snapshot => {
        if (snapshot.empty || snapshot.docs.length < config.shared.pageSize) {
          this.setState({ disableFooter: true });
        }
        if (!snapshot.empty) {
          const bedsheets = []
          snapshot.forEach(doc => {
            const { description, timeStamp, dateTime, user, storeName, images, users } = doc.data();
            bedsheets.push({
              id: doc.id,
              description,
              timeStamp,
              dateTime,
              user,
              storeName,
              images,
              likes: users.length,
              liked: users.indexOf(this.state.currentUser) != -1 ? true : false
            });
          })
          // console.log(bedsheets);
          this.lastKnownKey = snapshot.docs[snapshot.docs.length - 1];
          let posts = {};
          for (let child of bedsheets) {
            posts[child.id] = child;
          }
          this.addPosts(posts);
        }
        this.setState({ loading: false });
      })
      .catch(error => console.log(error))
  }
  _onRefresh = () => this.loadEverything();
  onPressFooter = () => this.loadEverything(this.lastKnownKey);
  onFocusFunction = () => {
    this.loadEverything();
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    });
    this.setState({
      currentUser: await AsyncStorage.getItem('user'),
      currentStore: await AsyncStorage.getItem('storeName'),
      isAdmin: await AsyncStorage.getItem('admin')
    });
  }
  render() {
    return (
      <View >
        < FlatList refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this._onRefresh}
          />
        }
          ListFooterComponent={footerProps => (
            <Footer disabled={this.state.disableFooter} {...footerProps} onPress={this.onPressFooter} />
          )}
          onEndReachedThreshold={0.4}
          onEndReached={this.onPressFooter.bind(this)}
          data={this.state.bedsheets}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <ThemeProvider theme={theme}>
                <ListItem onPress={() => this.viewProfile(item.user, item.storeName)}
                  title={item.storeName + "(" + item.user + ")"}
                  subtitle={item.dateTime}
                // leftAvatar={{ source: { uri: item.image } }}
                />
              </ThemeProvider>
              <View style={styles.inner}>
                <Text style={styles.description}>{item.description}</Text>
                <ImageCollage images={item.images} callback={() => this.imageBrowserCallback(item.images)}></ImageCollage>
                {this.state.currentUser != null &&
                  <TouchableOpacity onPress={() => this.likePost(item.id, item.liked)}
                    style={styles.likeButtonStyle}>
                    <Image
                      source={item.liked ? require('../../assets/like-liked.png') : require('../../assets/like.png')}
                      style={styles.ImageIconStyle}
                    />
                    <Text>{"   " + item.likes}</Text>
                  </TouchableOpacity>
                }
                {this.state.isAdmin == "true" &&
                  <TouchableOpacity onPress={() => this.ConfirmDelete(item.id)}
                    style={styles.likeButtonStyle}>
                    <Text>Delete</Text>
                  </TouchableOpacity>}
              </View>
            </View>
          )}
        />

        <Modal visible={this.state.modalVisible}
          transparent={true}>
          <View style={{ backgroundColor: 'black' }}>
            <TouchableHighlight style={{ marginTop: 20, marginRight: 20, alignSelf: 'flex-end' }} onPress={() => { this.setState({ modalVisible: false }); StatusBar.setHidden(false); }}>
              <Text style={{ color: 'white', fontSize: 30 }}>      X </Text>
            </TouchableHighlight>
          </View>
          <ImageViewer imageUrls={this.state.modalImages} />
        </Modal>

      </View >
    );
  }
}