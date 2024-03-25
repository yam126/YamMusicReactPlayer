import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import {login, logout} from '../../redux/features/User/userSlice';
import {useDispatch} from 'react-redux';
import Storage from '../../utils/storage';
import {CheckLogin} from '../../utils/api';

//页面样式
let styleJson = {
  container: {
    flex: 1,
    //flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    width: Dimensions.get('window').width,
    height: 35,
    marginVertical: 5,
    borderColor: 'red',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 280,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: Dimensions.get('window').width,
    height: 210,
    marginVertical: 210,
    borderColor: 'red',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 210,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpButtonContainer: {
    width: 95,
    height: 50,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#ccc',
    opacity: 0.5,
    borderRadius: 10,
  },
  jumpButtonText: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
};

//自适应分辨率调整
function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  ////console.log('resizeMode screenWidth', screenWidth);
  ////console.log('resizeMode screenHeight', screenHeight);
  if (screenWidth === 360 && screenHeight === 592) {
    //console.log('resizeMode splash screenWidth', screenWidth);
    //console.log('resizeMode splash screenHeight', screenHeight);
    styleJson.logo.width = 175;
    styleJson.logo.height = 175;
    styleJson.logoContainer.marginVertical = 26;
    styleJson.titleContainer.marginVertical = -335;
    styleJson.jumpButtonContainer.width = 75;
    styleJson.jumpButtonContainer.height = 39;
    styleJson.jumpButtonText.fontSize = 14;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    //console.log('resizeMode screenWidth', screenWidth);
    //console.log('resizeMode screenHeight', screenHeight);
    styleJson.logo.width = 175;
    styleJson.logo.height = 175;
    styleJson.logoContainer.marginVertical = 90;
    styleJson.jumpButtonContainer.width = 75;
    styleJson.jumpButtonContainer.height = 39;
    styleJson.titleContainer.marginVertical = 110;
    styleJson.jumpButtonText.fontSize = 14;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default function Splash({navigation}) {
  const [data, setData] = React.useState({second: 5});
  const dispatch = useDispatch(); //获得调用redux中自定义方法的钩子
  const checkLoginState = () => {
    Storage.get('userInfo').then(userInfo => {
      //console.log(' checkLoginState userInfo', userInfo);
      if (
        userInfo.payload !== null &&
        typeof userInfo.payload !== 'undefined'
      ) {
        let parm = {
          userId: userInfo.payload.userId,
          userName: userInfo.payload.userName,
          token: userInfo.payload.token,
        };
        CheckLogin({
          userInfo: parm,
          beforeCallBack: null,
          responseCallBack: res => {
            res.then(resData => {
              //console.log('CheckLogin response data', resData);
              if (resData !== null && typeof resData !== 'undefined') {
                //console.log('CheckLogin response data', resData);
                const {status, result, msg} = resData;
                if (status !== 0) {
                  Alert.alert('错误', `检查登录状态出错,原因[${msg}]`);
                } else {
                  //console.log('CheckLogin response result', result);
                  if (!result) {
                    dispatch(logout());
                  } else {
                    dispatch(login(userInfo.payload));
                  }
                }
              }
            });
          },
          errorCallback: error => {},
        });
      }
    });
  };
  React.useEffect(() => {
    let timer = setInterval(() => {
      //console.log('data.second', data.second);
      //let deviceId = DeviceInfo.getDeviceId();
      //console.log('deviceId', deviceId);
      if (data.second >= 0) {
        setData({second: data.second - 1});
      } else {
        clearInterval(timer);
        checkLoginState();
        navigation.navigate('MainTab');
      }
    }, 1000);
    return () => {
      //checkLoginState();
      clearInterval(timer);
    };
  });
  const gotoPage = () => {
    checkLoginState();
    navigation.navigate('MainTab');
  };
  return (
    <View style={[styles.container]}>
      <ImageBackground
        source={require('../../images/SplashBackGround.jpg')}
        style={styles.bgImage}>
        <View style={styles.jumpButtonContainer}>
          <TouchableOpacity onPress={gotoPage}>
            <Text style={styles.jumpButtonText}>
              跳过{data.second >= 0 ? data.second : 0}
            </Text>
          </TouchableOpacity>
        </View>
        <Animatable.View animation={'fadeInDown'} style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../images/Logo.png')}
          />
        </Animatable.View>
        <Animatable.View animation={'fadeInDown'} style={styles.titleContainer}>
          <Image
            style={styles.title}
            source={require('../../images/SplashTitle.png')}
          />
        </Animatable.View>
      </ImageBackground>
    </View>
  );
}
