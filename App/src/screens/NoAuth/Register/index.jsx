/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {host, Register} from '../../../utils/api';
import {generateRandomNumber} from '../../../utils';
import Loading from '../../../components/Loading';
import {CustomCachedImage} from 'react-native-img-cache';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

const globalStyles = {
  width: Dimensions.get('window').width - 53,
  height: Dimensions.get('window').height - 375,
};

let styleJson = {
  container: {
    width: globalStyles.width,
    height: globalStyles.height,
    borderColor: 'red',
    alignItems: 'center',
    borderWidth: 0,
  },
  checkCodeImageContainer: {
    width: Dimensions.get('window').width - 270,
    height: 110,
    //marginHorizontal: 107,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  checkCodeImageTitle: {
    width: Dimensions.get('window').width - 287,
    height: 26,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  checkCodeImageTitleText: {
    fontSize: 15,
    color: '#ccc',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  checkCodeImage: {
    marginVertical: 6,
    width: Dimensions.get('window').width - 301,
    height: 67,
    fontSize: 36,
    borderColor: 'red',
    borderWidth: 1,
  },
  inputViewBottom: {
    width: Dimensions.get('window').width - 53,
    height: 10,
  },
  inputView: {
    width: Dimensions.get('window').width - 53,
    height: 375,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
  },
  passWordContainer: {
    marginVertical: 27,
  },
  passWordText: {
    width: globalStyles.width - 125,
    height: 47,
    fontSize: 23,
    color: '#B4B4B4',
    marginVertical: 3,
    borderColor: 'red',
    borderWidth: 0,
  },
  userNameContainer: {
    marginVertical: 27,
  },
  userNameText: {
    width: globalStyles.width - 85,
    height: 47,
    fontSize: 23,
    color: '#B4B4B4',
    marginVertical: 3,
    borderColor: 'red',
    borderWidth: 0,
  },
  inputIcon: {
    marginVertical: 10,
    marginHorizontal: 10,
    iconSize: 37,
  },
  btnLogin: {
    width: globalStyles.width - 15,
    height: 53,
    marginVertical: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnLoginText: {
    fontSize: 31,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputContainer: {
    width: globalStyles.width - 15,
    height: 53,
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
  },
  inputLabelContainer: {
    width: globalStyles.width - 15,
    height: 23,
    marginVertical: -17,
    borderColor: 'red',
    borderWidth: 0,
  },
  inputLabelText: {
    fontSize: 13,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'left',
    textAlignVertical: 'center',
    marginHorizontal: 5,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.container.height = 235;
    styleJson.inputIcon.iconSize = 12;
    styleJson.userNameText.height = 35;
    styleJson.userNameText.fontSize = 12;
    styleJson.userNameText.marginVertical = 3;
    styleJson.passWordText.height = 35;
    styleJson.passWordText.fontSize = 12;
    styleJson.passWordText.marginVertical = 3;
    styleJson.passWordText.width =
      styleJson.inputContainer.width - styleJson.passWordText.fontSize - 50;
    styleJson.inputContainer.height = 33;
    styleJson.inputView.height = 215;
    styleJson.checkCodeImageContainer.width = styleJson.inputView.width - 10;
    styleJson.checkCodeImageTitle.width =
      styleJson.checkCodeImageContainer.width;
    styleJson.checkCodeImage.width = styleJson.checkCodeImageTitle.width;
    styleJson.btnLoginText.fontSize = 15;
    styleJson.btnLogin.height = 35;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.inputIcon.iconSize = 12;
    styleJson.userNameText.height = 35;
    styleJson.userNameText.fontSize = 12;
    styleJson.userNameText.marginVertical = 3;
    styleJson.passWordText.height = 35;
    styleJson.passWordText.fontSize = 12;
    styleJson.passWordText.marginVertical = 3;
    styleJson.passWordText.width =
      styleJson.inputContainer.width - styleJson.passWordText.fontSize - 50;
    styleJson.inputContainer.height = 33;
    styleJson.inputView.height =
      styleJson.container.height - styleJson.btnLogin.height + 21;
    styleJson.checkCodeImageContainer.width = styleJson.inputView.width - 10;
    styleJson.checkCodeImageTitle.width =
      styleJson.checkCodeImageContainer.width;
    styleJson.checkCodeImage.width = styleJson.checkCodeImageTitle.width;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.inputIcon.iconSize = 12;
    styleJson.userNameText.height = 35;
    styleJson.userNameText.fontSize = 12;
    styleJson.userNameText.marginVertical = 3;
    styleJson.passWordText.height = 35;
    styleJson.passWordText.fontSize = 12;
    styleJson.passWordText.marginVertical = 3;
    styleJson.passWordText.width =
      styleJson.inputContainer.width - styleJson.passWordText.fontSize - 50;
    styleJson.inputContainer.height = 33;
    styleJson.inputView.height =
      styleJson.container.height - styleJson.btnLogin.height + 21;
    styleJson.checkCodeImageContainer.width = styleJson.inputView.width - 10;
    styleJson.checkCodeImageTitle.width =
      styleJson.checkCodeImageContainer.width;
    styleJson.checkCodeImage.width = styleJson.checkCodeImageTitle.width;
  } else if (
    parseInt(screenWidth, 10) === 360 &&
    parseInt(screenHeight, 10) === 732
  ) {
    styleJson.inputIcon.iconSize = 12;
    styleJson.userNameText.height = 35;
    styleJson.userNameText.fontSize = 12;
    styleJson.userNameText.marginVertical = 3;
    styleJson.passWordText.height = 35;
    styleJson.passWordText.fontSize = 12;
    styleJson.passWordText.marginVertical = 3;
    styleJson.passWordText.width =
      styleJson.inputContainer.width - styleJson.passWordText.fontSize - 50;
    styleJson.inputContainer.height = 33;
    styleJson.inputView.height =
      styleJson.container.height - styleJson.btnLogin.height + 21;
    styleJson.checkCodeImageContainer.width = styleJson.inputView.width - 10;
    styleJson.checkCodeImageTitle.width =
      styleJson.checkCodeImageContainer.width;
    styleJson.checkCodeImage.width = styleJson.checkCodeImageTitle.width;
  }
  if (parseInt(screenWidth, 10) <= 411 && parseInt(screenHeight, 10) <= 842) {
    styleJson.checkCodeImageContainer.width = styleJson.inputView.width - 10;
    styleJson.checkCodeImageTitle.width =
      styleJson.checkCodeImageContainer.width;
    styleJson.checkCodeImage.width = styleJson.checkCodeImageTitle.width;
    styleJson.checkCodeImage.height = 127;
    styleJson.checkCodeImageContainer.height = 187;
    styleJson.checkCodeImage.fontSize = 43;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default function Registr(props) {
  let _loading = null;
  const {changePage} = props;
  const [data, setData] = React.useState({
    secureTextEntry: true,
    userName: '',
    userNameMsg: '',
    passWord: '',
    passWordMsg: '',
    repeatPassWord: '',
    repeatPassWordMsg: '',
    email: '',
    emailMsg: '',
    weChart: '',
    weChartMsg: '',
    checkCode: '',
    checkCodeMsg: '',
    secureTextEntryRepartPassword: true,
    showLoading: false,
    checkCodeImageUrl: '',
    checkCodeArgs: {
      CodeLength: 5,
      refreshNum: 5,
      Width: styleJson.checkCodeImage.width,
      Height: styleJson.checkCodeImage.height,
      FontSize: styleJson.checkCodeImage.fontSize,
    },
    userInfo: {
      userId: 0,
      userName: '',
      passWord: '',
      rePassWord: '',
      email: '',
      weChart: '',
      checkCode: '',
    },
  });
  React.useEffect(() => {
    let tempCheckCodeImageUrl = GetCheckCodeImage();
    console.log('tempCheckCodeImageUrl', tempCheckCodeImageUrl);
    setData({...data, checkCodeImageUrl: tempCheckCodeImageUrl});
    return () => {};
  }, []);
  const TouchRefreshCheckCode = () => {
    let RandomNumber = generateRandomNumber(5, 10);
    data.checkCodeArgs.refreshNum = RandomNumber;
    let checkCodeArgs = data.checkCodeArgs;
    let tempCheckCodeImageUrl = GetCheckCodeImage();
    console.log('tempCheckCodeImageUrl', tempCheckCodeImageUrl);
    setData({...data, checkCodeArgs, checkCodeImageUrl: tempCheckCodeImageUrl});
  };
  const GetCheckCodeImage = () => {
    let result = `${host}api/NoAuth/VerifyCode`;
    let Width = parseInt(styles.checkCodeImage.width, 10);
    let Height = styles.checkCodeImage.height;
    let FontSize = styleJson.checkCodeImage.fontSize;
    console.log('GetCheckCodeImage Width', Width);
    console.log('GetCheckCodeImage Height', Height);
    result += `?CodeLength=${data.checkCodeArgs.CodeLength}`;
    result += `&refreshNum=${
      data.checkCodeArgs.refreshNum + new Date().getUTCMilliseconds().toString()
    }`;
    result += `&Width=${Width}`;
    result += `&Height=${Height}`;
    result += `&FontSize=${FontSize}`;
    return result;
  };
  const updateSecureTextEnty = () => {
    if (data.secureTextEntry) {
      setData({...data, secureTextEntry: false});
    } else {
      setData({...data, secureTextEntry: true});
    }
  };
  const updateSecureRepartTextEntry = () => {
    if (data.secureTextEntryRepartPassword) {
      setData({...data, secureTextEntryRepartPassword: false});
    } else {
      setData({...data, secureTextEntryRepartPassword: true});
    }
  };
  const userNameChange = val => {
    setData({...data, userName: val});
  };
  const passWordChange = val => {
    setData({...data, passWord: val});
  };
  const repeatPassWordChange = val => {
    setData({...data, repeatPassWord: val});
  };
  const emailChange = val => {
    setData({...data, email: val});
  };
  const weChartChange = val => {
    setData({...data, weChart: val});
  };
  const checkCodeChange = val => {
    setData({...data, checkCode: val});
  };
  const btnLoginTouchClick = () => {
    let emailRegex = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$/;
    let emailRegex1 = /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/;
    if (data.userName === '') {
      setData({...data, userNameMsg: '请输入用户名'});
      return false;
    } else {
      setData({...data, userNameMsg: ''});
    }
    if (data.passWord === '') {
      setData({...data, passWordMsg: '请输入密码'});
      return false;
    } else {
      setData({...data, passWordMsg: ''});
    }
    if (data.repeatPassWord === '') {
      setData({...data, repeatPassWordMsg: '请再次输入密码'});
      return false;
    } else {
      setData({...data, repeatPassWordMsg: ''});
    }
    console.log('data.repeatPassWord', data.repeatPassWord);
    console.log('data.passWord', data.passWord);
    if (data.repeatPassWord !== data.passWord) {
      setData({
        ...data,
        repeatPassWordMsg: '两次输入的密码不一致',
        passWordMsg: '两次输入的密码不一致',
      });
      return false;
    }
    if (data.repeatPassWord === data.passWord) {
      console.log('repeatPassWord else');
      data.repeatPassWordMsg = '';
      data.passWordMsg = '';
      setData({...data, repeatPassWordMsg: '', passWordMsg: ''});
    }
    if (data.checkCode === '') {
      setData({...data, checkCodeMsg: '请输入验证码'});
      return false;
    } else {
      setData({...data, checkCodeMsg: ''});
    }
    if (data.email !== '') {
      if (!emailRegex.test(data.email) && emailRegex1.test(data.email)) {
        setData({...data, emailMsg: '电子邮件地址格式不正确'});
        return false;
      } else {
        setData({...data, emailMsg: ''});
      }
    }
    console.log('data.userName', data.userName);
    _loading.showLoading();
    const hideLoading = _loading.hideLoading;
    let timer = setInterval(() => {
      clearInterval(timer);
      hideLoading();
      ApiRegister();
    }, 3000);
  };
  const ApiRegister = () => {
    Register({
      dataObj: {
        userId: 0,
        userName: data.userName,
        passWord: data.passWord,
        rePassWord: data.repeatPassWord,
        email: data.email,
        weChart: data.weChart,
        checkCode: data.checkCode,
      },
      beforeCallBack: () => {
        setData({...data, showLoading: true});
      },
      responseCallBack: res => {
        res.then(resData => {
          console.log('response data', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            if (resData.status !== 0) {
              Alert.alert('错误', `注册失败,原因[${resData.msg}]`);
            } else {
              Alert.alert('成功', '注册成功,请登录', [
                {
                  text: 'OK',
                  onPress: () => {
                    changePage('Login');
                  },
                },
              ]);
            }
          }
        });
        setData({...data, showLoading: false});
      },
      errorCallback: error => {
        console.log('error', error);
        setData({...data, showLoading: false});
      },
    });
  };
  return (
    <View style={styles.container}>
      <Loading
        ref={ref => (_loading = ref)}
        Width={globalStyles.width}
        Height={globalStyles.height}
        Visibility={data.showLoading}
      />
      <View style={styles.inputView}>
        <ScrollView nestedScrollEnabled={true}>
          {/*用户名B*/}
          <View style={[styles.inputContainer, styles.userNameContainer]}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name="person"
              size={styleJson.inputIcon.iconSize}
            />
            <TextInput
              placeholder="请输入用户名"
              placeholderTextColor={'red'}
              style={styles.userNameText}
              onChangeText={val => userNameChange(val)}
            />
          </View>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabelText}>{data.userNameMsg}</Text>
          </View>
          {/*用户名E*/}
          {/*密码B*/}
          <View style={[styles.inputContainer, styles.passWordContainer]}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name="lock-closed"
              size={styleJson.inputIcon.iconSize}
            />
            <TextInput
              secureTextEntry={data.secureTextEntry}
              placeholder="请输入密码"
              placeholderTextColor={'red'}
              style={styles.passWordText}
              onChangeText={val => passWordChange(val)}
            />
            <TouchableOpacity
              onPress={() => {
                updateSecureTextEnty();
              }}>
              <Icon
                style={styles.inputIcon}
                color="#B4B4B4"
                name={data.secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                size={styleJson.inputIcon.iconSize}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabelText}>{data.passWordMsg}</Text>
          </View>
          {/*密码E*/}
          {/*再次输入密码B*/}
          <View style={[styles.inputContainer, styles.passWordContainer]}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name="lock-closed"
              size={styleJson.inputIcon.iconSize}
            />
            <TextInput
              secureTextEntry={data.secureTextEntryRepartPassword}
              placeholder="请再次输入密码"
              placeholderTextColor={'red'}
              style={styles.passWordText}
              onChangeText={val => repeatPassWordChange(val)}
            />
            <TouchableOpacity
              onPress={() => {
                updateSecureRepartTextEntry();
              }}>
              <Icon
                style={styles.inputIcon}
                color="#B4B4B4"
                name={
                  data.secureTextEntryRepartPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={styleJson.inputIcon.iconSize}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabelText}>{data.repeatPassWordMsg}</Text>
          </View>
          {/*再次输入密码E*/}
          {/*电子邮件地址B*/}
          <View style={[styles.inputContainer, styles.userNameContainer]}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name="mail"
              size={styleJson.inputIcon.iconSize}
            />
            <TextInput
              placeholder="请输入电子邮件"
              style={styles.userNameText}
              onChangeText={val => emailChange(val)}
            />
          </View>
          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabelText}>{data.emailMsg}</Text>
          </View>
          {/*电子邮件地址E*/}
          {/*微信号B*/}
          <View
            style={[
              styles.inputContainer,
              styles.userNameContainer,
              {marginVertical: -9},
            ]}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name="logo-wechat"
              size={styleJson.inputIcon.iconSize}
            />
            <TextInput
              placeholder="请输入微信号"
              style={styles.userNameText}
              onChangeText={val => weChartChange(val)}
            />
          </View>
          {/*微信号E*/}
          {/*验证码B*/}
          <View
            style={[
              styles.inputContainer,
              styles.userNameContainer,
              {marginVertical: 17},
            ]}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name="bag-check"
              size={styleJson.inputIcon.iconSize}
            />
            <TextInput
              placeholderTextColor={'red'}
              placeholder="请输入验证码"
              style={styles.userNameText}
              onChangeText={val => checkCodeChange(val)}
            />
          </View>
          <View style={[styles.inputLabelContainer, {marginVertical: 3}]}>
            <Text style={styles.inputLabelText}>{data.checkCodeMsg}</Text>
          </View>
          {/*验证码E*/}
          <View style={styles.checkCodeImageContainer}>
            <View style={styles.checkCodeImageTitle}>
              <Text style={styles.checkCodeImageTitleText}>点击刷新验证码</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                TouchRefreshCheckCode();
              }}>
              {/*<Image
                style={styles.checkCodeImage}
                source={{
                  uri: data.checkCodeImageUrl,
                }}
              />*/}
              <CustomCachedImage
                component={Image}
                source={{
                  uri: data.checkCodeImageUrl,
                }}
                indicator={ProgressBar}
                style={styles.checkCodeImage}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.inputLabelContainer, {marginVertical: 3}]}>
            <Text style={[styles.inputLabelText, {textAlign: 'center'}]}>
              红字为必填项
            </Text>
          </View>
          <View style={[styles.inputViewBottom]} />
        </ScrollView>
      </View>
      <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.btnLogin}>
        <TouchableOpacity
          onPress={() => {
            btnLoginTouchClick();
          }}>
          <Text style={styles.btnLoginText}>注册账号</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
