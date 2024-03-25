/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import ListenHistory from '../../screens/UserSetting/ListenHistory';
import ShareHistory from '../../screens/UserSetting/ShareHistory';
import Friends from '../../screens/UserSetting/Friends';
import QRCode from '../../screens/UserSetting/QRCode';
import Signature from '../../screens/UserSetting/Signature';
import EditPassword from '../../screens/UserSetting/EditPassword';
import {useSelector} from 'react-redux';
import AlbumList from '../../screens/UserSetting/AlbumList';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import Storage from '../../utils/storage';
import {UploadUserFace} from '../../utils/api';
import {uploadUser} from '../../redux/features/User/userSlice';
import {useDispatch} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

/**
 * 页面标签切换函数
 * @param {参数} props
 * @returns
 */
function GetTabPage(props) {
  console.log('props.PageName', props.PageName);
  return (function () {
    switch (props.PageName) {
      case 'ListenHistory':
        return (
          <ListenHistory
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            navigation={props.navigation}
            UserId={props.userId}
          />
        );
      case 'ShareHistory':
        return (
          <ShareHistory
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            navigation={props.navigation}
            UserId={props.userId}
          />
        );
      case 'AlbumList':
        return (
          <AlbumList
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            UserId={props.userId}
          />
        );
      case 'Friends':
        return (
          <Friends
            navigation={props.navigation}
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            UserId={props.userId}
          />
        );
      case 'EditPassword':
        return (
          <EditPassword
            navigation={props.navigation}
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            UserId={props.userId}
          />
        );
      case 'QRCode':
        return <QRCode UserId={props.userId} userFaceUrl={props.userFaceUrl} />;
      case 'Signature':
        return (
          <Signature
            navigation={props.navigation}
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            UserId={props.userId}
            userInfo={props.userInfo}
          />
        );
      default:
        return (
          <ListenHistory
            ParentWidth={props.ParentWidth}
            ParentHeight={props.ParentHeight}
            navigation={props.navigation}
            UserId={props.userId}
          />
        );
    }
  })();
}

/**
 * 主样式
 */
let styleJson = {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  userFacePanel: {
    width: Dimensions.get('window').width,
    height: 135,
    marginVertical: 25,
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'row',
    userFaceContainer: {
      width: 95,
      height: 95,
      backgroundColor: 'white',
      borderRadius: 62,
      marginHorizontal: 9,
      marginVertical: 15,
      userFace: {
        width: 95,
        height: 95,
        borderRadius: 62,
      },
    },
    userName: {
      width: Dimensions.get('window').width - 135,
      height: 73,
      marginVertical: 31,
      borderColor: 'red',
      borderWidth: 0,
      flexDirection: 'column',
      line: {
        width: Dimensions.get('window').width - 137,
        height: 37,
        flexDirection: 'row',
        borderColor: 'red',
        borderWidth: 0,
      },
      text: {
        fontSize: 15,
        color: 'white',
        marginHorizontal: 10,
        marginVertical: 7,
      },
    },
  },
  userInfoPanel: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 143,
    backgroundColor: 'white',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    content: {
      width: Dimensions.get('window').width - 35,
      height: Dimensions.get('window').height - 293,
      borderColor: 'red',
      borderWidth: 0,
      marginHorizontal: 13,
      marginVertical: 25,
      tabContainer: {
        width: Dimensions.get('window').width - 35,
        height: 76,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        tabItemContainer: {
          width: 170,
          height: 63,
          borderRadius: 15,
          marginVertical: 5,
          marginHorizontal: 10,
          borderColor: '#ccc',
          borderWidth: 1,
          flexDirection: 'row',
          image: {
            width: 36,
            height: 36,
            marginVertical: 12,
            marginHorizontal: 12,
          },
          text: {
            fontSize: 21,
            fontWeight: 'bold',
            color: '#E24377',
            marginHorizontal: 8,
            marginVertical: 15,
          },
        },
      },
      tabContent: {
        width: Dimensions.get('window').width - 35,
        height: Dimensions.get('window').height - 379,
        borderColor: 'red',
        borderWidth: 0,
      },
    },
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  QRCodeWidth: {
    width: 190,
  },
};

/**
 * 尺寸自适应调整
 * @returns
 */
