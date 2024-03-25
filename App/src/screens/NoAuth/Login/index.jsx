import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {login} from '../../../redux/features/User/userSlice';
import Loading from '../../../components/Loading';
import {host, Login as ApiLogin} from '../../../utils/api';
import DeviceInfo from 'react-native-device-info';

export default function Login({navigation}) {
  let _loading = null;
  const [data, setData] = React.useState({
    secureTextEntry: true,
    userName: '',
    userNameMsg: '',
    passWord: '',
    passWordMsg: '',
    showLoading: false,
  });
  const dispatch = useDispatch(); //获得调用redux中自定义方法的钩子
  const updateSecureTextEnty = () => {
    if (data.secureTextEntry) {
      setData({...data, secureTextEntry: false});
    } else {
      setData({...data, secureTextEntry: true});
    }
  };
  const userNameChange = val => {
    console.log('userNameChange', val);
    setData({...data, userName: val});
  };
  const passWordChange = val => {
    console.log('passWordChange', val);
    setData({...data, passWord: val});
  };
  const btnLoginTouch = () => {
    if (data.userName === '') {
      setData({userNameMsg: '用户名不能为空'});
      return false;
    } else {
      setData({userNameMsg: ''});
    }
    if (data.passWord === '') {
      setData({passWordMsg: '密码不能为空'});
      return false;
    } else {
      setData({passWordMsg: ''});
    }
    console.log('data.userName', data.userName);
    console.log('data.passWord', data.passWord);
    _loading.showLoading();
    const hideLoading = _loading.hideLoading;
    let timer = setInterval(() => {
      clearInterval(timer);
      hideLoading();
      submitLogin();
    }, 3000);
  };
  const submitLogin = () => {
    let deviceId = DeviceInfo.getDeviceId();
    console.log('data.userName', data.userName);
    ApiLogin({
      parm: {
        username: data.userName,
        password: data.passWord,
        deviceId: deviceId,
        deviceType: 3,
      },
      beforeCallBack: () => {
        setData({...data, showLoading: true});
      },
      responseCallBack: res => {
        res.then(resData => {
          console.log('response data', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            if (resData.status !== 0) {
              Alert.alert('错误', `登录失败,原因[${resData.msg}]`);
            } else {
              Alert.alert('成功', '登录成功', [
                {
                  text: 'OK',
                  onPress: () => {
                    //TODO:登录成功后的
                    let localUserInfo = {
                      userId: resData.result.userId,
                      userName: data.userName,
                      passWord: data.passWord,
                      token: resData.result.token,
                      userFace: resData.result.userFace,
                    };
                    dispatch(login(localUserInfo));
                    navigation.goBack();
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
      {/*用户名B*/}
      <View style={[styles.inputContainer, styles.userNameContainer]}>
        <Icon
          style={styles.inputIcon}
          color="#B4B4B4"
          name="person"
          size={37}
        />
        <TextInput
          placeholder="请输入用户名"
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
          size={37}
        />
        <TextInput
          secureTextEntry={data.secureTextEntry}
          placeholder="请输入密码"
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
            size={37}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputLabelContainer}>
        <Text style={styles.inputLabelText}>{data.passWordMsg}</Text>
      </View>
      {/*密码E*/}
      <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.btnLogin}>
        <TouchableOpacity onPress={() => btnLoginTouch()}>
          <Text style={styles.btnLoginText}>登录账号</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const globalStyles = {
  width: Dimensions.get('window').width - 53,
  height: Dimensions.get('window').height - 375,
};

const styles = StyleSheet.create({
  container: {
    width: globalStyles.width,
    height: globalStyles.height,
    borderColor: 'red',
    alignItems: 'center',
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
});
