import React, { Component } from 'react';
import { Button, Alert, AsyncStorage, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, } from 'react-navigation-tabs';
import {decode, encode} from 'base-64';
if(!global.btoa){global.btoa = encode};
if(!global.atob){global.atob = decode};
import tabBarIcon from './src/components/tabBarIcon';
import SignUp from './src/screens/SignUp';
import Login from './src/screens/Login';
import AddBedSheet from './src/screens/AddBedSheet';
import AllBedSheets from './src/screens/AllBedSheets';
import ViewProfile from './src/screens/ViewProfile';
import ApproveUser from './src/screens/ApproveUser';
import ApprovePost from './src/screens/ApprovePost';
import ContactUs from './src/screens/ContactUs';
import PrivacyPolicy from './src/screens/PrivacyPolicy';
import config from './src/config';
console.disableYellowBox = true;




export default class App extends Component {
  state = {
    currentUser: null,
    admin: "false",
    firstVisit: null
  };
  logOut = async () => {
    await AsyncStorage.clear().then(d => {
      AsyncStorage.setItem('firstVisit', 'no');
      this.setState({
        currentUser: null,
        admin: "false",
        firstVisit: "no"
      });
    });
  };
  navigator = createBottomTabNavigator(
    {
      Feed: {
        screen: AllBedSheets,
        navigationOptions: {
          tabBarIcon: tabBarIcon('home'),
        },
      },
      Profile: {
        screen: ViewProfile,
        navigationOptions: {
          tabBarIcon: tabBarIcon('account-circle'),
        },
      },
      NewPost: {
        screen: AddBedSheet,
        navigationOptions: {
          tabBarIcon: tabBarIcon('add-circle'),
        },
      },
    },
    {
      tabBarOptions: {
        showLabel: true,
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      },
    },
  );
  navigatorAdm = createBottomTabNavigator(
    {
      Feed: {
        screen: AllBedSheets,
        navigationOptions: {
          tabBarIcon: tabBarIcon('home'),
        },
      },
      Profile: {
        screen: ViewProfile,
        navigationOptions: {
          tabBarIcon: tabBarIcon('account-circle'),
        },
      },
      NewPost: {
        screen: AddBedSheet,
        navigationOptions: {
          tabBarIcon: tabBarIcon('add-circle'),
        },
      },
      Users: {
        screen: ApproveUser,
        navigationOptions: {
          tabBarIcon: tabBarIcon('account-circle'),
        },
      },
      Posts: {
        screen: ApprovePost,
        navigationOptions: {
          tabBarIcon: tabBarIcon('check-circle'),
        },
      },
    },
    {
      tabBarOptions: {
        showLabel: true,
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      },
    },
  );
  navigator2 = createBottomTabNavigator(
    {
      Feed: {
        screen: AllBedSheets,
        navigationOptions: {
          tabBarIcon: tabBarIcon('home'),
        },
      },
      Login: {
        screen: Login,
        navigationOptions: {
          tabBarIcon: tabBarIcon('account-circle'),
        },
      },
      SignUp: {
        screen: SignUp,
        navigationOptions: {
          tabBarIcon: tabBarIcon('account-circle'),
        },
      },
      ContactUs: {
        screen: ContactUs,
        navigationOptions: {
          tabBarIcon: tabBarIcon('contact-phone'),
        },
      },
    },
    {
      tabBarOptions: {
        showLabel: true,
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      },
    },
  );
  AppNavigator = (load) => {
    return createStackNavigator({
      Main: {
        screen: this.navigator,
        navigationOptions: {
          title: '',
          headerRight: () => <Button title="logout" color='#DA2D38' onPress={this.logOut} />,
          // headerBackground:() => (
          //   <Image
          //     // style={{height:'100%'}}
          //     source={require('./assets/banner.jpg')}
          //     // source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg' }}
          //   />
          // ),
          headerLeft: () => <Image source={require('./assets/banner.jpg')} style={{ marginLeft: 5 }} />,
          headerStyle: {
            backgroundColor: 'black'
          },
        },
      },
      MainAdm: {
        screen: this.navigatorAdm,
        navigationOptions: {
          title: '',
          headerRight: () => <Button title="logout" color='#DA2D38' onPress={this.logOut} />,
          headerLeft: () => <Image source={require('./assets/banner.jpg')} style={{ marginLeft: 5 }} />,
          headerStyle: {
            backgroundColor: 'black'
          },
        },
      },
      MainT: {
        screen: this.navigator2,
        navigationOptions: {
          title: '',
          headerLeft: () => <Image source={require('./assets/banner.jpg')} style={{ marginLeft: 5 }} />,
          headerStyle: {
            backgroundColor: 'black'
          },
        },
      },
      Store: {
        screen: ViewProfile,
        navigationOptions: {
          title: '',
          headerBackImage: () => <Image source={require('./assets/banner.jpg')} />,
          headerStyle: {
            backgroundColor: 'black'
          },
        },
      },
      PrivacyPolicy: {
        screen: PrivacyPolicy,
        navigationOptions: {
          title: '',
          headerLeft: () => <Image source={require('./assets/banner.jpg')} style={{ marginLeft: 5 }} />,
          headerStyle: {
            backgroundColor: 'black'
          },
        },
      },
    },
      {
        initialRouteName: load
      }
    );
  }
  async componentDidMount() {
    this.setState({
      currentUser: await AsyncStorage.getItem('user'),
      firstVisit: await AsyncStorage.getItem('firstVisit'),
      admin: await AsyncStorage.getItem('admin')
    });
  }
  render() {
    if (this.state.firstVisit != "no") {
      const AppContainer = createAppContainer(this.AppNavigator("PrivacyPolicy"));
      return <AppContainer />;
    }
    else {
      if (this.state.currentUser == null) {
        const AppContainer = createAppContainer(this.AppNavigator("MainT"));
        return <AppContainer />;
      }
      else {
        if (this.state.admin == 'true') {
          const AppContainer = createAppContainer(this.AppNavigator("MainAdm"));
          return <AppContainer />;
        }
        else {
          var docRef = config.shared.fireS.collection("user-info").doc(this.state.currentUser);
          docRef.get().then(doc => {
            if (doc.exists) {
              if (!doc.data().approved) {
                this.logOut();
                Alert.alert("You have been unapproved by the Admin");
                const AppContainer = createAppContainer(this.AppNavigator("MainT"));
                return <AppContainer />;
              }
            }
            else {
              this.logOut();
              Alert.alert("You account has been removed by the Admin");
              const AppContainer = createAppContainer(this.AppNavigator("MainT"));
              return <AppContainer />;
            }
          });
          const AppContainer = createAppContainer(this.AppNavigator("Main"));
          return <AppContainer />;
        }
      }
    }
  }
}
