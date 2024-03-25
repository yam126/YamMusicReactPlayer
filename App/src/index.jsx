import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/NoAuth/Login';
import RegisterScreen from './screens/NoAuth/Register';
import SplashScreen from './screens/Splash';
import NoAuthScreen from './screens/NoAuth/';
import PlayListScreen from './screens/PlayList';
import AlbumsEditScreen from './screens/Albums/Edit';
import UserProfileScreen from './screens/UserProfile';
import ScanFileScreen from './screens/ImportSong/ScanFile';
import UploaddFileScreen from './screens/ImportSong/UploadFile';
import SelectMethodScreen from './screens/ImportSong/SelectMethod';
import NetworkImportScreen from './screens/ImportSong/NetworkImport';
import SongListScreen from './screens/SongList';
import UserFaceScreen from './screens/UserFace';
import ShareMusicScreen from './screens/ShareMusic';
import CameraScannerScreen from './screens/CameraScanner/';
import AboutScreen from './screens/About';
import MainTabScreen from './routes';

const Stack = createStackNavigator();

export default class Index extends Component {
  render() {
    return (
      <Stack.Navigator
        headerShown={false}
        screenOptions={({route}) => ({
          headerShown: false,
        })}
        initialRouteName={'Splash'}>
        <Stack.Screen name="MainTab" component={MainTabScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registr" component={RegisterScreen} />
        <Stack.Screen name="NoAuth" component={NoAuthScreen} />
        <Stack.Screen name="PlayList" component={PlayListScreen} />
        <Stack.Screen name="SongList" component={SongListScreen} />
        <Stack.Screen name="AlbumsEdit" component={AlbumsEditScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="ScanFile" component={ScanFileScreen} />
        <Stack.Screen name="UploaddFile" component={UploaddFileScreen} />
        <Stack.Screen name="SelectMethod" component={SelectMethodScreen} />
        <Stack.Screen name="NetworkImport" component={NetworkImportScreen} />
        <Stack.Screen name="UserFace" component={UserFaceScreen} />
        <Stack.Screen name="ShareMusic" component={ShareMusicScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="CameraScanner" component={CameraScannerScreen} />
      </Stack.Navigator>
    );
  }
}
