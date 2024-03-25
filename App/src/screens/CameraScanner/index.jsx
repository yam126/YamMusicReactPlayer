/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  Animated,
  Easing,
  Image,
  Alert,
  Vibration,
  Dimensions,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import LocalBarcodeRecognizer from 'react-native-local-barcode-recognizer';
import Torch from 'react-native-torch';
import Toast, {DURATION} from 'react-native-easy-toast';
import Storage from '../../utils/storage';
import {AddFriend, AddSharingHistory} from '../../utils/api';

//相册选择选项
const imagePickerOption = {
  mediaType: 'photo',
  quality: 0.5,
  maxWidth: Dimensions.get('window').width / 2,
  maxHeight: Dimensions.get('window').height / 2,
  selectionLimit: 1,
  includeBase64: true,
};

export default class ScannerScreen extends React.Component {
  static navigationOptions = {
    title: 'Scanner',
  };

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      flashLight: 'off', //闪光灯状态默认关闭
      currentCamera: 'back',
      animation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.startAnimation();
    });
  }

  componentWillUnmount() {
    this.setState({
      show: false,
    });
  }

  startAnimation() {
    if (this.state.show) {
      this.state.animation.setValue(0);
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
      }).start(() => this.startAnimation());
    }
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  // 识别图片二维码
  recoginze = async data => {
    let result = await LocalBarcodeRecognizer.decode(data, {
      codeTypes: ['ean13', 'qr'],
    });
    console.log('recoginze result', result);
    if (result) {
      //成功操作
      this.analysisScannerResult(result);
    }
  };

  showImageLibrary = () => {
    launchImageLibrary(imagePickerOption).then(result => {
      console.log('showImageLibrary result', result);
      if (!result.didCancel) {
        let imageSource = result.assets[0].base64;
        this.recoginze(imageSource);
      }
    });
  };

  //改变闪光灯状态
  changeFlashLight = async () => {
    let flashLight = this.state.flashLight;
    let isTorchOn = false;
    const grantedFLASHLIGHT = await PermissionsAndroid.request(
      'android.permission.FLASHLIGHT',
      {
        title: '开启闪光灯',
        message: '需要申请闪光灯权限',
        buttonPositive: 'OK',
      },
    );
    if (flashLight === 'off') {
      flashLight = 'on';
      isTorchOn = true;
    } else {
      flashLight = 'off';
      isTorchOn = false;
    }
    if (Platform.OS === 'ios') {
      Torch.switchState(isTorchOn);
    } else if (Platform.OS === 'android') {
      if (grantedFLASHLIGHT) {
        Torch.requestCameraPermission(
          '摄像头权限', // dialog title
          '开启闪光灯需要有摄像头的使用权限', // dialog body
        ).then(cameraAllowed => {
          console.log('requestCameraPermission cameraAllowed', cameraAllowed);
          console.log('requestCameraPermission isTorchOn', isTorchOn);
          if (cameraAllowed) {
            Torch.switchState(isTorchOn);
          }
        });
      }
    }
    this.setState({flashLight: flashLight});
  };

  /**
   * 弹出消息提示框
   * @param {消息提示内容} toastMessage
   */
  showToast = toastMessage => {
    this.toast.show(toastMessage);
  };

  //改变前后摄像头
  changeCurrentCamera = () => {
    let currentCamera = this.state.currentCamera;
    if (currentCamera === 'back') {
      currentCamera = 'front';
      this.showToast('前置摄像头');
    } else {
      currentCamera = 'back';
      this.showToast('后置摄像头');
    }
    this.setState({currentCamera: currentCamera});
  };

  JoinFriend = (userId, friendId) => {
    AddFriend({
      parm: {
        userId: userId,
        friendId: friendId,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          console.log('AddFriend resData', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('AddFriend response data', resData);
            const {status, msg} = resData;
            if (status !== 0) {
              Alert.alert('错误', `添加好友出错,原因[${msg}]`);
            } else {
              Alert.alert('成功', '添加好友成功');
              this.gotoBack();
            }
          }
        });
      },
    });
  };

  AddSharingHistoryApi = (songId, shareTarget, shareUser) => {
    AddSharingHistory({
      parm: {
        songId: songId,
        shareTarget: shareTarget,
        shareUser: shareUser,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          console.log('AddSharingHistoryApi resData', resData);
        });
      },
      errorCallback: error => {
        console.log('AddSharingHistoryApi error', error);
      },
    });
  };

  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };

  /**
   * 分析扫描结果
   * @param {扫描结果} scannerResult
   */
  analysisScannerResult = scannerResult => {
    try {
      console.log('analysisScannerResult scannerResult', scannerResult);
      var QRCodeObject = JSON.parse(scannerResult);
      if (
        QRCodeObject.Action === null ||
        typeof QRCodeObject.Action === 'undefined'
      ) {
        throw '返回的结果格式不正确';
      }
      if (
        QRCodeObject.Value === null ||
        typeof QRCodeObject.Value === 'undefined'
      ) {
        throw '返回的结果格式不正确';
      }
      switch (QRCodeObject.Action) {
        case 'AddFriend':
          Storage.get('userInfo').then(userInfo => {
            if (
              userInfo.payload === null ||
              typeof userInfo.payload === 'undefined'
            ) {
              Alert.alert('错误', '还没有登录请先登录');
            } else {
              let userId = userInfo.payload.userId;
              let friendId = QRCodeObject.Value;
              if (userId === friendId) {
                Alert.alert('错误', '无法将自己加为好友');
              } else {
                this.JoinFriend(userId, friendId);
              }
            }
          });
          break;
        case 'ShareMusic':
          let songId = QRCodeObject.Value.split('-')[0];
          let shareUser = QRCodeObject.Value.split('-')[1];
          Storage.get('userInfo').then(userInfo => {
            if (
              userInfo.payload !== null ||
              typeof userInfo.payload !== 'undefined'
            ) {
              let shareTarget = userInfo.payload.userId;
              this.AddSharingHistoryApi(songId, shareTarget, shareUser);
            }
          });
          this.gotoPlay(QRCodeObject.Value);
          break;
      }
    } catch (e) {
      Alert.alert(
        '错误',
        `解析出错\n扫描结果[${scannerResult}]\n错误原因[${e}]`,
      );
    }
  };

  render() {
    let scanView = null;
    if (Platform.OS === 'ios') {
      scanView = (
        <RNCamera
          style={styles.preview}
          type={
            this.state.currentCamera === 'back'
              ? RNCamera.Constants.Type.back
              : RNCamera.Constants.Type.front
          }
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={e => this.barcodeReceived(e)}>
          <View
            style={{
              height: (height - 264) / 3,
              width: width,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={styles.itemStyle} />
            <View style={styles.rectangle}>
              <Image
                style={[
                  styles.rectangle,
                  {position: 'absolute', left: 0, top: 0},
                ]}
                source={require('../../images/icon_scan_rect.png')}
              />
              <Animated.View
                style={[
                  styles.animatedStyle,
                  {
                    transform: [
                      {
                        translateY: this.state.animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 200],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <View style={styles.itemStyle} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: width,
              alignItems: 'center',
            }}>
            <Text style={styles.textStyle}>将二维码放入框内，即可自动扫描</Text>
          </View>
        </RNCamera>
      );
    } else if (Platform.OS === 'android') {
      scanView = (
        <RNCamera
          style={styles.preview}
          type={
            this.state.currentCamera === 'back'
              ? RNCamera.Constants.Type.back
              : RNCamera.Constants.Type.front
          }
          googleVisionBarcodeType={
            RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE
          }
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={e => this.barcodeReceived(e)}>
          <View
            style={{
              height: (height - 244) / 3,
              width: width,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={styles.itemStyle} />
            <View style={styles.rectangle}>
              <Image
                style={[
                  styles.rectangle,
                  {position: 'absolute', left: 0, top: 0},
                ]}
                source={require('../../images/icon_scan_rect.png')}
              />
              <Animated.View
                style={[
                  styles.animatedStyle,
                  {
                    transform: [
                      {
                        translateY: this.state.animation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 200],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <View style={styles.itemStyle} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: width,
              alignItems: 'center',
            }}>
            <Text style={styles.textStyle}>将二维码放入框内，即可自动扫描</Text>
          </View>
        </RNCamera>
      );
    }
    return (
      <View style={styles.container}>
        <Toast ref={toast => (this.toast = toast)} />
        <View style={styles.barHeader}>
          <TouchableOpacity
            onPress={() => {
              this.gotoBack();
            }}>
            <Icon
              style={styles.forwardBack}
              name="chevron-back-outline"
              size={styles.forwardBack.iconSize}
              color={'#FFFFFF'}
            />
          </TouchableOpacity>
          <View style={styles.AppBarTitleContainer}>
            <Text numberOfLines={1} style={styles.AppBarTitle}>
              扫描二维码
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>{scanView}</View>
        <View style={styles.controlContainer}>
          {/*前后相机切换B*/}
          <View style={styles.controlItemContainer}>
            <TouchableOpacity
              onPress={() => {
                this.changeCurrentCamera();
              }}>
              <Image
                style={styles.controlItemIcon}
                source={require('../../images/reverseCamera.png')}
              />
            </TouchableOpacity>
          </View>
          {/*前后相机切换E*/}
          {/*闪光灯B*/}
          {/*<View style={styles.controlItemContainer}>
            <TouchableOpacity
              onPress={() => {
                this.changeFlashLight();
              }}>
              <Image
                style={styles.controlItemIcon}
                source={
                  this.state.flashLight === 'off'
                    ? require('../../images/flashOff.png')
                    : require('../../images/flashOn.png')
                }
              />
            </TouchableOpacity>
          </View>*/}
          {/*闪光灯E*/}
          {/*相册B*/}
          <View style={styles.controlItemContainer}>
            <TouchableOpacity
              onPress={() => {
                this.showImageLibrary();
              }}>
              <Image
                style={styles.controlItemIcon}
                source={require('../../images/PhotoAlbum.png')}
              />
            </TouchableOpacity>
          </View>
          {/*相册E*/}
        </View>
      </View>
    );
  }

  barcodeReceived(e) {
    if (this.state.show) {
      this.state.show = false;
      if (e) {
        //Vibration.vibrate([0, 500], false);
        let result = e.data;
        this.analysisScannerResult(result);
      } else {
        Alert.alert(
          '提示',
          '扫描失败，请将手机对准二维码重新尝试',
          [
            {
              text: '确定',
              onPress: () => {
                this.setState({
                  show: true,
                });
              },
            },
          ],
          {cancelable: false},
        );
      }
    }
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
  },
  itemStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: (width - 200) / 2,
    height: 200,
  },
  textStyle: {
    color: '#fff',
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
  animatedStyle: {
    height: 2,
    backgroundColor: '#00c050',
  },
  rectangle: {
    height: 200,
    width: 200,
  },
  mainContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 148,
  },
  controlContainer: {
    width: Dimensions.get('window').width,
    height: 93,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  controlItemContainer: {
    width: Dimensions.get('window').width / 2,
    height: 93,
    flexDirection: 'column',
    //justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  controlItemIcon: {
    width: 37,
    height: 37,
    marginVertical: 8,
    resizeMode: 'stretch',
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  AppBarTitleContainer: {
    width: Dimensions.get('window').width - 75,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  AppBarTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
    color: 'white',
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
    color: '#FFFFFF',
  },
});
