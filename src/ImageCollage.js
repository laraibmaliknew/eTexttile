import React from 'react'
import {
    Text,
    View,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

export default class ImageCollage extends React.Component {


    render() {
        images = this.props.images;
        if (images != null) {
          if (images.length == 1) {
            return (
              <TouchableOpacity  onPress={() => this.props.callback()}
                style={{
                  flex: 1, //here you can use flex:1 also
                  aspectRatio: 1
                }}>
                <Image style={{ flex: 1 }} source={{ uri: images[0] }}></Image>
              </TouchableOpacity>
            )
          }
          else if (images.length == 2) {
            return (
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                <TouchableOpacity  onPress={() => this.props.callback()}
                  style={{
                    flexDirection: 'row'
                  }}>
                  <Image
                    style={{ height: 200, width: 200 }}
                    source={{ uri: images[0] }}
                  />
                  <Image
                    style={{ height: 200, width: 200 }}
                    source={{ uri: images[1] }}
                  />
                </TouchableOpacity>
              </View>
            )
          }
          else if (images.length == 3) {
            return (
              <ScrollView horizontal={true}>
                <TouchableOpacity  onPress={() => this.props.callback()}
                  style={{
                    flexDirection: 'row'
                  }}>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 400, width: 200 }}
                      source={{ uri: images[0] }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[1] }}
                    />
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[2] }}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )
          }
          else if (images.length == 4) {
            return (
              <ScrollView>
                <TouchableOpacity  onPress={() => this.props.callback()}>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[0] }}
                    />
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[1] }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[2] }}
                    />
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[3] }}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )
          }
          else if (images.length == 5) {
            return (
              <ScrollView>
                <TouchableOpacity  onPress={() => this.props.callback()}>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[0] }}
                    />
                    <Image
                      style={{ height: 200, width: 200 }}
                      source={{ uri: images[1] }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 133 }}
                      source={{ uri: images[2] }}
                    />
                    <Image
                      style={{ height: 200, width: 134 }}
                      source={{ uri: images[3] }}
                    />
                    <Image
                      style={{ height: 200, width: 133 }}
                      source={{ uri: images[4] }}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )
          }
          else {
            return (
              <ScrollView>
                <TouchableOpacity  onPress={() => this.props.callback()}>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 133 }}
                      source={{ uri: images[0] }}
                    />
                    <Image
                      style={{ height: 200, width: 134 }}
                      source={{ uri: images[1] }}
                    />
                    <Image
                      style={{ height: 200, width: 133 }}
                      source={{ uri: images[2] }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                    <Image
                      style={{ height: 200, width: 133 }}
                      source={{ uri: images[3] }}
                    />
                    <Image
                      style={{ height: 200, width: 134 }}
                      source={{ uri: images[4] }}
                    />
                    <ImageBackground source={{ uri: images[5] }} style={{ height: 200, width: 133 }}>
                      <View style={images.length>6?{ backgroundColor: 'rgba(52, 52, 52, 0.5)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }:''}>
                        <Text style={{color:'#DA2D38'}}>{images.length > 6 ? '+ ' + (images.length - 6) + ' more' : ''}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            )
          }
        }
      }
}