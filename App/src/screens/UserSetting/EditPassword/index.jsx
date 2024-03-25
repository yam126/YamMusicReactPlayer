import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {EditPassword} from '../../../utils/api';
import Storage from '../../../utils/storage';
import {useDispatch} from 'react-redux';
import {uploadUser} from '../../../redux/features/User/userSlice';

export default function Index(props) {
  const [data, setData] = React.useState({
    secureSourceTextEntry: true,
    secureNewTextEntry: true,
    secureNewTextEntryRepartPassword: true,
    sourcePassword: '',
    newPassword: '',
    repartPassword: '',
  });
  const changeSourcePassword = value => {
    setData({...data, sourcePassword: value});
  };
  const changeNewPassword = value => {
    setData({...data, newPassword: value});
  };
  const changeRepartPassword = value => {
    setData({...data, repartPassword: value});
  };
  const updateSourceTextEnty = () => {
    if (data.secureSourceTextEntry) {
      setData({...data, secureSourceTextEntry: false});
    } else {
      setData({...data, secureSourceTextEntry: true});
    }
  };
  const updateNewTextEnty = () => {
    if (data.secureNewTextEntry) {
      setData({...data, secureNewTextEntry: false});
    } else {
      setData({...data, secureNewTextEntry: true});
    }
  };
  const updateRepartTextEnty = () => {
    if (data.secureNewTextEntryRepartPassword) {
      setData({...data, secureNewTextEntryRepartPassword: false});
    } else {
      setData({...data, secureNewTextEntryRepartPassword: true});
    }
  };
  const dispatch = useDispatch(); //获得调用redux中自定义方法的钩子
  const updateLocalUserFace = userInfoData => {
    let vUserInfo = {payload: userInfoData};
    dispatch(uploadUser(vUserInfo.payload));
    Storage.delete('userInfo', vUserInfo).then(() => {
      console.log('updateLocalUserFace props', props);
      Storage.set('userInfo', vUserInfo);
    });
  };
  const gotoPage = (PageName, args) => {
    console.log('gotoPage props', props);
    console.log('gotoPage PageName', PageName);
    props.navigation.navigate(PageName, args);
  };
  const saveData = () => {
    let sourcePassword = data.sourcePassword;
    let newPassword = data.newPassword;
    let repartPassword = data.repartPassword;
    if (sourcePassword === '') {
      Alert.alert('错误', '原密码不能为空');
      return false;
    }
    if (newPassword === '') {
      Alert.alert('错误', '新密码不能为空');
      return false;
    }
    if (repartPassword === '') {
      Alert.alert('错误', '重复密码不能为空');
      return false;
    }
    if (newPassword !== repartPassword) {
      Alert.alert('错误', '两次输入的密码不能为空');
      return false;
    }
    Storage.get('userInfo').then(userInfo => {
      let userObj = null;
      if (
        userInfo.payload === null &&
        typeof userInfo.payload === 'undefined'
      ) {
        Alert.alert('错误', '没有登录不能修改');
        return false;
      }
      userObj = userInfo.payload;
      EditPassword({
        parm: {
          userId: userObj.userId,
          sourcePassword: sourcePassword,
          newPassword: newPassword,
          repartPassword: repartPassword,
        },
        beforeCallBack: () => {},
        responseCallBack: res => {
          res.then(resData => {
            const {status, msg} = resData;
            if (status === 0) {
              Alert.alert('成功', '修改密码成功\n请重新登录');
              userObj.passWord = newPassword;
              updateLocalUserFace(userObj);
              gotoPage('NoAuth', null);
            } else {
              Alert.alert('错误', `修改密码失败,原因[${msg}]`);
            }
          });
        },
        errorCallback: error => {
          Alert.alert('错误', `保存出错,原因[${error}]`);
        },
      });
    });
  };
  let ParentWidth = props.ParentWidth;
  let ParentHeight = props.ParentHeight;
  let iconSize = 25;
  return (
    <View
      style={[styles.container, {width: ParentWidth, height: ParentHeight}]}>
      <ScrollView>
        {/*原密码B*/}
        <View style={[styles.inputContainer, {width: ParentWidth - 10}]}>
          <Icon
            style={styles.inputIcon}
            color="#B4B4B4"
            name="lock-closed"
            size={iconSize}
          />
          <TextInput
            secureTextEntry={data.secureSourceTextEntry}
            placeholder="请输入原密码"
            placeholderTextColor={'red'}
            style={[
              styles.passWordText,
              {width: ParentWidth - (10 + iconSize + iconSize) - 43},
            ]}
            onChangeText={val => changeSourcePassword(val)}
          />
          <TouchableOpacity
            onPress={() => {
              updateSourceTextEnty();
            }}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name={
                data.secureSourceTextEntry ? 'eye-off-outline' : 'eye-outline'
              }
              size={iconSize}
            />
          </TouchableOpacity>
        </View>
        {/*原密码E*/}
        {/*新密码B*/}
        <View style={[styles.inputContainer, {width: ParentWidth - 10}]}>
          <Icon
            style={styles.inputIcon}
            color="#B4B4B4"
            name="lock-closed"
            size={iconSize}
          />
          <TextInput
            secureTextEntry={data.secureNewTextEntry}
            placeholder="请输入新密码"
            placeholderTextColor={'red'}
            style={[
              styles.passWordText,
              {width: ParentWidth - (10 + iconSize + iconSize) - 43},
            ]}
            onChangeText={val => changeNewPassword(val)}
          />
          <TouchableOpacity
            onPress={() => {
              updateNewTextEnty();
            }}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name={data.secureNewTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={iconSize}
            />
          </TouchableOpacity>
        </View>
        {/*新密码E*/}
        {/*再次输入新密码B*/}
        <View style={[styles.inputContainer, {width: ParentWidth - 10}]}>
          <Icon
            style={styles.inputIcon}
            color="#B4B4B4"
            name="lock-closed"
            size={iconSize}
          />
          <TextInput
            secureTextEntry={data.secureNewTextEntryRepartPassword}
            placeholder="请再次输入新密码"
            placeholderTextColor={'red'}
            style={[
              styles.passWordText,
              {width: ParentWidth - (10 + iconSize + iconSize) - 43},
            ]}
            onChangeText={val => changeRepartPassword(val)}
          />
          <TouchableOpacity
            onPress={() => {
              updateRepartTextEnty();
            }}>
            <Icon
              style={styles.inputIcon}
              color="#B4B4B4"
              name={
                data.secureNewTextEntryRepartPassword
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={iconSize}
            />
          </TouchableOpacity>
        </View>
        {/*再次输入新密码E*/}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          saveData();
        }}>
        <LinearGradient
          colors={['#08d4c4', '#01ab9d']}
          style={[styles.saveButton, {width: ParentWidth - 10}]}>
          <Text style={styles.saveButtonText}>修改密码</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
  },
  inputContainer: {
    height: 63,
    flexDirection: 'row',
    marginVertical: 17,
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    iconSize: 65,
  },
  inputIcon: {
    marginVertical: 13,
    marginHorizontal: 10,
  },
  passWordText: {
    height: 45,
    fontSize: 15,
    color: '#B4B4B4',
    marginVertical: 5,
    borderColor: 'red',
    borderWidth: 0,
  },
  saveButton: {
    height: 39,
    marginVertical: 3,
    borderRadius: 15,
  },
  saveButtonText: {
    fontSize: 23,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
