/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/Home';
import MusicListScreen from '../screens/MusicList';
import PlayScreen from '../screens/PlayPage';
import AlbumsScreen from '../screens/Albums';
import UserSetting from '../screens/UserSetting';

const Tab = createBottomTabNavigator();
export default class Index extends Component {
  render() {
    console.log('this.props', this.props);
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = '';
            //console.log('route.name', route.name);
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'MusicList':
                iconName = focused
                  ? 'playlist-music'
                  : 'playlist-music-outline';
                return (
                  <MaterialIcon name={iconName} size={size} color={color} />
                );
              case 'PlayPage':
                iconName = focused ? 'play-circle' : 'play-circle-outline';
                return (
                  <MaterialIcon name={iconName} size={size} color={color} />
                );
              case 'Albums':
                iconName = focused ? 'albums' : 'albums-outline';
                break;
              case 'UserSetting':
                iconName = focused ? 'account-cog' : 'account-cog';
                return (
                  <MaterialIcon name={iconName} size={size} color={color} />
                );
            }
            console.log('iconName', iconName);
            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          options={{title: '首页'}}
          component={HomeScreen}
        />
        <Tab.Screen
          name="MusicList"
          options={{title: '音乐列表'}}
          component={MusicListScreen}
        />
        <Tab.Screen
          name="PlayPage"
          options={{title: '音乐播放'}}
          component={PlayScreen}
        />
        <Tab.Screen
          name="Albums"
          options={{title: '专辑分类'}}
          component={AlbumsScreen}
        />
        <Tab.Screen
          name="UserSetting"
          options={{title: '用户设置'}}
          component={UserSetting}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({});