function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.userFacePanel.borderWidth = 0;
    styleJson.userFacePanel.userFaceContainer.width = 55;
    styleJson.userFacePanel.userFaceContainer.height = 55;
    styleJson.userFacePanel.userFaceContainer.userFace.width = 55;
    styleJson.userFacePanel.userFaceContainer.userFace.height = 55;
    styleJson.userFacePanel.userName.text.fontSize = 15;
    styleJson.userFacePanel.height = 87;
    styleJson.userInfoPanel.content.tabContainer.height = 67;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.width = 102;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.height = 43;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.marginVertical = 7;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.width = 16;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.height = 16;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.fontSize = 12;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.marginHorizontal = 3;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.marginVertical = 12;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.marginVertical = 12;
    styleJson.userInfoPanel.content.tabContent.height = screenHeight - 325;
    styleJson.QRCodeWidth.width = 112;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.QRCodeWidth.width = 160;
    styleJson.userFacePanel.height = 103;
    styleJson.userFacePanel.userFaceContainer.width = 75;
    styleJson.userFacePanel.userFaceContainer.height = 75;
    styleJson.userFacePanel.userFaceContainer.userFace.width = 75;
    styleJson.userFacePanel.userFaceContainer.userFace.height = 75;
    styleJson.userInfoPanel.content.height = screenHeight - 265;
    styleJson.userInfoPanel.content.tabContent.height = screenHeight - 329;
    styleJson.userInfoPanel.content.tabContainer.height = 67;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.width = 150;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.height = 45;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.marginVertical = 7;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.width = 25;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.height = 25;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.fontSize = 15;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.marginVertical = 12;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.marginVertical = 8;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.QRCodeWidth.width = 160;
    styleJson.userFacePanel.height = 103;
    styleJson.userFacePanel.userFaceContainer.width = 75;
    styleJson.userFacePanel.userFaceContainer.height = 75;
    styleJson.userFacePanel.userFaceContainer.userFace.width = 75;
    styleJson.userFacePanel.userFaceContainer.userFace.height = 75;
    styleJson.userInfoPanel.content.height = screenHeight - 265;
    styleJson.userInfoPanel.content.tabContent.height = screenHeight - 329;
    styleJson.userInfoPanel.content.tabContainer.height = 67;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.width = 150;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.height = 45;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.marginVertical = 7;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.width = 25;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.height = 25;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.fontSize = 15;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.text.marginVertical = 12;
    styleJson.userInfoPanel.content.tabContainer.tabItemContainer.image.marginVertical = 8;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

//底部弹窗选项
const downUpPopupItem = [
  '拍照(Camera)',
  '从相册选择(ImageLibrary)',
  '选择头像(SelectSystem)',
];

//拍照和相册选择选项
const imagePickerOption = {
  mediaType: 'photo',
  quality: 0.5,
  maxWidth: Dimensions.get('window').width / 2,
  maxHeight: Dimensions.get('window').height / 2,
  selectionLimit: 1,
};

var PopupDialog = null;

