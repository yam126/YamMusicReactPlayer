/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {editSignature, GetUserInfoById} from '../../../utils/api';
import {useDispatch} from 'react-redux';
import {uploadUser} from '../../../redux/features/User/userSlice';
import Storage from '../../../utils/storage';
import MiniLoading from '../../../components/MiniLoading';

let styleJson = {
  container: {
    width: Dimensions.get('window').width - 36,
    height: 486,
    //backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    borderColor: 'red',
    borderWidth: 0,
  },
  signatureTextContainer: {
    width: Dimensions.get('window').width - 39,
    height: 396,
    marginVertical: 7,
    textAlign: 'left',
    fontSize: 21,
    color: 'black',
    textAlignVertical: 'top',
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
  },
  saveButton: {
    width: Dimensions.get('window').width - 39,
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
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.signatureTextContainer.height = 57;
    styleJson.signatureTextContainer.fontSize = 12;
    styleJson.container.height = screenHeight - 307;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 335;
    styleJson.signatureTextContainer.height = 187;
  } else if (
    parseInt(screenWidth, 10) === 360 &&
    parseInt(screenHeight, 10) === 732
  ) {
    console.log('360x732');
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 325;
    styleJson.signatureTextContainer.height = 305;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 325;
    styleJson.signatureTextContainer.height = 205;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 335;
    styleJson.signatureTextContainer.height = 357;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 335;
    styleJson.signatureTextContainer.height = 357;
  }

  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default function Index(props) {
  const [data, setData] = React.useState({
    signature: '',
    isLoadComplete: false,
    userInfo: null,
  });
  const readSignature = UserId => {
    GetUserInfoById({
      parm: {
        UserId: UserId,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          const {status, msg, result} = resData;
          let signature = '';
          if (status !== 0) {
            Alert.alert('错误', `读取用户信息出错,原因[${msg}]`);
          } else {
            signature = result.signature;
          }
          setData({
            ...data,
            signature: signature,
            isLoadComplete: true,
          });
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `保存出错,原因[${error}]`);
      },
    });
  };
  React.useEffect(() => {
    readSignature(props.UserId);
  }, []);
  const dispatch = useDispatch(); //获得调用redux中自定义方法的钩子
  const updateLocalUser = userInfoData => {
    let vUserInfo = {payload: userInfoData};
    dispatch(uploadUser(vUserInfo.payload));
    Storage.delete('userInfo', vUserInfo).then(() => {
      console.log('updateLocalUserFace props', props);
      Storage.set('userInfo', vUserInfo);
    });
  };
  const onChangeTextSignature = value => {
    setData({...data, signature: value});
  };
  const saveData = () => {
    if (data.signature === '') {
      Alert.alert('错误', '签名为空不能保存');
      return false;
    }
    let userInfo = props.userInfo;
    console.log('Storage userInfo', userInfo);
    if (userInfo === null || typeof userInfo === 'undefined') {
      Alert.alert('错误', '没有登录不能保存');
    } else {
      editSignature({
        parm: {
          userId: userInfo.userId,
          password: userInfo.passWord,
          signature: data.signature,
        },
        beforeCallBack: () => {},
        responseCallBack: res => {
          res.then(resData => {
            const {status, msg} = resData;
            if (status !== 0) {
              Alert.alert('错误', `编辑签名出错,原因[${msg}]`);
            } else {
              Alert.alert('成功', '保存成功');
              userInfo.signature = data.signature;
              updateLocalUser(userInfo);
            }
          });
        },
        errorCallback: error => {
          Alert.alert('错误', `保存出错,原因[${error}]`);
        },
      });
    }
  };
  let containerWidth = styleJson.signatureTextContainer.width;
  let containerHeight = styleJson.signatureTextContainer.height;
  let loadingSize = 37;
  return (
    <View style={styles.container}>
      {!data.isLoadComplete ? (
        <MiniLoading
          Width={containerWidth}
          Height={containerHeight}
          Size={loadingSize}
        />
      ) : (
        <TextInput
          multiline={true}
          numberOfLines={30}
          placeholder="请输入签名"
          value={data.signature}
          style={styles.signatureTextContainer}
          onChangeText={val => onChangeTextSignature(val)}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          saveData();
        }}>
        <LinearGradient
          colors={['#08d4c4', '#01ab9d']}
          style={styles.saveButton}>
          <Text style={styles.saveButtonText}>保存签名</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
