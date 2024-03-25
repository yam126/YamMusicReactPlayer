/* eslint-disable no-sparse-arrays */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useReducer} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import Login from './Login';
import Register from './Register';

let styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
  },
  tabContent: {
    width: Dimensions.get('window').width - 35,
    height: 512,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'red',
    borderWidth: 0,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  tabContentCenter: {
    width: Dimensions.get('window').width - 45,
    height: 476,
    borderColor: 'red',
    borderWidth: 0,
  },
  tabLeft: {left: 0},
  tabRight: {
    left: (Dimensions.get('window').width - 34) / 2,
  },
  tabContainer: {
    width: Dimensions.get('window').width - 35,
    height: 77,
    borderBottomColor: '#fff',
    borderBottomWidth: 3,
    flexDirection: 'row',
  },
  tabBackGround: {
    width: Dimensions.get('window').width - 35,
    height: 65,
    position: 'absolute',
    backgroundColor: '#F5F6F8',
    zIndex: -1,
    top: 10,
    left: 0,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  tabActiveItem: {
    width: (Dimensions.get('window').width - 33) / 2,
    height: 76,
    position: 'absolute',
    zIndex: 7,
    top: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  tabActiveItemText: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    //marginVertical: 21,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  tabNormalItem: {
    width: (Dimensions.get('window').width - 35) / 2,
    height: 65,
    position: 'absolute',
    zIndex: 5,
    top: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  tabNormalItemText: {
    fontSize: 19,
    color: '#8E8E8E',
    //marginVertical: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  logoContainer: {
    width: Dimensions.get('window').width,
    height: 107,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
  },
  logo: {
    width: 356,
    height: 95,
    resizeMode: 'stretch',
    //resizeMode: 'cover',
  },
  appBar: {
    width: Dimensions.get('window').width,
    height: 51,
    flexDirection: 'row',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
  },
  appBarTitleContainer: {
    width: Dimensions.get('window').width - 32,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  appBarTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.tabContent.marginVertical = -17;
    styleJson.logo.width = screenWidth - 20;
    styleJson.logo.height = 77;
    styleJson.container.height = 521;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.logo.width = 256;
    styleJson.logo.height = 79;
    styleJson.logoContainer.height = 79;
    styleJson.tabActiveItem.height = 59;
    styleJson.tabActiveItemText.fontSize = 15;
    styleJson.tabNormalItem.height = 43;
    styleJson.tabNormalItemText.fontSize = 12;
    styleJson.tabBackGround.height = 55;
    styleJson.tabContent.marginVertical = -17;
    styleJson.tabContent.height = screenHeight - 275;
    styleJson.tabContentCenter.height = styleJson.tabContent.height - 20;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.logo.width = 256;
    styleJson.logo.height = 79;
    styleJson.logoContainer.height = 79;
    styleJson.tabActiveItem.height = 59;
    styleJson.tabActiveItemText.fontSize = 15;
    styleJson.tabNormalItem.height = 43;
    styleJson.tabNormalItemText.fontSize = 12;
    styleJson.tabBackGround.height = 55;
    styleJson.tabContent.marginVertical = -17;
    styleJson.tabContent.height = screenHeight - 275;
    styleJson.tabContentCenter.height = styleJson.tabContent.height - 20;
  } else if (
    parseInt(screenWidth, 10) === 360 &&
    parseInt(screenHeight, 10) === 732
  ) {
    styleJson.logo.width = 256;
    styleJson.logo.height = 79;
    styleJson.logoContainer.height = 79;
    styleJson.tabActiveItem.height = 59;
    styleJson.tabActiveItemText.fontSize = 15;
    styleJson.tabNormalItem.height = 43;
    styleJson.tabNormalItemText.fontSize = 12;
    styleJson.tabBackGround.height = 55;
    styleJson.tabContent.marginVertical = -17;
    styleJson.tabContent.height = screenHeight - 275;
    styleJson.tabContentCenter.height = styleJson.tabContent.height - 20;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

function GetTabPage({navigation, changePage, PageName}) {
  return (function () {
    console.log('GetTabPage PageName', PageName);
    switch (PageName) {
      case 'Login':
        return <Login navigation={navigation} changePage={changePage} />;
      case 'Register':
        return <Register navigation={navigation} changePage={changePage} />;
      default:
        return <Login navigation={navigation} changePage={changePage} />;
    }
  })();
}
export default function Index({navigation}) {
  const [data, setData] = React.useState({PageName: 'Login'});
  const changePage = argPageName => {
    console.log('changePage argPageName', argPageName);
    setData({PageName: argPageName});
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.container}
        source={require('../../images/LRBG.png')}>
        {/*appBar Begin*/}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              style={styles.forwardBack}
              name="chevron-back-outline"
              size={styleJson.forwardBack.iconSize}
              color={'#fff'}
            />
          </TouchableOpacity>
          <View style={styles.appBarTitleContainer}>
            <Text style={styles.appBarTitle}>登录或注册</Text>
          </View>
        </View>
        {/*appBar End*/}
        {/*logo Begin*/}
        <Animatable.View animation={'fadeInUp'} style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../images/LogoHorizontal.png')}
          />
        </Animatable.View>
        {/*logo End*/}
        <ScrollView>
          {/*tab Begin*/}
          <View style={styles.tabContainer}>
            <View style={styles.tabBackGround} />
            <TouchableOpacity onPress={() => changePage('Login')}>
              <View
                style={[
                  data.PageName === 'Login'
                    ? styles.tabActiveItem
                    : styles.tabNormalItem,
                  styles.tabLeft,
                ]}>
                <TouchableOpacity onPress={() => changePage('Login')}>
                  <Text
                    style={
                      data.PageName === 'Login'
                        ? styles.tabActiveItemText
                        : styles.tabNormalItemText
                    }>
                    登录账号
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changePage('Register')}>
              <View
                style={[
                  data.PageName === 'Register'
                    ? styles.tabActiveItem
                    : styles.tabNormalItem,
                  ,
                  styles.tabRight,
                ]}>
                <TouchableOpacity onPress={() => changePage('Register')}>
                  <Text
                    style={
                      data.PageName === 'Register'
                        ? styles.tabActiveItemText
                        : styles.tabNormalItemText
                    }>
                    注册账号
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
          {/*tab End*/}
          <View style={styles.tabContent}>
            <View style={styles.tabContentCenter}>
              <GetTabPage
                navigation={navigation}
                changePage={changePage}
                PageName={data.PageName}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