export default function Index({navigation, route}) {
  const [data, setData] = React.useState({
    PageName: 'ListenHistory',
    currentUserName: '',
    bottomPopupIsShow: false,
    isPermissionsed: false,
    userInfo: null,
  });
  React.useEffect(() => {
    Storage.get('userInfo').then(storageUserInfo => {
      setData({...data, userInfo: storageUserInfo.payload});
    });
  }, []);
  //获取用户名开始
  let userName = '';
  let userId = '-1';
  let userFaceUrl = require('../../images/userFace.png');
  let isLogin = false;
  let bottomPopupIsShow = data.bottomPopupIsShow;
  isLogin = useSelector(state => state.user.isLogin);
  //console.log('isLogin', isLogin);
  let userInfo = useSelector(state => state.user.userInfo);
  if (userInfo !== null && typeof userInfo !== 'undefined') {
    //从redux读取用户信息
    console.log('UserSetting useSelector', userInfo);
    userInfo =
      userInfo.payload === null || typeof userInfo.payload === 'undefined'
        ? userInfo
        : userInfo.payload;
    isLogin = true;
    userName = userInfo.userName;
    userId = userInfo.userId;
    userFaceUrl = {uri: userInfo.userFace};
    console.log('userName', userName);
  } else if (route.params !== null && typeof route.params !== 'undefined') {
    //从跳转参数读取用户信息
    console.log('UserSetting route', userInfo);
    userInfo = route.params.userInfo;
    isLogin = true;
    userName = userInfo.userName;
    userId = userInfo.userId;
    userFaceUrl = {uri: userInfo.userFace};
  } else {
    //从组件data获取用户信息
    //console.log('UserSetting data', userInfo);
    //userInfo = data.userInfo;
    //isLogin = true;
    //userName = userInfo.userName;
    //userId = userInfo.userId;
    //userFaceUrl = {uri: userInfo.userFace};
  }
  console.log('UserSetting userInfo', userInfo);

  //获取用户名结束
  const changePage = PageName => {
    console.log('data.PageName', data.PageName);
    setData({...data, PageName});
  };

  //页面跳转
  const gotoPage = PageName => {
    navigation.navigate(PageName, {userId: userId, userInfo: data.userInfo});
  };

  //显示底部弹窗
  const showButtomPopup = () => {
    Storage.get('userInfo').then(userInfoStorage => {
      console.log('userInfoStorage', userInfoStorage);
      let varUserInfo =
        userInfoStorage.payload === null ||
        typeof userInfoStorage.payload === 'undefined'
          ? userInfoStorage
          : userInfoStorage.payload;
      console.log('showButtomPopup varUserInfo', varUserInfo);
      if (varUserInfo !== null && typeof varUserInfo !== 'undefined') {
        setData({
          ...data,
          bottomPopupIsShow: true,
          userInfo: varUserInfo,
        });
        //console.log('PopupDialog', PopupDialog);
      } else {
        Alert.alert('错误', '没有登录不能切换头像');
      }
    });
  };

  //关闭底部弹窗
  const closeBottomPopup = show => {
    setData({...data, bottomPopupIsShow: show});
  };

  /**
   * 验证权限
   */
  const checkPermissions = async () => {
    let isPermissionsed = false;
    try {
      switch (Platform.OS) {
        case 'android':
          const grantedReadStorage = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: '申请读取文件权限',
              message: '需要申请读取文件权限',
              buttonPositive: 'OK',
            },
          );
          if (grantedReadStorage !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('没有文件读取授权无法进行后续操作');
            isPermissionsed = false;
          } else {
            isPermissionsed = true;
          }
          if (isPermissionsed) {
            const grantedWriteStorage = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: '申请写入文件权限',
                message: '需要申请写入文件权限',
                buttonPositive: 'OK',
              },
            );
            if (grantedWriteStorage !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('没有文件写入授权无法进行后续操作');
              isPermissionsed = false;
            } else {
              isPermissionsed = true;
            }
          }
          if (isPermissionsed) {
            const grantedCamera = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: '申请相机权限',
                message: '需要申请相机权限',
                buttonPositive: 'OK',
              },
            );
            if (grantedCamera !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('没有文件写入授权无法进行后续操作');
              isPermissionsed = false;
            } else {
              isPermissionsed = true;
            }
          }
          setData({...data, isPermissionsed: isPermissionsed});
          break;
      }
    } catch (exp) {
      Alert.alert('错误', `申请权限出错,原因[${exp}]`);
    }
  };

  //获得调用redux中自定义方法的钩子
  const dispatch = useDispatch();

  //上传头像
  const UploadUserFaceFun = (UserId, filePath) => {
    UploadUserFace({
      parm: {
        UserId: UserId,
        filePath: filePath,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          const {status, msg, result} = resData;
          if (status !== 0) {
            Alert.alert('错误', `上传头像失败，原因[${msg}]`);
          } else {
            let userInfoData = data.userInfo;
            userInfoData.userFace = result;
            updateLocalUserFace(userInfoData);
            setData({...data, userInfo: userInfoData});
          }
        });
      },
    });
  };

  /**
   * 修改本地用户信息
   * @param {用户信息参数} userInfoData
   */
  const updateLocalUserFace = userInfoData => {
    let vUserInfo = {payload: userInfoData};
    dispatch(uploadUser(vUserInfo.payload));
    Storage.update('userInfo', vUserInfo);
  };

  //显示拍照
  const showCamera = () => {
    checkPermissions().then(() => {
      let isPermissionsed = data.isPermissionsed;
      if (isPermissionsed) {
        launchCamera(imagePickerOption).then(result => {
          let userIdValue = data.userInfo.userId;
          let filePath = result.assets[0].uri;
          UploadUserFaceFun(userIdValue, filePath);
        });
      }
    });
  };

  //显示相册
  const showImageLibrary = () => {
    checkPermissions().then(() => {
      let isPermissionsed = data.isPermissionsed;
      if (isPermissionsed) {
        launchImageLibrary(imagePickerOption).then(result => {
          let userIdValue = data.userInfo.userId;
          let filePath = result.assets[0].uri;
          UploadUserFaceFun(userIdValue, filePath);
        });
      }
    });
  };

  /**
   * 底部弹出框回调函数
   * @param {选项索引} index
   */
  const bottomPopupCallBack = index => {
    console.log('bottomPopupCallBack index', index);
    switch (index) {
      case 0:
        //拍照
        showCamera(imagePickerOption);
        break;
      case 1:
        //摄像
        showImageLibrary(imagePickerOption);
        break;
      case 2:
        //跳转到头像选择页
        gotoPage('UserFace');
        break;
    }
  };
  console.log('bottomPopupIsShow', bottomPopupIsShow);
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        source={require('../../images/UserPanelBG.png')}>
        <View style={styles.userFacePanel}>
          <View style={styles.userFacePanel.userFaceContainer}>
            <TouchableOpacity
              onPress={() => {
                showButtomPopup();
              }}>
              <Image
                style={styles.userFacePanel.userFaceContainer.userFace}
                source={userFaceUrl}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.userFacePanel.userName}>
            <View style={styles.userFacePanel.userName.line}>
              {isLogin ? (
                <Text style={styles.userFacePanel.userName.text}>
                  {userName}
                </Text>
              ) : (
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => navigation.navigate('NoAuth')}>
                  <Text style={styles.userFacePanel.userName.text}>登录</Text>
                  <Text style={styles.userFacePanel.userName.text}>/</Text>
                  <Text style={styles.userFacePanel.userName.text}>注册</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.userFacePanel.userName.line}>
              <Text style={styles.userFacePanel.userName.text}>
                点击头像修改头像
              </Text>
            </View>
          </View>
        </View>
        <Animatable.View animation={'fadeInUp'} style={styles.userInfoPanel}>
          <View style={styles.userInfoPanel.content}>
            <View style={styles.userInfoPanel.content.tabContainer}>
              <ScrollView horizontal={true}>
                {/*最近在听B*/}
                <TouchableOpacity onPress={() => changePage('ListenHistory')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      {
                        backgroundColor:
                          data.PageName === 'ListenHistory'
                            ? '#61C3F4'
                            : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/ListenHistoryIcon.png')}
                    />
                    <Text
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text
                      }>
                      最近在听
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*最近在听E*/}
                {/*分享历史B*/}
                <TouchableOpacity onPress={() => changePage('ShareHistory')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      {
                        backgroundColor:
                          data.PageName === 'ShareHistory' ? '#61C3F4' : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/ShareHistory.png')}
                    />
                    <Text
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text
                      }>
                      分享历史
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*分享历史E*/}
                {/*我的专辑B*/}
                <TouchableOpacity onPress={() => changePage('AlbumList')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      {
                        backgroundColor:
                          data.PageName === 'AlbumList' ? '#61C3F4' : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/AlbumIcon.png')}
                    />
                    <Text
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text
                      }>
                      我的专辑
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*我的专辑E*/}
                {/*好友列表B*/}
                <TouchableOpacity onPress={() => changePage('Friends')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      {
                        backgroundColor:
                          data.PageName === 'Friends' ? '#61C3F4' : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/FriendsIcon.png')}
                    />
                    <Text
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text
                      }>
                      好友列表
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*好友列表E*/}
                {/*我的签名B*/}
                <TouchableOpacity onPress={() => changePage('Signature')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      {
                        backgroundColor:
                          data.PageName === 'Signature' ? '#61C3F4' : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/DigitalSignature.png')}
                    />
                    <Text
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text
                      }>
                      我的签名
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*我的签名E*/}
                {/*修改密码B*/}
                <TouchableOpacity onPress={() => changePage('EditPassword')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      {
                        backgroundColor:
                          data.PageName === 'EditPassword' ? '#61C3F4' : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/EditPassword.png')}
                    />
                    <Text
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text
                      }>
                      修改密码
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*修改密码E*/}
                {/*我的二维码B*/}
                <TouchableOpacity onPress={() => changePage('QRCode')}>
                  <View
                    style={[
                      styles.userInfoPanel.content.tabContainer
                        .tabItemContainer,
                      styles.QRCodeWidth,
                      {
                        backgroundColor:
                          data.PageName === 'QRCode' ? '#61C3F4' : '#ccc',
                      },
                    ]}>
                    <Image
                      style={
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.image
                      }
                      source={require('../../images/ScanQRCode.png')}
                    />
                    <Text
                      style={[
                        styles.userInfoPanel.content.tabContainer
                          .tabItemContainer.text,
                      ]}>
                      我的二维码
                    </Text>
                  </View>
                </TouchableOpacity>
                {/*我的二维码E*/}
              </ScrollView>
            </View>
            <View style={styles.userInfoPanel.content.tabContent}>
              <GetTabPage
                userInfo={userInfo}
                userId={userId}
                ParentWidth={styleJson.userInfoPanel.content.tabContent.width}
                ParentHeight={styleJson.userInfoPanel.content.tabContent.height}
                navigation={navigation}
                PageName={data.PageName}
                userFaceUrl={userFaceUrl}
              />
            </View>
          </View>
        </Animatable.View>
        <CustomAlertDialog
          ref={r => (PopupDialog = r)}
          entityList={downUpPopupItem}
          show={bottomPopupIsShow}
          callback={index => {
            bottomPopupCallBack(index);
          }}
          closeModal={show => {
            closeBottomPopup(show);
          }}
        />
      </ImageBackground>
    </View>
  );
}
