import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Index from './src';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/redux/store';

export default class App extends Component {
  render() {
    return (
      <StoreProvider store={store}>
        <NavigationContainer>
          <MenuProvider>
            <Index />
          </MenuProvider>
        </NavigationContainer>
      </StoreProvider>
    );
  }
}
