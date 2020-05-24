import React, { Component } from 'react';
import { Modal, StatusBar, TouchableHighlight, TouchableOpacity, RefreshControl, View, Text, FlatList } from 'react-native';
import config from '../config';
import { ListItem, ThemeProvider } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import Footer from '../components/Footer';
import styles from "../css/mainStyle"
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
export default class ApprovePost extends Component {
    state = {
        modalVisible: false,
        modalImages: [],
        bedsheets: [],
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
    addPosts = bedsheets => {
        this.setState(previousState => {
            let data = {
                ...previousState.data,
                ...bedsheets
            };
            return {
                data,
                bedsheets: Object.values(data).sort((a, b) => a.timeStamp < b.timeStamp)
            };
        });
    };
    ApprovePost = async (documentId) => {
        this.setState({ loading: true });
        let ref = config.shared.fireS.collection("bedsheet-store").doc(documentId);
        return ref.update({
            approved: true,
            timeStamp: config.shared.timestamp
        })
            .then(s => {
                this.setState({ bedsheets: this.state.bedsheets.filter(item => item.id !== documentId) });
                // console.log("Document successfully updated!");
                this.setState({ loading: false });
            })
            .catch(function (error) {
                console.error("Error updating document: ", error);
            });
    }
    DeletePost = async (documentId) => {
        this.setState({ loading: true });
        config.shared.fireS.collection("bedsheet-store").doc(documentId).delete().then(doc => {
            this.setState({ bedsheets: this.state.bedsheets.filter(item => item.id !== documentId) });
            // console.log("Document successfully deleted!");
            this.setState({ loading: false });
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }
    componentWillUnmount() {
        this.focusListener.remove()
    }
    loadEverything = (lastKey) => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        let ref = config.shared.fireS.collection("bedsheet-store").orderBy("timeStamp", "desc").where("approved", "==", false).limit(config.shared.pageSize);
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
                        const { description, timeStamp, dateTime, user, storeName, images } = doc.data();
                        bedsheets.push({
                            id: doc.id,
                            description,
                            timeStamp,
                            dateTime,
                            user,
                            storeName,
                            images
                        });
                    })
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
        this.setState({
            modalVisible: false,
            modalImages: [],
            bedsheets: [],
            loading: false,
            data: {},
            disableFooter: false
        });
        this.loadEverything();
    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
        });
        this.loadEverything();
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
                                <ListItem
                                    title={item.storeName + "(" + item.user + ")"}
                                    subtitle={item.dateTime}
                                />
                            </ThemeProvider>
                            <View style={styles.inner}>
                                <Text style={styles.description}>{item.description}</Text>
                                <ImageCollage images={item.images} callback={() => this.imageBrowserCallback(item.images)}></ImageCollage>
                                <TouchableOpacity onPress={() => this.ApprovePost(item.id)}
                                    style={styles.likeButtonStyle}>
                                    <Text>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.DeletePost(item.id)}
                                    style={styles.likeButtonStyle}>
                                    <Text>Delete</Text>
                                </TouchableOpacity>
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
